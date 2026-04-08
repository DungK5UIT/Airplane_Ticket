import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const AdminRegulations = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [regulations, setRegulations] = useState({
        soLuongSanBay: 0,
        thoiGianBayToiThieu: 0,
        soSanBayTrungGianToiDa: 0,
        thoiGianDungToiThieu: 0,
        thoiGianDungToiDa: 0,
        soLuongHangVe: 0,
        thoiGianChamNhatKhiDatVe: 0,
        thoiGianHuyDatVe: 0
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        const role = currentUser?.user?.role ?? currentUser?.role;
        if (!currentUser || role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchRegulations();
    }, []);

    const fetchRegulations = async () => {
        setLoading(true);
        try {
            const data = await authService.getQuyDinh();
            setRegulations(data);
        } catch (err) {
            console.error('Failed to fetch regulations', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegulations({ ...regulations, [name]: parseInt(value) || 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.updateQuyDinh(regulations);
            alert('Cập nhật quy định thành công!');
            fetchRegulations();
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans lg:flex">
            <aside className="w-full bg-slate-900 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[280px]">
                <Link to="/" className="mb-10 flex items-center gap-2 text-xl font-black">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-base">✈️</span>
                    <span>AdminPanel</span>
                </Link>

                <nav className="flex flex-1 flex-col gap-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"><span>📊</span> Tổng quan</Link>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800"><span>✈️</span> Quản lý chuyến bay</Link>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3 font-semibold text-cyan-300"><span>⚖️</span> Thay đổi quy định</div>
                    <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300"><span>👤</span> Quản lý người dùng</div>
                    <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300"><span>🎫</span> Đơn đặt vé</div>
                </nav>

                <div className="mt-6 border-t border-slate-700 pt-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-900">A</div>
                        <div>
                            <p className="text-sm font-semibold">Admin</p>
                            <p className="text-xs text-slate-300">{user?.user?.email ?? user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full rounded-lg border border-red-400 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 lg:p-10">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Thay đổi Quy định</h1>
                        <p className="mt-1 text-sm text-slate-500">Điều chỉnh các thông số kỹ thuật và quy tắc của hệ thống.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Xem Trang Chủ
                    </button>
                </header>

                <div className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section>
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 border-b pb-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-sm">🏢</span>
                                Quy định về Sân bay & Chuyến bay
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số lượng sân bay tối đa</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="soLuongSanBay" 
                                            value={regulations.soLuongSanBay} 
                                            onChange={handleInputChange} 
                                            required 
                                            min="1"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Sân bay</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian bay tối thiểu</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="thoiGianBayToiThieu" 
                                            value={regulations.thoiGianBayToiThieu} 
                                            onChange={handleInputChange} 
                                            required 
                                            min="1"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Phút</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 border-b pb-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-100 text-sm">🔄</span>
                                Quy định về Sân bay Trung gian
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số sân bay trung gian tối đa</label>
                                    <input 
                                        type="number" 
                                        name="soSanBayTrungGianToiDa" 
                                        value={regulations.soSanBayTrungGianToiDa} 
                                        onChange={handleInputChange} 
                                        required 
                                        min="0"
                                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Dừng tối thiểu</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                name="thoiGianDungToiThieu" 
                                                value={regulations.thoiGianDungToiThieu} 
                                                onChange={handleInputChange} 
                                                required 
                                                min="1"
                                                className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">P</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Dừng tối đa</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                name="thoiGianDungToiDa" 
                                                value={regulations.thoiGianDungToiDa} 
                                                onChange={handleInputChange} 
                                                required 
                                                min="1"
                                                className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">P</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 border-b pb-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 text-sm">🎫</span>
                                Quy định về Vé & Đặt chỗ
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số lượng hạng vé</label>
                                    <input 
                                        type="number" 
                                        name="soLuongHangVe" 
                                        value={regulations.soLuongHangVe} 
                                        onChange={handleInputChange} 
                                        required 
                                        min="1"
                                        className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Chậm nhất khi đặt vé</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="thoiGianChamNhatKhiDatVe" 
                                            value={regulations.thoiGianChamNhatKhiDatVe} 
                                            onChange={handleInputChange} 
                                            required 
                                            min="0"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Giờ</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian hủy vé</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="thoiGianHuyDatVe" 
                                            value={regulations.thoiGianHuyDatVe} 
                                            onChange={handleInputChange} 
                                            required 
                                            min="0"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Giờ</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                            <p className="text-sm text-slate-500 italic">* Các thay đổi sẽ được áp dụng ngay lập tức cho toàn bộ hệ thống.</p>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`flex h-12 w-48 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : 'Lưu Thay Đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminRegulations;
