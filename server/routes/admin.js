const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db/database");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

// GET all departments (active only, for dropdowns)
router.get("/departments", authenticate, isAdmin, async (req, res) => {
    try {
        const [departments] = await pool.query(
            "SELECT id, name FROM departments WHERE status = 1 ORDER BY name ASC"
        );
        res.json(departments);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET all departments with full details
router.get("/departments/all", authenticate, isAdmin, async (req, res) => {
    try {
        const [departments] = await pool.query(
            "SELECT id, name, status, created_at FROM departments ORDER BY created_at DESC"
        );
        res.json(departments);
    } catch (err) {
        console.error("Error fetching all departments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST create department
router.post("/departments", authenticate, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        // Check if department already exists
        const [existing] = await pool.query(
            "SELECT id FROM departments WHERE name = ?",
            [name]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Department already exists" });
        }

        await pool.query(
            "INSERT INTO departments (name, status) VALUES (?, 1)",
            [name]
        );

        res.status(201).json({ message: "Department created successfully" });
    } catch (err) {
        console.error("Error creating department:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT update department
router.put("/departments/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        await pool.query(
            "UPDATE departments SET name = ? WHERE id = ?",
            [name, id]
        );

        res.json({ message: "Department updated successfully" });
    } catch (err) {
        console.error("Error updating department:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// DELETE department
router.delete("/departments/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM departments WHERE id = ?", [id]);

        res.json({ message: "Department deleted successfully" });
    } catch (err) {
        console.error("Error deleting department:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET all users (for reporting manager dropdown)
router.get("/users", authenticate, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            "SELECT id, name, email, role, designation, department FROM users WHERE status = 1 ORDER BY name ASC"
        );
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST create new user
router.post("/users", authenticate, isAdmin, async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            designation,
            department,
            rm_id,
            rm_name
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password, and role are required"
            });
        }

        // Check if email already exists
        const [existingUser] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.query(
            `INSERT INTO users 
      (name, email, pass, role, designation, department, rm_id, rm_name, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [name, email, hashedPassword, role, designation, department, rm_id, rm_name]
        );

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET all users with full details (for admin dashboard display)
router.get("/users/all", authenticate, isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, role, designation, department, rm_name, status, created_at 
       FROM users 
       ORDER BY created_at DESC`
        );
        res.json(users);
    } catch (err) {
        console.error("Error fetching all users:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT update user
router.put("/users/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, designation, department, rm_id, rm_name } = req.body;

        // Validate required fields
        if (!name || !role) {
            return res.status(400).json({
                message: "Name and role are required"
            });
        }

        // Update user
        await pool.query(
            `UPDATE users 
       SET name = ?, role = ?, designation = ?, department = ?, rm_id = ?, rm_name = ?
       WHERE id = ?`,
            [name, role, designation, department, rm_id, rm_name, id]
        );

        res.json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT toggle user status
router.put("/users/:id/status", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.query(
            "UPDATE users SET status = ? WHERE id = ?",
            [status, id]
        );

        res.json({ message: "User status updated successfully" });
    } catch (err) {
        console.error("Error updating user status:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// DELETE user
router.delete("/users/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user
        await pool.query("DELETE FROM users WHERE id = ?", [id]);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
