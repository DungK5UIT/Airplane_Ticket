import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import logoImg from '../assets/logo.jpg';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Thêm state để ẩn/hiện mật khẩu giống bên Login
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div
            className="min-h-screen flex"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f0f4f8' }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .fv-input-field {
                    position: relative;
                }
                .fv-input-field label {
                    display: block;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #374151;
                    margin-bottom: 8px;
                    letter-spacing: 0.01em;
                }
                .fv-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .fv-input-wrap svg.fv-icon-left {
                    position: absolute;
                    left: 14px;
                    width: 17px;
                    height: 17px;
                    color: #9ca3af;
                    pointer-events: none;
                    flex-shrink: 0;
                    z-index: 1;
                }
                .fv-input-wrap input {
                    width: 100%;
                    height: 50px;
                    background: #ffffff;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 0 14px 0 44px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14.5px;
                    font-weight: 500;
                    color: #111827;
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s;
                    box-sizing: border-box;
                }
                .fv-input-wrap input.has-right-btn {
                    padding-right: 48px;
                }
                .fv-input-wrap input::placeholder {
                    color: #9ca3af;
                    font-weight: 400;
                }
                .fv-input-wrap input:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
                }
                .fv-eye-btn {
                    position: absolute;
                    right: 0;
                    height: 100%;
                    width: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                    transition: color 0.15s;
                    z-index: 1;
                }
                .fv-eye-btn:hover { color: #374151; }
                .fv-eye-btn svg { width: 17px; height: 17px; }

                .fv-submit-btn {
                    width: 100%;
                    height: 52px;
                    background: #1d4ed8;
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
                    box-shadow: 0 4px 20px rgba(29,78,216,0.28);
                }
                .fv-submit-btn:hover:not(:disabled) {
                    background: #1e40af;
                    box-shadow: 0 6px 28px rgba(29,78,216,0.36);
                }
                .fv-submit-btn:active:not(:disabled) { transform: scale(0.99); }
                .fv-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
            `}</style>

            {/* ── LEFT: Branding ── */}
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                        transition: 'transform 0.9s ease',
                    }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(8,20,55,0.30) 0%, rgba(4,10,35,0.86) 100%)' }} />

                <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 xl:p-14 w-full text-center">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <img
                            src={logoImg}
                            alt="FlyViet"
                            style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 10, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.22))' }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            FlyViet
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="flex flex-col items-center">
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(28px,2.8vw,38px)', fontWeight: 800, color: 'white', lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.01em', textAlign: 'center' }}>
                            Bắt đầu<br />
                            <span style={{ color: '#7dd3fc' }}>Hành trình mới.</span>
                        </h1>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: 320, textAlign: 'center' }}>
                            Trở thành thành viên của FlyViet để nhận thông báo về vé máy bay giá rẻ và quản lý chuyến bay chuyên nghiệp nhất.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ background: '#f0f4f8', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 460, margin: 'auto' }}>

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <img
                            src={logoImg}
                            alt="FlyViet"
                            style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FlyViet</span>
                    </div>

                    {/* Card */}
                    <div style={{ background: '#ffffff', borderRadius: 20, border: '1.5px solid #e5e7eb', padding: '40px 40px 36px', boxShadow: '0 16px 56px -16px rgba(0,0,0,0.14)' }}>

                        {/* Heading */}
                        <div style={{ marginBottom: 28 }}>
                            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Tạo tài khoản</h2>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: '#6b7280', margin: 0, fontWeight: 500 }}>
                                Tham gia FlyViet chỉ với vài bước đơn giản.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, padding: '11px 14px', marginBottom: 22, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: '#b91c1c', fontWeight: 600 }}>
                                <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, padding: '11px 14px', marginBottom: 22, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: '#15803d', fontWeight: 600 }}>
                                <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Name */}
                            <div className="fv-input-field">
                                <label>Họ và tên</label>
                                <div className="fv-input-wrap">
                                    <svg className="fv-icon-left" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="fv-input-field">
                                <label>Email của bạn</label>
                                <div className="fv-input-wrap">
                                    <svg className="fv-icon-left" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9 6 9-6M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                                    </svg>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="fv-input-field">
                                <label>Mật khẩu</label>
                                <div className="fv-input-wrap">
                                    <svg className="fv-icon-left" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0v2m-6 4h12a2 2 0 002-2v-1a6 6 0 00-12 0v1a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ít nhất 6 ký tự"
                                        required
                                        autoComplete="new-password"
                                        className="has-right-btn"
                                    />
                                    <button
                                        type="button"
                                        className="fv-eye-btn"
                                        onClick={() => setShowPassword((v) => !v)}
                                    >
                                        {showPassword ? (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A10.94 10.94 0 0112 4c5.52 0 10 4 11 8-.39 1.56-1.33 3.02-2.68 4.2M6.23 6.23C4.45 7.55 3.17 9.21 3 12c1 4 5.48 8 11 8 1.55 0 3.05-.28 4.42-.8" /></svg>
                                        ) : (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.46 12C3.73 7.94 7.52 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="fv-input-field">
                                <label>Xác nhận mật khẩu</label>
                                <div className="fv-input-wrap">
                                    <svg className="fv-icon-left" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                        autoComplete="new-password"
                                        className="has-right-btn"
                                    />
                                    <button
                                        type="button"
                                        className="fv-eye-btn"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A10.94 10.94 0 0112 4c5.52 0 10 4 11 8-.39 1.56-1.33 3.02-2.68 4.2M6.23 6.23C4.45 7.55 3.17 9.21 3 12c1 4 5.48 8 11 8 1.55 0 3.05-.28 4.42-.8" /></svg>
                                        ) : (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.46 12C3.73 7.94 7.52 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="fv-submit-btn"
                                style={{ marginTop: 8 }}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                            </button>
                        </form>

                        {/* Footer */}
                        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: '#6b7280', margin: '0 0 10px', fontWeight: 600 }}>
                                Đã có tài khoản?{' '}
                                <Link to="/login" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
                                    Đăng nhập ngay
                                </Link>
                            </p>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#9ca3af', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                                Bằng việc đăng ký, bạn đồng ý với{' '}
                                <a href="#" style={{ color: '#6b7280', fontWeight: 700, textDecoration: 'none' }}>Điều khoản dịch vụ</a>
                                {' '}và{' '}
                                <a href="#" style={{ color: '#6b7280', fontWeight: 700, textDecoration: 'none' }}>Chính sách bảo mật</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;