const express = require("express");
const multer = require("multer");
const pool = require("../db/database");
const authenticate = require("../middleware/authMiddleware")


const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, designation, rm_name FROM users WHERE id = ?",
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
  upload.fields([
    { name: "eod_attachment", maxCount: 1 },
    { name: "payment_attachment", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        name,
        designation,
        rm_name,
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

      await pool.query(
        `INSERT INTO project_details 
        (name, designation, rm_name, project_name, todays_task, eod_summary, eod_attachment, payment_request, payment_attachment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          designation,
          rm_name,
          project_name,
          todays_task,
          eod_summary,
          eod_file,
          payment_request,
          payment_file
        ]
      );

      res.json({ message: "Project details submitted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

