import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ManageDepartments.module.css";

const ManageDepartments = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({ name: "" });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/admin/departments/all`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to fetch departments");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (editingDept) {
                await axios.put(
                    `${import.meta.env.VITE_URL_API}/admin/departments/${editingDept.id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success("Department updated successfully");
            } else {
                await axios.post(
                    `${import.meta.env.VITE_URL_API}/admin/departments`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success("Department created successfully");
            }

            setShowForm(false);
            setEditingDept(null);
            setFormData({ name: "" });
            fetchDepartments();
        } catch (error) {
            console.error("Error saving department:", error);
            toast.error(error.response?.data?.message || "Failed to save department");
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setFormData({ name: dept.name });
        setShowForm(true);
    };

    const handleDelete = async (deptId, deptName) => {
        if (!window.confirm(`Are you sure you want to delete department "${deptName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_URL_API}/admin/departments/${deptId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("Department deleted successfully");
            fetchDepartments();
        } catch (error) {
            console.error("Error deleting department:", error);
            toast.error("Failed to delete department");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingDept(null);
        setFormData({ name: "" });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/dashboard/admin")}>
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className={styles.headerTop}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Manage Departments</h1>
                        <p className={styles.subtitle}>
                            Add, edit, and organize departments
                        </p>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={20} />
                        Add Department
                    </button>
                </div>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h3 className={styles.formTitle}>
                        {editingDept ? "Edit Department" : "Add New Department"}
                    </h3>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Department Name <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                placeholder="Enter department name"
                                required
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                {editingDept ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading departments...</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {departments.map((dept) => (
                        <div key={dept.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>{dept.name}</h3>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleEdit(dept)}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(dept.id, dept.name)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <p className={styles.cardInfo}>
                                    <span className={styles.label}>Status:</span>
                                    <span className={dept.status === 1 ? styles.statusActive : styles.statusInactive}>
                                        {dept.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <p className={styles.cardInfo}>
                                    <span className={styles.label}>Created:</span>
                                    {new Date(dept.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageDepartments;
