import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FileText, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import styles from "./PendingMaterialRequests.module.css";

const PendingMaterialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API}/materials`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching material requests:", error);
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
        <p>Loading pending requests...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pending Material Requests</h1>
        <p className={styles.subtitle}>
          Review and take action on pending material requests
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
                  // 1: PENDING_MANAGER
                  // 2: PENDING_PURCHASE
                  // 3: APPROVED
                  // 4: REJECTED
                  // 5: ON_HOLD
                  // 6: SENT_BACK

                  if (statusId === 4) return 'rejected';
                  if (statusId === 6) return 'pending'; // Sent back
                  if (statusId === 5) return 'pending'; // On hold

                  const stageThresholds = {
                    'MANAGER': 1,
                    'PURCHASE': 2
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
                      <div>{request.vendor_name || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '0.25rem' }}>
                        {request.created_at ? new Date(request.created_at).toLocaleDateString() : '-'}
                      </div>
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
                      <Link to={`/dashboard/manager/pending-material-requests/details?ticket-id=${request.id}`} className={styles.actionBtn} title="View Details & Take Action">
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
          <p>No pending requests found</p>
        </div>
      )}
    </div>
  );
};

export default PendingMaterialRequests;
