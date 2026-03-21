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
                        Bắt đầu <br />
                        <span className="text-sky-300">Hành trình mới.</span>
                    </h1>
                    <p className="max-w-sm text-sm font-medium text-white/85 leading-7">
                        Trở thành thành viên của FlyViet để nhận thông báo vé máy bay giá tốt và quản lý chuyến bay tiện lợi hơn.
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
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Tạo tài khoản</h2>
                            <p className="mt-2 text-sm font-medium text-slate-500">
                                Tham gia FlyViet chỉ với vài bước đơn giản.
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

                        {success && (
                            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-700">
                                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Họ và tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

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
                                        placeholder="Ít nhất 6 ký tự"
                                        required
                                        autoComplete="new-password"
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword((v) => !v)}
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

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                        autoComplete="new-password"
                                        className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                    >
                                        {showConfirmPassword ? (
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 h-12 w-full rounded-xl bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                            <p className="text-sm font-semibold text-slate-500">
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="font-extrabold text-blue-600 hover:text-blue-700">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                            <p className="mt-2 text-xs font-medium leading-6 text-slate-400">
                                Bằng việc đăng ký, bạn đồng ý với{' '}
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

export default Register;