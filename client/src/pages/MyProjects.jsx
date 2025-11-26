import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Eye, CheckCircle } from "lucide-react";
import styles from "./MyProjects.module.css";

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = JSON.parse(atob(token.split('.')[1])).id;

            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/projects/user/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch projects");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your projects...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Project Submissions</h1>
                <p className={styles.subtitle}>
                    View all your daily project updates and EOD summaries
                </p>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Project Name</th>
                                <th>Reporting Manager</th>
                                <th>Today's Task</th>
                                <th>EOD Summary</th>
                                <th>EOD Attachment</th>
                                <th>Payment Request</th>
                                <th>Payment Attachment</th>
                                <th>Status</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr key={project.id}>
                                    <td>{index + 1}</td>
                                    <td className={styles.projectCell}>{project.project_name || '-'}</td>
                                    <td>{project.rm_name || '-'}</td>
                                    <td className={styles.taskCell}>
                                        {project.todays_task ? (
                                            <div className={styles.textPreview}>
                                                {project.todays_task.substring(0, 100)}
                                                {project.todays_task.length > 100 && '...'}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className={styles.summaryCell}>
                                        {project.eod_summary ? (
                                            <div className={styles.textPreview}>
                                                {project.eod_summary.substring(0, 100)}
                                                {project.eod_summary.length > 100 && '...'}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className={styles.attachmentCell}>
                                        {project.eod_attachment ? (
                                            <button className={styles.attachBtn}>
                                                <FileText size={14} />
                                                View
                                            </button>
                                        ) : '-'}
                                    </td>
                                    <td className={styles.paymentCell}>
                                        {project.payment_request || '-'}
                                    </td>
                                    <td className={styles.attachmentCell}>
                                        {project.payment_attachment ? (
                                            <button className={styles.attachBtn}>
                                                <FileText size={14} />
                                                View
                                            </button>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${project.status === 1 ? styles.active : styles.inactive}`}>
                                            {project.status === 1 ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    Active
                                                </>
                                            ) : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className={styles.dateCell}>
                                        {new Date(project.created_at).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className={styles.actionsCell}>
                                        <button className={styles.actionBtn} title="View Details">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {projects.length === 0 && (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <p>No project submissions yet</p>
                </div>
            )}
        </div>
    );
};

export default MyProjects;
