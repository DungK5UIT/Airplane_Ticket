import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

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
    <div className="min-h-screen w-full flex relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"></div>
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[100px] mix-blend-screen"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Main Content Splitted */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row">
        
        {/* Left Hero Section */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 text-white">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                <span className="text-2xl">✈️</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">FlightGreen</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
              Bay xa hơn,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Giá tốt hơn.</span>
            </h1>
            
            <p className="text-lg xl:text-xl text-blue-100/80 mb-12 leading-relaxed max-w-lg font-medium">
              Khám phá hàng ngàn điểm đến với giá vé ưu đãi nhất. Đặt vé nhanh chóng, an toàn và dễ dàng chỉ trong vài phút.
            </p>

            <div className="space-y-6">
              {[
                { icon: '⚡', text: 'Đặt vé nhanh chóng trong 60 giây' },
                { icon: '🛡️', text: 'Thanh toán an toàn, bảo mật tuyệt đối' },
                { icon: '💎', text: 'Ưu đãi độc quyền cho thành viên' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-lg group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-blue-50 font-medium group-hover:text-white transition-colors">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md">
            {/* Glassmorphic Card */}
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center gap-3 mb-10 border-b border-white/10 pb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xl shadow-lg">
                  ✈️
                </div>
                <span className="text-xl font-bold text-white tracking-tight">FlightGreen</span>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Chào mừng trở lại</h2>
                <p className="text-blue-200/70 text-sm">Đăng nhập để quản lý chuyến bay và nhận ưu đãi.</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                  <span className="mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-1.5 focus-within:text-cyan-400 transition-colors">
                  <label htmlFor="email" className="text-xs font-semibold text-blue-200 uppercase tracking-widest pl-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vidu@email.com"
                    required
                    autoComplete="email"
                    className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 placeholder:text-blue-200/30 font-medium"
                  />
                </div>

                <div className="space-y-1.5 focus-within:text-cyan-400 transition-colors">
                  <label htmlFor="password" className="text-xs font-semibold text-blue-200 uppercase tracking-widest pl-1">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-black/20 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 placeholder:text-blue-200/30 tracking-widest"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer w-4 h-4 opacity-0 absolute" />
                      <div className="w-4 h-4 rounded border border-white/30 bg-black/20 peer-checked:bg-cyan-500 peer-checked:border-cyan-400 transition-all flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-200/70 group-hover:text-white transition-colors">Ghi nhớ tôi</span>
                  </label>
                  
                  <Link to="/forgot-password" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4 transition-all">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-4 rounded-xl shadow-[0_8px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.5)] active:scale-[0.98] transition-all duration-300 border border-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-white/10 pt-6">
                <p className="text-blue-200/70 text-sm">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-white font-bold hover:text-cyan-400 transition-colors">
                    Đăng ký thành viên
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-blue-200/50 leading-relaxed font-medium">
              Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="text-blue-300 hover:text-white underline-offset-2 hover:underline transition-colors">Điều khoản sử dụng</a> và <a href="#" className="text-blue-300 hover:text-white underline-offset-2 hover:underline transition-colors">Chính sách bảo mật</a> của FlightGreen.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
