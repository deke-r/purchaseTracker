import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './EmployeeDashboard.module.css' // Reusing EmployeeDashboard styles

const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        pendingRequests: 0,
        totalActions: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            // Fetch pending requests count (reusing the same endpoint logic or a specific stats endpoint if available)
            // For now, we'll just fetch the list and count
            const response = await axios.get(`${import.meta.env.VITE_URL_API}/materials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats({
                pendingRequests: response.data.length,
                totalActions: 0 // Placeholder if we don't have this data yet
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
                    <h1 className={styles.title}>Manager Dashboard</h1>
                    <p className={styles.subtitle}>
                        Review and approve pending material requests
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
                                <Link to='/dashboard/manager/pending-material-requests' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>⏳</span>
                                    Pending Material Requests
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
                            <h2 className={styles.cardTitle}>Overview</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.statsContainer}>
                                <div className={styles.statItem}>
                                    <div className={styles.statIcon}>📝</div>
                                    <div className={styles.statContent}>
                                        <p className={styles.statLabel}>Pending Requests</p>
                                        <p className={styles.statValue}>{stats.pendingRequests}</p>
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

export default ManagerDashboard
