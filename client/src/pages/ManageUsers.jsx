import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, UserCheck, UserX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddUserForm from "../components/AddUserForm";
import EditUserForm from "../components/EditUserForm";
import styles from "./ManageUsers.module.css";

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/admin/users/all`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
            setLoading(false);
        }
    };

    const handleUserAdded = () => {
        setShowAddUser(false);
        fetchUsers();
    };

    const handleUserUpdated = () => {
        setEditingUser(null);
        fetchUsers();
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_URL_API}/admin/users/${userId}/status`,
                { status: currentStatus === 1 ? 0 : 1 },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success(
                currentStatus === 1 ? "User deactivated" : "User activated"
            );
            fetchUsers();
        } catch (error) {
            console.error("Error toggling user status:", error);
            toast.error("Failed to update user status");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_URL_API}/admin/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
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
                        <h1 className={styles.title}>Manage Users</h1>
                        <p className={styles.subtitle}>
                            Add, edit, delete, and manage user accounts
                        </p>
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowAddUser(true)}
                    >
                        <Plus size={20} />
                        Add User
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading users...</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Designation</th>
                                    <th>Department</th>
                                    <th>Reporting Manager</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={styles.roleBadge}>{user.role}</span>
                                        </td>
                                        <td>{user.designation || "-"}</td>
                                        <td>{user.department || "-"}</td>
                                        <td>{user.rm_name || "-"}</td>
                                        <td>
                                            <span
                                                className={
                                                    user.status === 1
                                                        ? styles.statusActive
                                                        : styles.statusInactive
                                                }
                                            >
                                                {user.status === 1 ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => setEditingUser(user)}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionButton} ${user.status === 1
                                                            ? styles.deactivateButton
                                                            : styles.activateButton
                                                        }`}
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                    title={user.status === 1 ? "Deactivate" : "Activate"}
                                                >
                                                    {user.status === 1 ? (
                                                        <UserX size={16} />
                                                    ) : (
                                                        <UserCheck size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showAddUser && (
                <AddUserForm
                    onClose={() => setShowAddUser(false)}
                    onUserAdded={handleUserAdded}
                />
            )}

            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUserUpdated={handleUserUpdated}
                />
            )}
        </div>
    );
};

export default ManageUsers;
