import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại! Kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Hero Side */}
      <div className="auth-hero-side">
        <div className="auth-hero-content">
          <div className="auth-hero-logo">
            <span className="logo-icon">✈️</span>
            <span>FlightGreen</span>
          </div>
          <h1 className="auth-hero-title">Bay xa hơn,<br />Giá tốt hơn.</h1>
          <p className="auth-hero-text">
            Khám phá hàng ngàn điểm đến với giá vé ưu đãi nhất. Đặt vé nhanh chóng, an toàn và dễ dàng chỉ trong vài phút.
          </p>
          <div className="auth-hero-features">
            <div className="auth-hero-feat">
              <span className="feat-icon">⚡</span>
              <span>Đặt vé nhanh chóng trong 60 giây</span>
            </div>
            <div className="auth-hero-feat">
              <span className="feat-icon">🛡️</span>
              <span>Thanh toán an toàn, bảo mật tuyệt đối</span>
            </div>
            <div className="auth-hero-feat">
              <span className="feat-icon">💎</span>
              <span>Ưu đãi độc quyền cho thành viên</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <span className="logo-icon" style={{background: 'var(--primary)', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '16px'}}>✈️</span>
            <span>FlightGreen</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-title" style={{textAlign: 'left', fontSize: '28px'}}>Chào mừng bạn trở lại</h2>
            <p className="auth-subtitle" style={{textAlign: 'left'}}>Đăng nhập để quản lý chuyến bay và nhận ưu đãi.</p>
          </div>

          {error && <div className="auth-error-msg" style={{ marginBottom: '20px' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Ghi nhớ
              </label>
              <Link to="/forgot-password" className="forgot-link">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="auth-btn primary-btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký thành viên</Link>
          </p>

          <div className="auth-terms">
            Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a> của FlightGreen.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
