import React from 'react'
import { Link } from 'react-router-dom'
import styles from './EmployeeDashboard.module.css'

export const EmployeeDashboard = () => {
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

                                <Link to='/dashboard/employee/request-for-material' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>📦</span>
                                    Request for Material
                                </Link>

                                <Link to='/dashboard/account/details' className={styles.menuItem}>
                                    <span className={styles.menuIcon}>👤</span>
                                    Account Details
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for future content */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Recent Activity</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.emptyState}>
                                <p className={styles.emptyStateText}>No recent activity to display</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
