"use client"

import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

const MaterialRequestForm = () => {
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const formData = new FormData()

    // Append all fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "file" && data[key][0]) {
        formData.append("file", data[key][0])
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      await axios.post(`${import.meta.env.VITE_URL_API}/material-request`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setMessage("Invoice Submitted Successfully!")
      setMessageType("success")
      setTimeout(() => {
        setMessage("")
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Submission error:", error)
      setMessage("Failed to submit.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-fluid my-5">
      {message && (
        <div
          className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mt-3 w-md-25`}
          style={{ position: "fixed", right: 20, top: 80, zIndex: 999 }}
        >
          {message}
        </div>
      )}

      <div className="row mx-md-5 px-md-5">
        <div className="container pb-4 box_sdw11">
          <div className="row bg-b text-center text-light rounded-top-2 f_16 fw-semibold py-2">
            <div className="col-12">Invoice Approval Request</div>
          </div>

          {/* Row 1 */}
          <div className="row mt-3">
            <div className="col-md-6 my-2">
              <label className="form-label fw-semibold text-dark">Vendor Name</label>
              <input className="form-control" {...register("vendor_name", { required: true })} />
            </div>
            <div className="col-md-6 my-2">
              <label className="form-label fw-semibold text-dark">Invoice Scope</label>
              <input className="form-control" {...register("invoice_scope")} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="row">
            <div className="col-md-6 my-2">
              <label className="form-label fw-semibold text-dark">Invoice Reference</label>
              <input className="form-control" {...register("invoice_reference")} />
            </div>
            <div className="col-md-6 my-2">
              <label className="form-label fw-semibold text-dark">Invoice Number</label>
              <input className="form-control" {...register("invoice_number", { required: true })} />
            </div>
          </div>

          {/* Row 3 - Numeric Fields */}
          <div className="row">
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Base Value</label>
              <input type="number" step="0.01" className="form-control" {...register("base_value")} />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">GST</label>
              <input type="number" step="0.01" className="form-control" {...register("gst")} />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Freight / Insurance</label>
              <input type="number" step="0.01" className="form-control" {...register("freight_insurance")} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">IPC Amount</label>
              <input type="number" step="0.01" className="form-control" {...register("ipc_amount")} />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">TDS</label>
              <input type="number" step="0.01" className="form-control" {...register("tds")} />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Penalty</label>
              <input type="number" step="0.01" className="form-control" {...register("penalty")} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Payment on Hold</label>
              <input type="number" step="0.01" className="form-control" {...register("payment_on_hold")} />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Mob. Advance Recovery</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                {...register("mobilization_advance_recovery")}
              />
            </div>
            <div className="col-md-4 my-2">
              <label className="form-label fw-semibold text-dark">Retention Amount</label>
              <input type="number" step="0.01" className="form-control" {...register("retention_amount")} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 my-2">
              <label className="form-label fw-semibold text-dark">Comments</label>
              <textarea className="form-control" rows="3" {...register("comments")}></textarea>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 my-2">
              <label className="form-label fw-semibold text-dark">Upload Invoice (PDF)</label>
              <input type="file" className="form-control" accept="application/pdf" {...register("file")} />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              <button type="submit" className="btn bg-b text-light w-100 fw-bold" disabled={loading}>
                {loading ? "Submitting..." : "Submit Invoice for Approval"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default MaterialRequestForm
