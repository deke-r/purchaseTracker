import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FileText, Eye, CheckCircle, XCircle } from "lucide-react";
import styles from "./ViewManagerActions.module.css";

const ViewManagerActions = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/material-requests/manager-actions`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching manager actions:", error);
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        if (action === 'APPROVE') {
            return (
                <span className={styles.actionBadgeApproved}>
                    <CheckCircle size={16} />
                    Approved
                </span>
            );
        }
        if (action === 'REJECT') {
            return (
                <span className={styles.actionBadgeRejected}>
                    <XCircle size={16} />
                    Rejected
                </span>
            );
        }
        return <span className={styles.actionBadgeOther}>{action}</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your actions...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Actions</h1>
                <p className={styles.subtitle}>
                    View all material requests you have approved or rejected
                </p>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Vendor</th>
                                <th>Invoice Details</th>
                                <th>Value Details</th>
                                <th>Payment Details</th>
                                <th>Your Action</th>
                                <th>Remarks</th>
                                <th>Action Date</th>
                                <th>Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => (
                                <tr key={request.id}>
                                    <td>{index + 1}</td>

                                    <td className={styles.vendorCell}>
                                        {request.vendor_name || '-'}
                                    </td>

                                    <td className={styles.invoiceCell}>
                                        <div className={styles.invoiceGroup}>
                                            <span className={styles.label}>Invoice Scope:</span>
                                            <span>{request.invoice_scope || '-'}</span>
                                        </div>
                                        <div className={styles.invoiceGroup}>
                                            <span className={styles.label}>Invoice Reference:</span>
                                            <span>{request.invoice_reference || '-'}</span>
                                        </div>
                                        <div className={styles.invoiceGroup}>
                                            <span className={styles.label}>Invoice Number:</span>
                                            <span>{request.invoice_number || '-'}</span>
                                        </div>
                                    </td>

                                    <td className={styles.valueCell}>
                                        <div className={styles.valueGroup}>
                                            <span className={styles.label}>Base Value:</span>
                                            <span className={styles.amount}>{formatCurrency(request.base_value)}</span>
                                        </div>
                                        <div className={styles.valueGroup}>
                                            <span className={styles.label}>GST:</span>
                                            <span className={styles.amount}>{formatCurrency(request.gst)}</span>
                                        </div>
                                        <div className={styles.valueGroup}>
                                            <span className={styles.label}>Freight/Insurance:</span>
                                            <span className={styles.amount}>{formatCurrency(request.freight_insurance)}</span>
                                        </div>
                                    </td>

                                    <td className={styles.paymentCell}>
                                        <div className={styles.paymentGroup}>
                                            <span className={styles.label}>Amount Paid:</span>
                                            <span className={styles.amountPaid}>{formatCurrency(request.amount_paid)}</span>
                                        </div>
                                        <div className={styles.paymentGroup}>
                                            <span className={styles.label}>Retention Amount:</span>
                                            <span className={styles.amount}>{formatCurrency(request.retention_amount)}</span>
                                        </div>
                                    </td>

                                    <td className={styles.actionCell}>
                                        {getActionBadge(request.manager_action)}
                                    </td>

                                    <td className={styles.remarksCell}>
                                        {request.manager_remarks || '-'}
                                    </td>

                                    <td className={styles.dateCell}>
                                        {formatDate(request.action_date)}
                                    </td>

                                    <td className={styles.documentsCell}>
                                        {request.pdf_path ? (
                                            <button className={styles.docButton}>
                                                <FileText size={16} />
                                                View
                                            </button>
                                        ) : (
                                            <span className={styles.noDoc}>-</span>
                                        )}
                                    </td>

                                    <td className={styles.actionsCell}>
                                        <Link to={`/dashboard/manager/pending-material-requests/details?ticket-id=${request.id}`} className={styles.actionBtn} title="View Details">
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {requests.length === 0 && (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <p>No actions found</p>
                    <p className={styles.emptySubtext}>You haven't approved or rejected any requests yet</p>
                </div>
            )}
        </div>
    );
};

export default ViewManagerActions;
