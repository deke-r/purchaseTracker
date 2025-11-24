import pool from "../db/database.js"
import bcrypt from "bcryptjs"

const seed = async () => {
  try {
    const connection = await pool.getConnection()

    // Drop tables if needed (optional, use with caution)
    // await connection.query("DROP TABLE IF EXISTS approval_history");
    // await connection.query("DROP TABLE IF EXISTS requests");
    // await connection.query("DROP TABLE IF EXISTS users");

    // Re-create tables (same as app.js init)
    // For simple seeding, just insert if empty

    const [rows] = await connection.query("SELECT COUNT(*) as count FROM users")

    if (rows[0].count === 0) {
      const hash = await bcrypt.hash("password", 10)
      const users = [
        ["John Employee", "emp@test.com", hash, "EMPLOYEE"],
        ["Jane QS", "qs@test.com", hash, "QS"],
        ["Mike ZCM", "zcm@test.com", hash, "ZCM"],
        ["Sarah HOD", "hod@test.com", hash, "HOD"],
        ["Boss FM", "fm@test.com", hash, "FM"],
      ]

      await connection.query("INSERT INTO users (name, email, password_hash, role) VALUES ?", [users])
      console.log("Seeded Users successfully!")
    } else {
      console.log("Users already exist.")
    }

    connection.release()
    process.exit(0)
  } catch (error) {
    console.error("Seeding failed:", error)
    process.exit(1)
  }
}

seed()
