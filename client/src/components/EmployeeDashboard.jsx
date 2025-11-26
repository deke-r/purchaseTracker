import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './EmployeeDashboard.module.css'

export const EmployeeDashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalMaterialRequests: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = JSON.parse(atob(token.split('.')[1])).id;

            const [projectsRes, requestsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_URL_API}/projects/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_URL_API}/material-requests/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats({
                totalProjects: projectsRes.data.length,
                totalMaterialRequests: requestsRes.data.length
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.dashboardWrapper}>

                {/* Header Section */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Employee Dashboard</h1>
                    <p className={styles.subtitle}>
                        Access your project details, material requests, and account information
                    </p>
                </div>

                {/* Cards Grid */}
                <div className={styles.cardsGrid}>

                    {/* Quick Actions Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Quick Actions</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.menuList}>
                                <Link to='/dashboard/project/details' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>📋</span>
                                    Project Details
                                </Link>

                                <Link to='/dashboard/my-projects' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>📊</span>
                                    My Projects
                                </Link>

                                <Link to='/dashboard/employee/request-for-material' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>📦</span>
                                    Request for Material
                                </Link>

                                <Link to='/dashboard/view-material-requests' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>📄</span>
                                    View Material Requests
                                </Link>

                                <Link to='/dashboard/account/details' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>👤</span>
                                    Account Details
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>My Statistics</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.statsContainer}>
                                <div className={styles.statItem}>
                                    <div className={styles.statIcon}>📊</div>
                                    <div className={styles.statContent}>
                                        <p className={styles.statLabel}>Total Projects</p>
                                        <p className={styles.statValue}>{stats.totalProjects}</p>
                                    </div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statIcon}>📦</div>
                                    <div className={styles.statContent}>
                                        <p className={styles.statLabel}>Material Requests</p>
                                        <p className={styles.statValue}>{stats.totalMaterialRequests}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

