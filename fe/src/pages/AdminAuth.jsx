import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
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

        if (!isLogin && password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const response = await authService.login(email, password);
                if (response.role !== 'ADMIN') {
                    setError('Truy cập bị từ chối. Tài khoản này không có quyền Admin.');
                    authService.logout();
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                await authService.register(name, email, password, 'ADMIN');
                setSuccess('Đăng ký Admin thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
                setTimeout(() => setIsLogin(true), 4000);
            }
        } catch (err) {
            setError(err.response?.data?.message || (isLogin ? 'Đăng nhập thất bại!' : 'Đăng ký thất bại!'));
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="auth-centered-wrapper" style={{ background: '#f8f0ff' }}>
            <div className="auth-centered-card">
                {/* Admin badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <span style={{
                        background: '#7c3aed',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '700',
                        padding: '4px 14px',
                        borderRadius: '20px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        🛡️ Cổng Quản Trị Viên
                    </span>
                </div>

                <h2 className="auth-title" style={{ textAlign: 'center' }}>
                    {isLogin ? 'Đăng nhập Admin' : 'Tạo tài khoản Admin'}
                </h2>
                <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                    {isLogin ? 'Chỉ dành cho quản trị viên hệ thống' : 'Tạo tài khoản quản trị hệ thống mới'}
                </p>

                {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}
                {success && <div className="auth-success-msg" style={{ marginBottom: '16px' }}>{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="admin-name">Họ và tên</label>
                            <input
                                type="text"
                                id="admin-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tên Quản Trị Viên"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="admin-email">Email</label>
                        <input
                            type="email"
                            id="admin-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@flightgreen.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="admin-password">Mật khẩu</label>
                        <input
                            type="password"
                            id="admin-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isLogin ? "Nhập mật khẩu" : "Tạo mật khẩu"}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="admin-confirm-password">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="admin-confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-btn primary-btn"
                        style={{ background: '#7c3aed', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản Admin')}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Chưa có tài khoản quản trị? " : "Đã có tài khoản? "}
                    <a href="#" onClick={(e) => { e.preventDefault(); switchMode(); }} style={{ color: '#7c3aed' }}>
                        {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                    </a>
                </p>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <a href="/login" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>
                        ← Về trang đăng nhập thông thường
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
