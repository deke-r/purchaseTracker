import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../styles/login.css';
import logo from '../assets/images/Sense_project_logo.png';
import { Link } from 'react-router-dom';

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

      if (response) {
        window.location.href = "/dashboard";
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 main-div">
      <div className="glass-effect px-4 pt-5 pb-4 rounded-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="logo" className="img-fluid" style={{ maxWidth: '180px' }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* User ID */}
          <div className="mb-3">
            <div className={`input-group rounded-2 bg-light box_sdw11 ${errors.userId ? 'border border-danger rounded' : ''}`}>
              <span className="input-group-text bg-white border-0">
                <i className="fa-solid fa-id-card text-muted f_14"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-login text-muted f_16 py-2 fw-semibold border-start-0"
                placeholder="User ID"
                {...register('userId', { required: 'User ID is required' })}
              />
            </div>
            {errors.userId && (
              <div className="text-danger small mt-1 ps-2 f_12 fw-semibold">{errors.userId.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className={`input-group box_sdw11 rounded-2 bg-light ${errors.password ? 'border border-danger rounded' : ''}`}>
              <span className="input-group-text bg-white border-0">
                <i className="fa-solid fa-lock text-muted f_14"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control form-control-login text-muted f_16 py-2 fw-semibold border-start-0 border-end-0"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
              />
              <span
                className="input-group-text bg-white border-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                <i className={`fa-solid text-muted f_14 ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>
            {errors.password && (
              <div className="text-danger small mt-1 ps-2 f_12 fw-semibold">{errors.password.message}</div>
            )}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn bg-b fw-semibold text-light" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-danger text-center fw-semibold mt-3">
              {errorMessage}
            </div>
          )}

          <div className="col-12 text-end mt-2">
            <Link className="text-dark text-decoration-none f_13 fw-semibold" to="#">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
