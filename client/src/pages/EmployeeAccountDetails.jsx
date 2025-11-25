import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./EmployeeAccountDetails.module.css";

export const EmployeeAccountDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // RHF
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      role: "",
      department: "",
      status: 1,
      created_at: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formValues = watch();

  // Fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchAccount = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_URL_API}/account`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        reset({
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          department: res.data.department,
          status: res.data.status,
          created_at: res.data.created_at,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [navigate, reset]);

  // Submit
  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    // Password validation
    if (data.newPassword || data.confirmPassword || data.currentPassword) {
      if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
        return setError("Please fill all password fields.");
      }
      if (data.newPassword !== data.confirmPassword) {
        return setError("New passwords do not match.");
      }
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const body = {
        name: data.name,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_URL_API}/account`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(res.data.message);

      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "-";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>
            Manage your account information and security settings
          </p>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading account details...</p>
          </div>
        ) : (
          <div className={styles.gridLayout}>

            {/* LEFT SIDE - Profile Card */}
            <div className={styles.profileCard}>

              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  {formValues.name
                    ? formValues.name.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>{formValues.name}</h2>
                  <span className={styles.roleBadge}>
                    {formValues.role}
                  </span>
                </div>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Email</span>
                  <span className={styles.detailValue}>{formValues.email}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Department</span>
                  <span className={styles.detailValue}>{formValues.department || "Not set"}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={styles.statusBadge}>
                    {formValues.status === 1 ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Member Since</span>
                  <span className={styles.detailValue}>{formatDate(formValues.created_at)}</span>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE - Form Card */}
            <div className={styles.formCard}>

              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Edit Account Information</h3>
              </div>

              {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
              {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>

                {/* NAME & EMAIL */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      {...register("name")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      className={styles.input}
                      {...register("email")}
                      disabled
                      readOnly
                    />
                    <span className={styles.helpText}>
                      Email cannot be changed. Contact admin for updates.
                    </span>
                  </div>
                </div>

                {/* DEPARTMENT & ROLE */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Department</label>
                    <input
                      type="text"
                      className={styles.input}
                      {...register("department")}
                      disabled
                      readOnly
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Role</label>
                    <input
                      type="text"
                      className={styles.input}
                      {...register("role")}
                      disabled
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.sectionDivider}></div>

                {/* Password Section */}
                <div className={styles.sectionHeader}>
                  <h4 className={styles.sectionTitle}>Change Password (optional)</h4>
                  <p className={styles.sectionSubtitle}>Leave blank to keep current password.</p>
                </div>

                <div className={styles.formGridThree}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      className={styles.input}
                      {...register("currentPassword")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input
                      type="password"
                      className={styles.input}
                      {...register("newPassword")}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className={styles.input}
                      {...register("confirmPassword")}
                    />
                  </div>
                </div>

                <div className={styles.submitSection}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
