"use client"

import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import styles from "./MaterialRequestForm.module.css"

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
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>

        {/* Alert Message */}
        {message && (
          <div className={`${styles.alert} ${messageType === "success" ? styles.alertSuccess : styles.alertError}`}>
            {message}
          </div>
        )}

        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Invoice Approval Request</h1>
          <p className={styles.subtitle}>
            Submit invoice details for approval and processing
          </p>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Vendor Information Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Vendor Information</h2>

              <div className={styles.formGridTwo}>
                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>
                    Vendor Name
                  </label>
                  <input
                    className={styles.input}
                    {...register("vendor_name", { required: true })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Invoice Scope
                  </label>
                  <input
                    className={styles.input}
                    {...register("invoice_scope")}
                  />
                </div>
              </div>

              <div className={styles.formGridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Invoice Reference
                  </label>
                  <input
                    className={styles.input}
                    {...register("invoice_reference")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={`${styles.label} ${styles.required}`}>
                    Invoice Number
                  </label>
                  <input
                    className={styles.input}
                    {...register("invoice_number", { required: true })}
                  />
                </div>
              </div>
            </div>

            {/* Financial Details Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Financial Details</h2>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Base Value</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("base_value")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>GST</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("gst")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Freight / Insurance</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("freight_insurance")}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>IPC Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("ipc_amount")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>TDS</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("tds")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Penalty</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("penalty")}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Payment on Hold</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("payment_on_hold")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Mob. Advance Recovery</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("mobilization_advance_recovery")}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Retention Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.input}
                    {...register("retention_amount")}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Additional Information</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Comments</label>
                <textarea
                  className={styles.textarea}
                  rows="3"
                  {...register("comments")}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Upload Invoice (PDF)</label>
                <input
                  type="file"
                  className={styles.fileInput}
                  accept="application/pdf"
                  {...register("file")}
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className={styles.submitSection}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Invoice for Approval"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default MaterialRequestForm
