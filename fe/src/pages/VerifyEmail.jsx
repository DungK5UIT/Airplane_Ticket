import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import './Auth.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const code = searchParams.get('code');

    const handleVerify = async () => {
        if (!code) {
            setStatus('error');
            setMessage('Mã xác thực không hợp lệ hoặc đã bị thiếu trong đường dẫn.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await axios.get(`http://localhost:8080/api/auth/verify?code=${code}`);
            setStatus('success');
            setMessage('Tài khoản của bạn đã được xác thực thành công!');
            setTimeout(() => navigate('/login'), 3500);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Xác thực thất bại. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="auth-centered-wrapper">
            <div className="auth-centered-card" style={{ textAlign: 'center' }}>
                <Link to="/" className="auth-logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                    ✈ FlightGreen <span className="logo-dot"></span>
                </Link>

                {/* Icon changes based on status */}
                <div style={{ fontSize: '52px', marginBottom: '16px', lineHeight: 1 }}>
                    {status === 'success' ? '✅' : status === 'error' ? '❌' : '📧'}
                </div>

                <h2 className="auth-title" style={{ marginBottom: '8px' }}>
                    {status === 'success' ? 'Xác thực thành công!' : status === 'error' ? 'Xác thực thất bại' : 'Xác thực tài khoản'}
                </h2>
                <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
                    {status === 'idle' && 'Nhấn nút bên dưới để hoàn tất xác thực tài khoản của bạn.'}
                    {status === 'loading' && 'Đang xử lý xác thực, vui lòng chờ...'}
                    {status === 'success' && 'Bạn có thể đăng nhập ngay bây giờ. Đang tự động chuyển hướng...'}
                    {status === 'error' && 'Đã xảy ra lỗi trong quá trình xác thực.'}
                </p>

                {status === 'error' && (
                    <div className="auth-error-msg" style={{ marginBottom: '20px', textAlign: 'left' }}>{message}</div>
                )}
                {status === 'success' && (
                    <div className="auth-success-msg" style={{ marginBottom: '20px', textAlign: 'left' }}>{message}</div>
                )}

                {status !== 'success' && (
                    <button
                        onClick={handleVerify}
                        className="auth-btn primary-btn"
                        disabled={status === 'loading'}
                        style={{ marginBottom: '20px' }}
                    >
                        {status === 'loading' ? 'Đang xác thực...' : 'Xác thực ngay'}
                    </button>
                )}

                <p className="auth-switch" style={{ marginTop: '8px' }}>
                    <Link to="/login" className="forgot-link">← Quay lại trang Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
