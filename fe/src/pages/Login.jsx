import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import logoImg from '../assets/logo.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            if (response && response.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            setTimeout(() => {
                setGoogleLoading(false);
                setError('Tính năng đăng nhập Google đang được bảo trì.');
            }, 1200);
        } catch (err) {
            setGoogleLoading(false);
            setError('Có lỗi xảy ra khi kết nối với Google.');
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

                .fv-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    cursor: pointer;
                    user-select: none;
                }
                .fv-checkbox .fv-cb-box {
                    width: 18px;
                    height: 18px;
                    border-radius: 6px;
                    border: 1.5px solid #d1d5db;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: background 0.15s, border-color 0.15s;
                }
                .fv-checkbox input:checked ~ .fv-cb-box,
                .fv-checkbox.checked .fv-cb-box {
                    background: #2563eb;
                    border-color: #2563eb;
                }
                .fv-checkbox .fv-cb-label {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #6b7280;
                }

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

                .fv-google-btn {
                    width: 100%;
                    height: 50px;
                    background: #fff;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    color: #374151;
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
                }
                .fv-google-btn:hover:not(:disabled) {
                    border-color: #d1d5db;
                    background: #f9fafb;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }
                .fv-google-btn:disabled { opacity: 0.65; cursor: not-allowed; }
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
                            Chạm đến bầu trời,<br />
                            <span style={{ color: '#7dd3fc' }}>Khám phá thế giới.</span>
                        </h1>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: 320, textAlign: 'center' }}>
                            Nền tảng đặt vé máy bay hàng đầu — an toàn, nhanh chóng và ngập tràn ưu đãi hạng nhất.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ background: '#f0f4f8' }}>
                <div style={{ width: '100%', maxWidth: 460 }}>

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
                            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Đăng nhập</h2>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: '#6b7280', margin: 0, fontWeight: 500 }}>
                                Chào mừng bạn quay lại! Hãy đăng nhập để tiếp tục.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 10, padding: '11px 14px', marginBottom: 22, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13.5, color: '#b91c1c', fontWeight: 600 }}>
                                <svg style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                        className="has-right-btn"
                                    />
                                    <button
                                        type="button"
                                        className="fv-eye-btn"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showPassword ? (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A10.94 10.94 0 0112 4c5.52 0 10 4 11 8-.39 1.56-1.33 3.02-2.68 4.2M6.23 6.23C4.45 7.55 3.17 9.21 3 12c1 4 5.48 8 11 8 1.55 0 3.05-.28 4.42-.8" />
                                            </svg>
                                        ) : (
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.46 12C3.73 7.94 7.52 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember + Forgot — cùng hàng */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label
                                    className={`fv-checkbox${remember ? ' checked' : ''}`}
                                    onClick={() => setRemember(!remember)}
                                >
                                    <div className="fv-cb-box">
                                        {remember && (
                                            <svg style={{ width: 11, height: 11, stroke: 'white', strokeWidth: 3 }} fill="none" viewBox="0 0 12 12">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="fv-cb-label">Ghi nhớ đăng nhập</span>
                                </label>

                                <Link
                                    to="/forgot-password"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#2563eb', textDecoration: 'none', flexShrink: 0 }}
                                    onMouseOver={e => e.target.style.color = '#1d4ed8'}
                                    onMouseOut={e => e.target.style.color = '#2563eb'}
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="fv-submit-btn"
                                style={{ marginTop: 4 }}
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9ca3af' }}>hoặc</span>
                            <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className="fv-google-btn"
                        >
                            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, flexShrink: 0 }}>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>{googleLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}</span>
                        </button>

                        {/* Footer */}
                        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14.5, color: '#6b7280', margin: '0 0 10px', fontWeight: 600 }}>
                                Chưa có tài khoản?{' '}
                                <Link to="/register" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
                                    Đăng ký ngay
                                </Link>
                            </p>
                            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#9ca3af', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
                                Bằng việc đăng nhập, bạn đồng ý với{' '}
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

export default Login;