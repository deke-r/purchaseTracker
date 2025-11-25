import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./ProjectDetails.module.css";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  // Fetch user info (name, designation, reporting manager)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_URL_API}/project/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          // Autofill values
          setValue("name", res.data.name);
          setValue("designation", res.data.designation);
          setValue("rm_name", res.data.manager_name);

          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Handle file inputs properly
    for (let key in data) {
      if (data[key] instanceof FileList) {
        if (data[key].length > 0) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_URL_API}/project/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      alert("Project details submitted successfully!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Error submitting project details. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>

        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Project Details Submission</h1>
          <p className={styles.subtitle}>
            Submit your daily project activity, task updates and EOD summary
          </p>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading your information...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Employee Information Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>👤</span>
                  Employee Information
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Name
                      <span className={styles.readonlyBadge}>Auto-filled</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      {...register("name")}
                      readOnly
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Designation
                      <span className={styles.readonlyBadge}>Auto-filled</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      {...register("designation")}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Reporting Manager
                    <span className={styles.readonlyBadge}>Auto-filled</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    {...register("rm_name")}
                    readOnly
                  />
                </div>
              </div>

              {/* Project Details Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📋</span>
                  Project Details
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.required}`}>
                      Project Name
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Enter project name"
                      {...register("project_name", {
                        required: "Project name is required"
                      })}
                    />
                    {errors.project_name && (
                      <span className={styles.errorMessage}>
                        {errors.project_name.message}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.required}`}>
                      Today's Task
                    </label>
                    <textarea
                      className={styles.textarea}
                      placeholder="Describe the tasks you worked on today..."
                      {...register("todays_task", {
                        required: "Today's task is required"
                      })}
                    ></textarea>
                    {errors.todays_task && (
                      <span className={styles.errorMessage}>
                        {errors.todays_task.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={`${styles.label} ${styles.required}`}>
                      EOD Summary
                    </label>
                    <textarea
                      className={styles.textarea}
                      placeholder="Summarize your end-of-day progress and achievements..."
                      {...register("eod_summary", {
                        required: "EOD summary is required"
                      })}
                    ></textarea>
                    {errors.eod_summary && (
                      <span className={styles.errorMessage}>
                        {errors.eod_summary.message}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      EOD Attachment <span className={styles.optionalTag}>(optional)</span>
                    </label>
                    <input
                      type="file"
                      className={styles.fileInput}
                      {...register("eod_attachment")}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>💰</span>
                  Payment Information
                </h2>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Payment Request <span className={styles.optionalTag}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Enter amount or payment details"
                      {...register("payment_request")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Payment Attachment <span className={styles.optionalTag}>(optional)</span>
                    </label>
                    <input
                      type="file"
                      className={styles.fileInput}
                      {...register("payment_attachment")}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className={styles.submitSection}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  Submit Details
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
