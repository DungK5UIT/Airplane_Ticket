import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
// import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setMessage(`✅ Nếu email "${email}" tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-centered-wrapper">
            <div className="auth-centered-card">
                <Link to="/" className="auth-logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                    ✈ FlightGreen <span className="logo-dot"></span>
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
                    <h2 className="auth-title">Đặt lại mật khẩu</h2>
                    <p className="auth-subtitle" style={{ marginBottom: 0 }}>
                        Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
                    </p>
                </div>

                {message && <div className="auth-success-msg" style={{ marginBottom: '16px' }}>{message}</div>}
                {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Địa chỉ Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <button type="submit" className="auth-btn primary-btn" id="forgot-submit-btn" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
                    </button>
                </form>

                <p className="auth-switch">
                    Nhớ ra mật khẩu rồi? <Link to="/login">Quay lại Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
