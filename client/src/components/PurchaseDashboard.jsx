import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './EmployeeDashboard.module.css';

export const PurchaseDashboard = () => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        fetchPendingCount();
    }, []);

    const fetchPendingCount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/materials`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const requests = response.data;
            const pending = requests.filter(r => r.status === 2).length;
            setPendingCount(pending);
        } catch (error) {
            console.error("Error fetching pending count:", error);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.dashboardWrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Purchase Dashboard</h1>
                    <p className={styles.subtitle}>Manage and approve material purchase requests</p>
                </div>

                <div className={styles.cardsGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Material Requests</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.menuList}>
                                <Link to="/dashboard/purchase/pending-material-requests" className={styles.menuItem}>
                                    Pending Material Requests
                                </Link>
                                <Link to="/dashboard/purchase/view-actions" className={styles.menuItem}>
                                    View My Actions
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Statistics</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.statsContainer}>
                                <div className={styles.statItem}>
                                    <div className={styles.statIcon}>📋</div>
                                    <div className={styles.statContent}>
                                        <p className={styles.statLabel}>Pending Approvals</p>
                                        <p className={styles.statValue}>{pendingCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseDashboard;
