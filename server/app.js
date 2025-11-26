const express = require("express")
const cors = require("cors")
const path = require("path")
const pool = require("./db/database")
const apiRoutes = require("./routes/router")
const projectRoutes = require("./routes/project")
const adminRoutes = require("./routes/admin")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/", apiRoutes)
app.use("/project", projectRoutes)
app.use("/admin", adminRoutes)

const PORT = process.env.PORT || 5000

// Initialize Database Tables
const initDB = async () => {
  try {
    const connection = await pool.getConnection()

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('EMPLOYEE', 'QS', 'ZCM', 'HOD', 'FM') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Requests Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vendor_name VARCHAR(255) NOT NULL,
        invoice_scope VARCHAR(255),
        invoice_reference VARCHAR(255),
        invoice_number VARCHAR(255),
        comments TEXT,
        base_value FLOAT,
        gst FLOAT,
        freight_insurance FLOAT,
        ipc_amount FLOAT,
        tds FLOAT,
        penalty FLOAT,
        payment_on_hold FLOAT,
        mobilization_advance_recovery FLOAT,
        amount_paid FLOAT,
        retention_amount FLOAT,
        pdf_path VARCHAR(255),
        status VARCHAR(50) DEFAULT 'PENDING_QS',
        payment_status VARCHAR(50) DEFAULT 'PENDING',
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `)

    // Approval History Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS approval_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        role VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        comment TEXT,
        user_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES requests(id)
      )
    `)

    // Seed Users if empty
    const [rows] = await connection.query("SELECT COUNT(*) AS count FROM users")

    if (rows[0].count === 0) {
      const hash = await bcrypt.hash("password", 10)
      const users = [
        ["John Employee", "emp@test.com", hash, "EMPLOYEE"],
        ["Jane QS", "qs@test.com", hash, "QS"],
        ["Mike ZCM", "zcm@test.com", hash, "ZCM"],
        ["Sarah HOD", "hod@test.com", hash, "HOD"],
        ["Boss FM", "fm@test.com", hash, "FM"]
      ]

      await connection.query("INSERT INTO users (name, email, password_hash, role) VALUES ?", [users])
      console.log("Seeded default users (password = 'password')")
    }

    connection.release()
    console.log("Database initialized successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error("Database initialization failed:", error)
  }
}

initDB()
