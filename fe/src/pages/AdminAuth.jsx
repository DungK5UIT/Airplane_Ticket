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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isLogin && password !== confirmPassword) {
            setError("Mã xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const response = await authService.login(email, password);
                if (response.role !== 'ADMIN') {
                    setError('Truy cập bị từ chối. Tài khoản không có phân quyền Admin.');
                    authService.logout();
                } else {
                    navigate('/admin/dashboard');
                }
            } else {
                await authService.register(name, email, password, 'ADMIN');
                setSuccess('Khởi tạo thành công! Vui lòng xác thực kênh giao tiếp (email).');
                setTimeout(() => setIsLogin(true), 4000);
            }
        } catch (err) {
            setError(err.response?.data?.message || (isLogin ? 'Xác minh thất bại!' : 'Khởi tạo thất bại!'));
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[130px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" style={{ animationDuration: '6s' }}></div>
            </div>

            <div className="relative w-full max-w-md z-10">
                <div className="backdrop-blur-2xl bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-slate-600/50 transition-colors duration-500">
                    
                    {/* Top Neon Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-[bounce_2s_infinite]"></div>
                            <span className="text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase">
                                Cổng Không Gian Hệ Thống
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 tracking-tight">
                            {isLogin ? 'Xác Thực Danh Tính' : 'Khởi Tạo Quyền Năng'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-3">
                            {isLogin ? 'Truy cập dành riêng cho bộ não điều hành' : 'Thiết lập chỉ huy tối cao mới'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 origin-top animate-down">
                            <span className="text-red-400 mt-0.5">⚠️</span>
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 origin-top animate-down">
                            <span className="text-emerald-400 mt-0.5">✅</span>
                            <p className="text-sm text-emerald-200">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Bí Danh Nhiệm Vụ</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="COMMANDER-01"
                                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all duration-300 placeholder:text-slate-700 font-mono text-sm shadow-inner"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Tín Hiệu Giao Tiếp (Email)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="system@core.local"
                                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all duration-300 placeholder:text-slate-700 font-mono text-sm shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Mã Khoá Hệ Thống</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all duration-300 placeholder:text-slate-700 font-mono tracking-widest shadow-inner"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5 focus-within:text-purple-400 transition-colors">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Xác Nhận Mã Khoá</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all duration-300 placeholder:text-slate-700 font-mono tracking-widest shadow-inner"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-6 bg-slate-800 hover:bg-transparent transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative bg-slate-950/80 px-4 py-3.5 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-slate-900/40 backdrop-blur-sm">
                                <span className="font-bold text-slate-100 tracking-wide uppercase text-sm">
                                    {loading ? 'Đang Thiết Lập Kết Nối...' : (isLogin ? 'Tiến Hành Đồng Bộ' : 'Kích Hoạt Tài Khoản')}
                                </span>
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
                        <p className="text-slate-400 text-sm">
                            {isLogin ? "Chưa có thiết lập module? " : "Đã có quyền truy cập module? "}
                            <button 
                                onClick={(e) => { e.preventDefault(); switchMode(); }}
                                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors ml-1 focus:outline-none"
                            >
                                {isLogin ? 'Cấp Quyền' : 'Trở Lại Portal'}
                            </button>
                        </p>

                        <a href="/login" className="inline-block mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors font-medium">
                            [← Thoát về giao diện người dùng thường]
                        </a>
                    </div>
                </div>
                
                {/* Techy bottom details */}
                <div className="flex justify-between items-center px-6 mt-6 opacity-40 select-none">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-sm bg-indigo-500"></div>
                        <div className="w-1.5 h-1.5 rounded-sm bg-purple-500"></div>
                        <div className="w-1.5 h-1.5 rounded-sm bg-slate-500"></div>
                    </div>
                    <div className="text-[10px] uppercase font-mono tracking-[0.3em] text-slate-500">
                        SYS_CORE_V3.8.2
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
