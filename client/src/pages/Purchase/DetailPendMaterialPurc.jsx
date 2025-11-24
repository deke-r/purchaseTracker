"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"

const DetailPendMaterialPurc = () => {
  const [requestData, setRequestData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [remarksInput, setRemarksInput] = useState("")
  const [selectedFile, setSelectedFile] = useState(null) // Kept for UI compatibility, though backend might not use it

  const navigate = useNavigate()
  const location = useLocation()
  const ticketId = new URLSearchParams(location.search).get("ticket-id")

  useEffect(() => {
    if (ticketId) {
      axios
        .get(`${import.meta.env.VITE_URL_API}/pending-material-requests/details?ticket-id=${ticketId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          setRequestData(res.data.request)
          setHistory(res.data.history || [])
        })
        .finally(() => setLoading(false))
    }
  }, [ticketId])

  const handleAction = async (action) => {
    // action: 'APPROVE', 'REJECT'
    if (!remarksInput && action !== "APPROVE") {
      alert("Remarks required")
      return
    }

    try {
      const formData = new FormData()
      formData.append("ticket_id", ticketId)
      formData.append("action", action) // 'APPROVE' or 'REJECT'
      formData.append("remarks", remarksInput)
      if (selectedFile) formData.append("file", selectedFile)

      await axios.put(`${import.meta.env.VITE_URL_API}/pending-material-requests/update-status`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert(`Request ${action === "APPROVE" ? "approved" : "rejected"} successfully.`)
      navigate(-1)
    } catch (err) {
      console.error("Status update failed:", err)
      alert("Error updating status")
    }
  }

  if (loading) return <div>Loading...</div>
  if (!requestData) return <div>Not Found</div>

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-b text-white fw-bold">Invoice Details #{requestData.invoice_number}</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <strong>Vendor:</strong> {requestData.vendor_name}
            </div>
            <div className="col-md-6">
              <strong>Scope:</strong> {requestData.invoice_scope}
            </div>
            <div className="col-md-6">
              <strong>Ref:</strong> {requestData.invoice_reference}
            </div>
            <div className="col-md-6">
              <strong>Amount Paid:</strong> {requestData.amount_paid}
            </div>
            <div className="col-md-6">
              <strong>Status:</strong> <span className="badge bg-info">{requestData.status_track}</span>
            </div>
            <div className="col-md-6">
              <strong>Attachment:</strong>
              {requestData.attachment && (
                <a
                  href={`${import.meta.env.VITE_URL_API}/uploads/${requestData.attachment}`}
                  target="_blank"
                  className="ms-2"
                  rel="noreferrer"
                >
                  <FileText size={16} /> View PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval History */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-secondary text-white">Approval History</div>
        <div className="card-body">
          <ul className="list-group">
            {history.map((h, i) => (
              <li key={i} className="list-group-item">
                <strong>{h.role}</strong> ({h.user_name}) - {h.action}
                <br />
                <small className="text-muted">{h.comment}</small>
                <span className="float-end text-muted" style={{ fontSize: "0.8rem" }}>
                  {new Date(h.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-3">
            <label>Upload File (Optional):</label>
            <input type="file" className="form-control" onChange={(e) => setSelectedFile(e.target.files[0])} />
          </div>
          <textarea
            className="form-control mb-3"
            placeholder="Remarks..."
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
          ></textarea>
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={() => handleAction("APPROVE")}>
              Approve
            </button>
            <button className="btn btn-danger" onClick={() => handleAction("REJECT")}>
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPendMaterialPurc
