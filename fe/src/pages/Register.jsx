import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);
        try {
            await authService.register(name, email, password);
            setSuccess("🎉 Đăng ký thành công! Vui lòng kiểm tra hộp thư email để xác thực tài khoản.");
            setTimeout(() => navigate('/login'), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left Hero Side */}
            <div className="auth-hero-side" style={{background: 'linear-gradient(135deg, #0052cc 0%, #0064d2 50%, #0077ff 100%)'}}>
                <div className="auth-hero-content">
                    <div className="auth-hero-logo">
                        <span className="logo-icon">✈️</span>
                        <span>FlightGreen</span>
                    </div>
                    <h1 className="auth-hero-title">Bắt đầu<br />Hành trình mới.</h1>
                    <p className="auth-hero-text">
                        Trở thành thành viên của FlightGreen để nhận thông báo về vé máy bay giá rẻ và quản lý chuyến bay của bạn một cách chuyên nghiệp nhất.
                    </p>
                    <div className="auth-hero-features">
                        <div className="auth-hero-feat">
                            <span className="feat-icon">✨</span>
                            <span>Tích điểm đổi quà hấp dẫn</span>
                        </div>
                        <div className="auth-hero-feat">
                            <span className="feat-icon">📍</span>
                            <span>Theo dõi hành trình thời gian thực</span>
                        </div>
                        <div className="auth-hero-feat">
                            <span className="feat-icon">🎁</span>
                            <span>Quà tặng bất ngờ cho thành viên mới</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="auth-form-side">
                <div className="auth-form-container" style={{maxWidth: '440px'}}>
                    <div className="auth-mobile-logo">
                        <span className="logo-icon" style={{background: 'var(--primary)', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '16px'}}>✈️</span>
                        <span>FlightGreen</span>
                    </div>

                    <div className="auth-form-header">
                        <h2 className="auth-title" style={{textAlign: 'left', fontSize: '28px'}}>Tạo tài khoản</h2>
                        <p className="auth-subtitle" style={{textAlign: 'left'}}>Tham gia FlightGreen chỉ với vài bước đơn giản.</p>
                    </div>

                    {error && <div className="auth-error-msg" style={{ marginBottom: '20px' }}>{error}</div>}
                    {success && <div className="auth-success-msg" style={{ marginBottom: '20px' }}>{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="name">Họ và tên</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vidu@email.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ít nhất 6 ký tự"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button type="submit" className="auth-btn primary-btn" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </p>

                    <div className="auth-terms">
                        Bằng việc đăng ký, bạn xác nhận đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách</a> của chúng tôi.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
