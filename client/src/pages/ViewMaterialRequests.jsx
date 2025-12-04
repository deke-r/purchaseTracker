import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FileText, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import styles from "./ViewMaterialRequests.module.css";

const ViewMaterialRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = JSON.parse(atob(token.split('.')[1])).id;

            const response = await axios.get(
                `${import.meta.env.VITE_URL_API}/material-requests/user/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching material requests:", error);
            toast.error("Failed to fetch material requests");
            setLoading(false);
        }
    };

    const getApprovalIcon = (status) => {
        if (status === 'approved') return <CheckCircle size={20} className={styles.approved} />;
        if (status === 'rejected') return <XCircle size={20} className={styles.rejected} />;
        if (status === 'pending') return <Clock size={20} className={styles.pending} />;
        return <Clock size={20} className={styles.waiting} />; // Gray for waiting
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading material requests...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Material Requests</h1>
                <p className={styles.subtitle}>
                    View all your material requests and their approval status
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
                                <th>Comments</th>
                                <th>Value Details</th>
                                <th>Deduction Details</th>
                                <th>Payment Details</th>
                                <th>Approvals</th>
                                <th>Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => {
                                // Derive approval statuses based on the main status ID
                                const getStatusForStage = (stage) => {
                                    const statusId = request.status;

                                    // Status IDs:
                                    // 1: PENDING_QS
                                    // 2: PENDING_ZCM
                                    // 3: PENDING_HOD
                                    // 4: PENDING_FM
                                    // 5: APPROVED
                                    // 6: REJECTED
                                    // 7: ON_HOLD_ZCM
                                    // 8: ON_HOLD_HOD
                                    // 9: SENT_BACK_EMPLOYEE

                                    if (statusId === 6) return 'rejected';
                                    if (statusId === 9) return 'pending'; // Sent back
                                    if (statusId === 7 || statusId === 8) return 'pending'; // On hold

                                    // Define stage thresholds (at which ID is this stage completed?)
                                    // QS is done if status > 1
                                    // ZCM is done if status > 2
                                    // HOD is done if status > 3
                                    // FM is done if status > 4 (which is 5=APPROVED)

                                    const stageThresholds = {
                                        'QS': 1,
                                        'ZCM': 2,
                                        'HOD': 3,
                                        'FM': 4
                                    };

                                    const threshold = stageThresholds[stage];

                                    if (statusId > threshold) return 'approved';
                                    if (statusId === threshold) return 'pending';
                                    return 'waiting';
                                };

                                return (
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

                                        <td className={styles.commentsCell}>
                                            {request.comments || '-'}
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

                                        <td className={styles.deductionCell}>
                                            <div className={styles.deductionGroup}>
                                                <span className={styles.label}>TDS:</span>
                                                <span className={styles.amount}>{formatCurrency(request.tds)}</span>
                                            </div>
                                            <div className={styles.deductionGroup}>
                                                <span className={styles.label}>Penalty:</span>
                                                <span className={styles.amount}>{formatCurrency(request.penalty)}</span>
                                            </div>
                                            <div className={styles.deductionGroup}>
                                                <span className={styles.label}>Payment on Hold:</span>
                                                <span className={styles.amount}>{formatCurrency(request.payment_on_hold)}</span>
                                            </div>
                                            <div className={styles.deductionGroup}>
                                                <span className={styles.label}>Mob. Adv. Recovery:</span>
                                                <span className={styles.amount}>{formatCurrency(request.mobilization_advance_recovery)}</span>
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

                                        <td className={styles.approvalsCell}>
                                            <div className={styles.approvalRow}>
                                                <span className={styles.label}>Manager:</span>
                                                {getApprovalIcon(getStatusForStage('MANAGER'))}
                                            </div>
                                            <div className={styles.approvalRow}>
                                                <span className={styles.label}>Purchase:</span>
                                                {getApprovalIcon(getStatusForStage('PURCHASE'))}
                                            </div>
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
                                            <Link to={`/dashboard/view-material-requests/details?ticket-id=${request.id}`} className={styles.actionBtn} title="View Details">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {requests.length === 0 && (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <p>No material requests found</p>
                </div>
            )}
        </div>
    );
};

export default ViewMaterialRequests;
