const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db/database");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for file uploads with better naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, designation, rm_id, rm_name FROM users WHERE id = ?",
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


// ADD PROJECT DETAILS
router.post(
  "/add",
  authenticate,
  upload.fields([
    { name: "eod_attachment", maxCount: 1 },
    { name: "payment_attachment", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Get authenticated user info from database
      const [userRows] = await pool.query(
        "SELECT id, name, designation, rm_id, rm_name FROM users WHERE id = ?",
        [req.user.id]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userRows[0];

      const {
        project_name,
        todays_task,
        eod_summary,
        payment_request
      } = req.body;

      const eod_file = req.files["eod_attachment"]
        ? req.files["eod_attachment"][0].filename
        : null;

      const payment_file = req.files["payment_attachment"]
        ? req.files["payment_attachment"][0].filename
        : null;

      // Insert into database with new table structure
      await pool.query(
        `INSERT INTO project_details 
        (user_id, user_name, designation, rm_id, rm_name, project_name, todays_task, eod_summary, eod_attachment, payment_request, payment_attachment, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.name,
          user.designation,
          user.rm_id,
          user.rm_name,
          project_name,
          todays_task,
          eod_summary,
          eod_file,
          payment_request,
          payment_file,
          1 // Default status
        ]
      );

      res.json({ message: "Project details submitted successfully" });
    } catch (err) {
      console.error("Error inserting project details:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;

