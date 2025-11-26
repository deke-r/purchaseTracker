-- Add status column to project_details table
ALTER TABLE project_details 
ADD COLUMN status INT DEFAULT 1 AFTER payment_attachment;

-- Verify the change
DESCRIBE project_details;
