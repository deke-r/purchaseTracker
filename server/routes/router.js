const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const pool = require("../db/database")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authenticate = require("../middleware/authMiddleware")

/* -------------------------------------
   FILE UPLOAD STORAGE
---------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

/* -------------------------------------
   LOGIN
---------------------------------------- */
router.post("/login", async (req, res) => {
  const { userId, password } = req.body

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [userId])

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = users[0]
    console.log(user)
    const isMatch = await bcrypt.compare(password, user.pass)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.SECRET_KEY || "secret_key",
      { expiresIn: "1h" }
    )

    return res.json({
      message: "Login successful",
      token,
      role: user.role
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   GET CURRENT USER
---------------------------------------- */
router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(rows[0])

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   CREATE REQUEST
---------------------------------------- */
router.post("/material-request", authenticate, upload.single("file"), async (req, res) => {
  try {
    const {
      vendor_name,
      invoice_scope,
      invoice_reference,
      invoice_number,
      comments,
      base_value,
      gst,
      freight_insurance,
      ipc_amount,
      tds,
      penalty,
      payment_on_hold,
      mobilization_advance_recovery,
      amount_paid,
      retention_amount,
    } = req.body

    const pdf_path = req.file ? req.file.filename : null

    const [result] = await pool.query(
      `INSERT INTO requests 
        (vendor_name, invoice_scope, invoice_reference, invoice_number, comments,
         base_value, gst, freight_insurance, ipc_amount, tds, penalty,
         payment_on_hold, mobilization_advance_recovery, amount_paid, retention_amount,
         pdf_path, created_by, status, payment_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'PENDING', NOW(), NOW())`,
      [
        vendor_name, invoice_scope, invoice_reference, invoice_number,
        comments, base_value, gst, freight_insurance, ipc_amount, tds,
        penalty, payment_on_hold, mobilization_advance_recovery,
        amount_paid, retention_amount, pdf_path, req.user.id
      ]
    )

    const requestId = result.insertId

    // Add history
    await pool.query(
      `INSERT INTO approval_history 
        (request_id, role, action, comment, user_name, created_at, updated_at)
       VALUES (?, 'EMPLOYEE', 'SUBMITTED', 'Request created', ?, NOW(), NOW())`,
      [requestId, req.user.name]
    )

    res.status(201).json({ message: "Request submitted", id: requestId })

  } catch (err) {
    console.error("Create Request Error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   GET REQUEST LIST (ROLE BASED)
---------------------------------------- */
router.get("/materials", authenticate, async (req, res) => {
  try {
    let query = "SELECT * FROM requests"
    const params = []

    if (req.user.role === "EMPLOYEE") {
      query += " WHERE created_by = ?"
      params.push(req.user.id)
    } else if (req.user.role === "manager") {
      query += " WHERE status = 1" // PENDING_MANAGER
    } else if (req.user.role === "purchase") {
      query += " WHERE status = 2" // PENDING_PURCHASE
    }

    query += " ORDER BY created_at DESC"

    const [requests] = await pool.query(query, params)

    const formatted = requests.map(r => ({
      ...r,
      ticket_id: r.id,
      project_details: r.invoice_scope,
      sheet_no: r.invoice_reference,
      requirement_date: r.created_at,
      delivery_place: r.vendor_name,
      status_track: r.status,
    }))

    res.json(formatted)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   GET REQUEST DETAILS
---------------------------------------- */
router.get("/pending-material-requests/details", authenticate, async (req, res) => {
  try {
    const id = req.query["ticket-id"]

    const [requests] = await pool.query(
      "SELECT * FROM requests WHERE id = ?",
      [id]
    )

    if (requests.length === 0) {
      return res.status(404).json({ message: "Request not found" })
    }

    const request = requests[0]

    const [history] = await pool.query(
      "SELECT * FROM approval_history WHERE request_id = ? ORDER BY created_at ASC",
      [id]
    )

    res.json({
      request: {
        ...request,
        ticket_id: request.id,
        project_details: request.invoice_scope,
        sheet_no: request.invoice_reference,
        requirement_date: request.created_at,
        delivery_place: request.vendor_name,
        status_track: request.status,
        attachment: request.pdf_path
      },
      items: [],
      history
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   UPDATE STATUS (APPROVE / REJECT / HOLD)
---------------------------------------- */
router.put("/pending-material-requests/update-status", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { ticket_id, action, remarks } = req.body

    const [requests] = await pool.query("SELECT * FROM requests WHERE id = ?", [ticket_id])

    if (requests.length === 0) {
      return res.status(404).json({ message: "Request not found" })
    }

    const request = requests[0]
    const userRole = req.user.role

    let nextStatus = request.status
    let nextPaymentStatus = request.payment_status

    /* --- BUSINESS LOGIC --- */
    if (action === "REJECT") {
      nextStatus = 4; // REJECTED

    } else if (action === "HOLD") {
      nextStatus = 5; // ON_HOLD

    } else if (action === "SEND_BACK") {
      nextStatus = 6; // SENT_BACK_EMPLOYEE

    } else if (action === "APPROVE") {
      if (userRole === "manager") {
        nextStatus = 2; // PENDING_PURCHASE
      } else if (userRole === "purchase") {
        nextStatus = 3; // APPROVED
        nextPaymentStatus = "SCHEDULED";
      }
    }

    /* --- UPDATE IN DB --- */
    await pool.query(
      "UPDATE requests SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
      [nextStatus, nextPaymentStatus, ticket_id]
    )

    await pool.query(
      `INSERT INTO approval_history 
         (request_id, role, action, comment, user_name, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [ticket_id, userRole, action, remarks, req.user.name]
    )

    res.json({ message: "Status updated", status: nextStatus })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Cancel material request (for employees)
router.put("/material-requests/cancel", authenticate, async (req, res) => {
  try {
    const { ticket_id, remarks } = req.body
    const userId = req.user.id

    const [requests] = await pool.query("SELECT * FROM requests WHERE id = ?", [ticket_id])

    if (requests.length === 0) {
      return res.status(404).json({ message: "Request not found" })
    }

    const request = requests[0]

    // Check if user is the creator of the request
    if (request.created_by !== userId) {
      return res.status(403).json({ message: "You can only cancel your own requests" })
    }

    // Check if request is still pending (status 1 or 2)
    if (request.status !== 1 && request.status !== 2) {
      return res.status(400).json({ message: "Request cannot be cancelled at this stage" })
    }

    // Update status to CANCELLED (7)
    await pool.query(
      "UPDATE requests SET status = 7 WHERE id = ?",
      [ticket_id]
    )

    // Add to approval history
    await pool.query(
      `INSERT INTO approval_history 
       (request_id, user_id, role, action, comment) 
       VALUES (?, ?, ?, ?, ?)`,
      [ticket_id, userId, 'employee', 'CANCELLED', remarks || 'Request cancelled by employee']
    )

    res.json({ message: "Request cancelled successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})















/* -------------------------------------
   GET ACCOUNT DETAILS (CURRENT USER)
---------------------------------------- */
router.get("/account", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, department, status, created_at FROM users WHERE id = ?",
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log(rows)

    res.json(rows[0])

  } catch (err) {
    console.error("GET /account error:", err)
    res.status(500).json({ message: "Server error" })
  }
})

/* -------------------------------------
   UPDATE ACCOUNT DETAILS (CURRENT USER)
   - Update name / department
   - Optional password change
---------------------------------------- */
router.put("/account", authenticate, async (req, res) => {
  const { name, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Validate name
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    let hashedPassword = null;

    // If user tries to change password
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please fill all password fields" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.pass);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    // Build update query ONLY for name + password
    let query = "UPDATE users SET name = ?";
    const params = [name];

    if (hashedPassword) {
      query += ", pass = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(req.user.id);

    await pool.query(query, params);

    const [updatedUser] = await pool.query(
      "SELECT id, name, email, role, department, status, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json({
      message: hashedPassword
        ? "Profile and password updated successfully"
        : "Profile updated successfully",
      user: updatedUser[0],
    });

  } catch (err) {
    console.error("PUT /account error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// GET projects by user ID
router.get("/projects/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const [projects] = await pool.query(
      `SELECT * FROM project_details WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json(projects);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET expenses by user ID (for material requests)
router.get("/expenses/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const [expenses] = await pool.query(
      `SELECT * FROM material_expenses WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json(expenses);
  } catch (err) {
    console.error("Error fetching user expenses:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET material requests by user ID
router.get("/material-requests/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const [requests] = await pool.query(
      `SELECT * FROM requests WHERE created_by = ? ORDER BY created_at DESC`,
      [userId]
    );

    res.json(requests);
  } catch (err) {
    console.error("Error fetching material requests:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router
