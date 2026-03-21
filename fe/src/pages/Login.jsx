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
            const userRole = response?.user?.role ?? response?.role;
            if (userRole === 'ADMIN') {
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
        <div className="min-h-screen flex bg-slate-100 font-sans">
            <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-950/70 to-slate-950/90" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-center text-white">
                    <div className="mb-10 flex items-center gap-3">
                        <img
                            src={logoImg}
                            alt="FlyViet"
                            className="h-10 w-10 rounded-lg object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span className="text-xl font-extrabold tracking-[0.12em] uppercase">FlyViet</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold leading-tight">
                        Chạm đến bầu trời,<br />
                        <span className="text-sky-300">Khám phá thế giới.</span>
                    </h1>
                    <p className="max-w-sm text-sm font-medium text-white/85 leading-7">
                        Nền tảng đặt vé máy bay hàng đầu - an toàn, nhanh chóng và ngập tràn ưu đãi hạng nhất.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-[460px]">
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <img
                            src={logoImg}
                            alt="FlyViet"
                            className="h-9 w-9 rounded-lg object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <span className="text-lg font-extrabold tracking-[0.1em] uppercase text-slate-900">FlyViet</span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
                        <div className="mb-7">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Đăng nhập</h2>
                            <p className="mt-2 text-sm font-medium text-slate-500">
                                Chào mừng bạn quay lại! Hãy đăng nhập để tiếp tục.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-semibold text-red-700">
                                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Email của bạn</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    autoComplete="email"
                                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 4.24A10.94 10.94 0 0112 4c5.52 0 10 4 11 8-.39 1.56-1.33 3.02-2.68 4.2M6.23 6.23C4.45 7.55 3.17 9.21 3 12c1 4 5.48 8 11 8 1.55 0 3.05-.28 4.42-.8" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.46 12C3.73 7.94 7.52 5 12 5c4.48 0 8.27 2.94 9.54 7-1.27 4.06-5.06 7-9.54 7-4.48 0-8.27-2.94-9.54-7z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-slate-500">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Ghi nhớ đăng nhập
                                </label>
                                <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || googleLoading}
                                className="mt-2 h-12 w-full rounded-xl bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">hoặc</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <span className="inline-flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="h-5 w-5">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                {googleLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
                            </span>
                        </button>

                        <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                            <p className="text-sm font-semibold text-slate-500">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-700">
                                    Đăng ký ngay
                                </Link>
                            </p>
                            <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                                Bằng việc đăng nhập, bạn đồng ý với{' '}
                                <a href="#" className="font-bold text-slate-500 hover:text-slate-700">Điều khoản dịch vụ</a>
                                {' '}và{' '}
                                <a href="#" className="font-bold text-slate-500 hover:text-slate-700">Chính sách bảo mật</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;