"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Eye } from "lucide-react"

const PendingMaterialRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_URL_API}/materials`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center mt-5">Loading...</div>

  return (
    <div className="container-fluid rounded-top-2 box_sdw11 mt-4">
      <div className="row bg-b py-2 rounded-top-2">
        <div className="col-12 text-center text-light f_14 fw-semibold">Pending Invoices</div>
      </div>

      <div className="table-responsive my-4">
        <table className="table table-bordered">
          <thead>
            <tr className="bg-light">
              <th>Vendor</th>
              <th>Invoice #</th>
              <th>Scope</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.vendor_name}</td>
                <td>{r.invoice_number}</td>
                <td>{r.invoice_scope}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className="badge bg-primary">{r.status}</span>
                </td>
                <td>
                  <Link to={`/dashboard/manager/pending-material-requests/details?ticket-id=${r.id}`}>
                    <Eye className="text-primary" size={20} />
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingMaterialRequests
