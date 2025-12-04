"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { FileText, CheckCircle, XCircle, ArrowLeft, Ban } from "lucide-react"
import styles from "./DetailPendingMaterial.module.css"
import { jwtDecode } from "jwt-decode"

const DetailPendingMaterial = () => {
  const [requestData, setRequestData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [remarksInput, setRemarksInput] = useState("")
  const [userRole, setUserRole] = useState("")
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const ticketId = new URLSearchParams(location.search).get("ticket-id")


  useEffect(() => {
    // Decode token to get user role and ID
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (ticketId) {
      console.log("Fetching details for ticket-id:", ticketId);
      axios
        .get(`${import.meta.env.VITE_URL_API}/pending-material-requests/details?ticket-id=${ticketId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          console.log("Response received:", res.data);
          setRequestData(res.data.request)
          setHistory(res.data.history || [])
        })
        .catch((error) => {
          console.error("Error fetching request details:", error);
          alert("Error loading request details: " + (error.response?.data?.message || error.message));
        })
        .finally(() => setLoading(false))
    } else {
      console.log("No ticket-id found in URL");
      setLoading(false);
    }
  }, [ticketId])

  const handleAction = async (action) => {
    if (!remarksInput && action !== "APPROVE") {
      alert("Remarks required for this action")
      return
    }

    const endpoint = action === "CANCEL"
      ? `${import.meta.env.VITE_URL_API}/material-requests/cancel`
      : `${import.meta.env.VITE_URL_API}/pending-material-requests/update-status`;

    try {
      await axios.put(
        endpoint,
        {
          ticket_id: ticketId,
          action,
          remarks: remarksInput,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      alert("Success")
      navigate(-1)
    } catch (e) {
      alert("Error updating status")
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>
  if (!requestData) return <div className={styles.error}>Request Not Found</div>

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={20} /> Back to List
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Request Details</h1>
        <div className={styles.statusBadge}>
          Status: {requestData.status === 1 ? 'Pending Manager' : requestData.status === 2 ? 'Pending Purchase' : 'Processed'}
        </div>
      </div>

      {/* Main Details Section */}
      <div className={styles.detailsSection}>
        <div className={styles.sectionHeader}>
          <h2>Invoice & Financial Information</h2>
        </div>

        <div className={styles.compactGrid}>
          <div className={styles.gridItem}>
            <span className={styles.label}>Vendor Name</span>
            <span className={styles.value}>{requestData.vendor_name}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Invoice Number</span>
            <span className={styles.value}>{requestData.invoice_number}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Scope</span>
            <span className={styles.value}>{requestData.invoice_scope}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Reference</span>
            <span className={styles.value}>{requestData.invoice_reference}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Base Value</span>
            <span className={styles.value}>{requestData.base_value}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>GST</span>
            <span className={styles.value}>{requestData.gst}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Freight/Insurance</span>
            <span className={styles.value}>{requestData.freight_insurance}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>IPC Amount</span>
            <span className={styles.value}>{requestData.ipc_amount}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>TDS</span>
            <span className={styles.value}>{requestData.tds}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Penalty</span>
            <span className={styles.value}>{requestData.penalty}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Payment on Hold</span>
            <span className={styles.value}>{requestData.payment_on_hold}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Mob. Adv. Recovery</span>
            <span className={styles.value}>{requestData.mobilization_advance_recovery}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Retention Amount</span>
            <span className={styles.value}>{requestData.retention_amount}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Total Amount Paid</span>
            <span className={styles.value} style={{ color: '#16a34a' }}>{requestData.amount_paid}</span>
          </div>
        </div>

        {requestData.attachment && (
          <div className={styles.attachment}>
            <a
              href={`${import.meta.env.VITE_URL_API}/uploads/${requestData.attachment}`}
              target="_blank"
              rel="noreferrer"
              className={styles.downloadLink}
            >
              <FileText size={16} /> View Invoice PDF
            </a>
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className={styles.actionSection}>
        <h2 className={styles.actionTitle}>Take Action</h2>
        <div className={styles.actionGrid}>
          <textarea
            className={styles.textarea}
            placeholder={
              userRole === 'employee' && userId === requestData.created_by
                ? "Enter reason for cancellation..."
                : "Enter remarks here (required for Reject)..."
            }
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
          ></textarea>

          <div className={styles.actionButtons}>
            {userRole === 'employee' && userId === requestData.created_by ? (
              // Show Cancel button for employees who created the request
              <button className={`${styles.btn} ${styles.btnCancel}`} onClick={() => handleAction("CANCEL")}>
                <Ban size={20} /> Cancel Request
              </button>
            ) : (
              // Show Approve/Reject for managers and purchase users
              <>
                <button className={`${styles.btn} ${styles.btnApprove}`} onClick={() => handleAction("APPROVE")}>
                  <CheckCircle size={20} /> Approve
                </button>
                <button className={`${styles.btn} ${styles.btnReject}`} onClick={() => handleAction("REJECT")}>
                  <XCircle size={20} /> Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className={styles.historySection}>
        <h3 className={styles.historyTitle}>Approval History</h3>
        <div className={styles.timeline}>
          {history.map((h, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineHeader}>
                <span className={styles.role}>{h.role}</span>
                <span className={styles.user}>({h.user_name})</span>
                <span className={styles.action}>{h.action}</span>
              </div>
              <p className={styles.comment}>{h.comment}</p>
              <span className={styles.date}>
                {h.created_at ? new Date(h.created_at).toLocaleString() : 'Date not available'}
              </span>
            </div>
          ))}
          {history.length === 0 && <p className={styles.noHistory}>No history available</p>}
        </div>
      </div>

    </div>
  )
}

export default DetailPendingMaterial
