import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/images/Sense_project_logo.png';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_API}/login`, data);
      let token = response.data.token;
      localStorage.setItem('token', token);

      // Decode token to get user role
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      console.log("User role:", decoded.role);
      console.log("Role comparison:", decoded.role === 'admin', decoded.role);

      if (response) {
        // Redirect based on role
        if (decoded.role === 'admin') {
          console.log("Redirecting to admin dashboard");
          window.location.href = "/dashboard/admin";
        } else {
          console.log("Redirecting to regular dashboard");
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCard}>

        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo" className={styles.logo} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

          {/* User ID */}
          <div className={styles.formGroup}>
            <label className={styles.label}>User ID</label>
            <div className={`${styles.inputWrapper} ${errors.userId ? styles.inputWrapperError : ''}`}>
              <span className={styles.inputIcon}>
                <i className="fa-solid fa-id-card"></i>
              </span>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your user ID"
                {...register('userId', { required: 'User ID is required' })}
              />
            </div>
            {errors.userId && (
              <span className={styles.errorMessage}>{errors.userId.message}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={`${styles.inputWrapper} ${errors.password ? styles.inputWrapperError : ''}`}>
              <span className={styles.inputIcon}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className={styles.alert}>
              {errorMessage}
            </div>
          )}

          {/* Forgot Password */}
          <div className={styles.forgotPassword}>
            <Link className={styles.forgotPasswordLink} to="#">
              Forgot password?
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
