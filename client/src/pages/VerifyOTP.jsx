import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import styles from './VerifyOTP.module.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        if (!email) {
            toast.error('Please start from forgot password page');
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 4);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        setOtp([...newOtp, ...Array(4 - newOtp.length).fill('')]);

        // Focus last filled input or first empty
        const nextIndex = Math.min(pastedData.length, 3);
        inputRefs[nextIndex].current.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpString = otp.join('');

        if (otpString.length !== 4) {
            toast.error('Please enter complete OTP');
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_URL_API}/auth/verify-otp`,
                { email, otp: otpString }
            );

            toast.success('OTP verified successfully');
            navigate('/reset-password', { state: { email, otp: otpString } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
            setOtp(['', '', '', '']);
            inputRefs[0].current.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_URL_API}/auth/forgot-password`,
                { email }
            );
            toast.success('New OTP sent to your email');
            setOtp(['', '', '', '']);
            inputRefs[0].current.focus();
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button onClick={() => navigate('/forgot-password')} className={styles.backButton}>
                    <ArrowLeft size={20} />
                    Back
                </button>

                <h1 className={styles.title}>Verify OTP</h1>
                <p className={styles.subtitle}>
                    We've sent a 4-digit code to <strong>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.otpContainer} onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength="1"
                                className={styles.otpInput}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading || otp.join('').length !== 4}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button
                        type="button"
                        onClick={handleResend}
                        className={styles.resendButton}
                        disabled={loading}
                    >
                        Resend OTP
                    </button>
                </form>

                <p className={styles.note}>
                    OTP will expire in 10 minutes
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
