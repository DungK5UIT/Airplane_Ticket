import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AdminAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
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
                    setError('Truy cập bị từ chối. Tài khoản không có phân quyền Quản trị viên.');
                    authService.logout();
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                await authService.register(name, email, password, 'ADMIN');
                setSuccess('Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực.');
                setTimeout(() => setIsLogin(true), 4000);
            }
        } catch (err) {
            setError(err.response?.data?.message || (isLogin ? 'Đăng nhập thất bại!' : 'Đăng ký thất bại!'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Placeholder for Google Login
            setTimeout(() => {
                setGoogleLoading(false);
                setError('Chức năng đăng nhập Google đang được hệ thống bảo trì hoặc tích hợp.');
            }, 1200);
        } catch (err) {
            setGoogleLoading(false);
            setError('Lỗi kết nối Google.');
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
        <div className="min-h-screen flex font-sans bg-white text-slate-800">
            {/* Left Side: Image and Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center overflow-hidden"
                 style={{ 
                     backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')" 
                 }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-blue-900/30 bg-gradient-to-t from-blue-950/90 via-blue-900/50 to-transparent"></div>
                
                {/* Branding Content */}
                <div className="relative z-10 flex flex-col justify-end p-16 w-full h-full text-white">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                            <svg className="w-6 h-6 text-white transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight drop-shadow-md">SkyWings</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight mb-5 leading-[1.1] drop-shadow-md">
                        Hệ thống<br/>
                        <span className="text-sky-400">Quản trị bay</span>
                    </h1>
                    
                    <p className="text-lg text-blue-50/90 max-w-lg leading-relaxed font-medium">
                        Điều hành hàng ngàn chuyến bay, quản lý giá vé và theo dõi hành trình một cách chuyên nghiệp, nhanh chóng và an toàn tuyệt đối.
                    </p>
                    
                    <div className="mt-10 flex items-center gap-8 text-sm font-semibold text-white/80">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 border border-white/20">🚀</span>
                            Tốc độ cao
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 border border-white/20">🛡️</span>
                            Bảo mật tuyệt đối
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
                <div className="w-full max-w-md">
                    
                    {/* Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản quản trị'}
                        </h2>
                        <p className="text-slate-500 mt-3 text-sm font-medium">
                            {isLogin 
                                ? 'Đăng nhập vào bảng điều khiển để quản lý chuyến bay.' 
                                : 'Điền thông tin bên dưới để thiết lập quyền quản trị viên mới.'}
                        </p>
                    </div>

                    {/* Notification Alerts */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <span className="text-red-500 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </span>
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                            <span className="text-emerald-500 mt-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </span>
                            <p className="text-sm text-emerald-600 font-medium">{success}</p>
                        </div>
                    )}

                    {/* Google Login (Only shown on Login mode) */}
                    {isLogin && (
                        <div className="mb-8">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading || loading}
                                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                {googleLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
                            </button>
                            
                            <div className="mt-6 flex items-center justify-between">
                                <div className="w-full h-[1px] bg-slate-200"></div>
                                <span className="px-4 text-slate-400 text-sm font-medium whitespace-nowrap">Hoặc tiếp tục với email</span>
                                <div className="w-full h-[1px] bg-slate-200"></div>
                            </div>
                        </div>
                    )}

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Họ và Tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-sm placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-sm placeholder:text-slate-400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mật khẩu</label>
                                {isLogin && (
                                    <a href="#" className="text-xs font-semibold text-sky-600 hover:text-sky-700">Quên mật khẩu?</a>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-sm placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-sm placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-md shadow-sky-500/20 mt-4 outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                            {loading ? 'Đang Xử Lý...' : (isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 pt-6 border-t border-slate-100 text-center lg:text-left">
                        <p className="text-slate-600 text-sm font-medium">
                            {isLogin ? "Chưa có tài khoản quản lý? " : "Đã có tài khoản? "}
                            <button 
                                onClick={(e) => { e.preventDefault(); switchMode(); }}
                                className="text-sky-600 font-bold hover:text-sky-700 transition-colors ml-1 focus:outline-none"
                            >
                                {isLogin ? 'Đăng Ký ngay' : 'Đăng Nhập'}
                            </button>
                        </p>

                        <a href="/login" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Trở về trang khách hàng
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
