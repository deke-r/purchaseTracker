import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, Building2, Settings, BarChart3 } from "lucide-react";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDepartments: 0,
        activeUsers: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const [usersRes, deptsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_URL_API}/admin/users/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_URL_API}/admin/departments/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const users = usersRes.data;
            const departments = deptsRes.data;

            setStats({
                totalUsers: users.length,
                totalDepartments: departments.length,
                activeUsers: users.filter(u => u.status === 1).length
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const menuItems = [
        {
            title: "Manage Users",
            description: "Add, edit, delete, and manage user accounts",
            icon: Users,
            path: "/dashboard/admin/users",
            color: "#0C4379"
        },
        {
            title: "Manage Departments",
            description: "Add, edit, and organize departments",
            icon: Building2,
            path: "/dashboard/admin/departments",
            color: "#059669"
        },
        {
            title: "System Settings",
            description: "Configure system preferences and settings",
            icon: Settings,
            path: "/dashboard/admin/settings",
            color: "#7c3aed"
        },
        {
            title: "Reports & Analytics",
            description: "View system reports and analytics",
            icon: BarChart3,
            path: "/dashboard/admin/reports",
            color: "#dc2626"
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>
                <p className={styles.subtitle}>
                    Manage your system, users, and configurations
                </p>
            </div>

            <div className={styles.menuGrid}>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className={styles.menuCard}
                            onClick={() => navigate(item.path)}
                        >
                            <div
                                className={styles.menuIcon}
                                style={{ backgroundColor: `${item.color}15`, color: item.color }}
                            >
                                <Icon size={28} />
                            </div>
                            <div className={styles.menuContent}>
                                <h3 className={styles.menuTitle}>{item.title}</h3>
                                <p className={styles.menuDescription}>{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
                <h2 className={styles.sectionTitle}>Quick Overview</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Users size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Total Users</p>
                            <p className={styles.statValue}>{stats.totalUsers}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Building2 size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Departments</p>
                            <p className={styles.statValue}>{stats.totalDepartments}</p>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Users size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <p className={styles.statLabel}>Active Users</p>
                            <p className={styles.statValue}>{stats.activeUsers}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
