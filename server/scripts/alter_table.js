const pool = require("../db/database");

async function alterTable() {
    try {
        console.log("Adding status column to project_details table...");

        // Check if column already exists
        const [columns] = await pool.query(
            "SHOW COLUMNS FROM project_details LIKE 'status'"
        );

        if (columns.length > 0) {
            console.log("Status column already exists!");
            process.exit(0);
        }

        // Add status column
        await pool.query(`
      ALTER TABLE project_details 
      ADD COLUMN status INT DEFAULT 1 AFTER payment_attachment
    `);

        console.log("✓ Status column added successfully!");

        // Verify the change
        const [result] = await pool.query("DESCRIBE project_details");
        console.log("\nUpdated table structure:");
        console.table(result);

        process.exit(0);
    } catch (error) {
        console.error("Error altering table:", error);
        process.exit(1);
    }
}

alterTable();
