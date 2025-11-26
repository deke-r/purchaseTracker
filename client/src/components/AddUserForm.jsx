import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import Select from "react-select";
import styles from "./AddUserForm.module.css";

const AddUserForm = ({ onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        designation: "",
        department: "",
        rm_id: "",
        rm_name: ""
    });

    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
        fetchUsers();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/admin/departments`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to fetch departments");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/admin/users`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRMChange = (selectedOption) => {
        setFormData({
            ...formData,
            rm_id: selectedOption ? selectedOption.value : "",
            rm_name: selectedOption ? selectedOption.label : ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_URL_API}/admin/users`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("User created successfully!");
            onUserAdded();
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error(
                error.response?.data?.message || "Failed to create user"
            );
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: "EMPLOYEE", label: "Employee" },
        { value: "MANAGER", label: "Manager" },
        { value: "ADMIN", label: "Admin" },
        { value: "QS", label: "QS" },
        { value: "ZCM", label: "ZCM" },
        { value: "HOD", label: "HOD" },
        { value: "FM", label: "FM" }
    ];

    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.designation || user.role})`
    }));

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            borderColor: "#e5e7eb",
            "&:hover": { borderColor: "#0C4379" }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#0C4379" : state.isFocused ? "#f3f4f6" : "white",
            color: state.isSelected ? "white" : "black"
        })
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Add New User</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Name <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Email <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Password <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className={styles.input}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Role <span className={styles.required}>*</span>
                            </label>
                            <select
                                name="role"
                                className={styles.select}
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Role</option>
                                {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Designation</label>
                            <input
                                type="text"
                                name="designation"
                                className={styles.input}
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Department</label>
                            <select
                                name="department"
                                className={styles.select}
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Reporting Manager</label>
                            <Select
                                options={userOptions}
                                onChange={handleRMChange}
                                isClearable
                                placeholder="Search and select..."
                                styles={customSelectStyles}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
