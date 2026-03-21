import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [currentFlight, setCurrentFlight] = useState({
        flightNumber: '', origin: '', destination: '',
        departureTime: '', arrivalTime: '', price: 0, availableSeats: 0
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
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const data = await authService.getAllFlights();
            setFlights(data);
        } catch (err) {
            console.error('Failed to fetch flights', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFlight({ ...currentFlight, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await authService.updateFlight(currentFlight.id, currentFlight);
            } else {
                await authService.createFlight(currentFlight);
            }
            fetchFlights();
            resetForm();
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (flight) => {
        setIsEditing(true);
        setCurrentFlight({
            ...flight,
            departureTime: flight.departureTime.slice(0, 16),
            arrivalTime: flight.arrivalTime.slice(0, 16)
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
            try {
                await authService.deleteFlight(id);
                fetchFlights();
            } catch (err) {
                alert('Xóa thất bại');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentFlight({
            flightNumber: '', origin: '', destination: '',
            departureTime: '', arrivalTime: '', price: 0, availableSeats: 0
        });
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
                    <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3 font-semibold text-cyan-300"><span>📊</span> Tổng quan</div>
                    <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300"><span>✈️</span> Quản lý chuyến bay</div>
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
                        <h1 className="text-3xl font-black text-slate-900">Quản lý Chuyến Bay</h1>
                        <p className="mt-1 text-sm text-slate-500">Thêm, sửa hoặc xóa các chuyến bay trong hệ thống của bạn.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Xem Trang Chủ
                    </button>
                </header>

                <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:sticky xl:top-8">
                        <h3 className="mb-5 text-lg font-bold text-slate-900">
                            {isEditing ? '✏️ Sửa thông tin' : '➕ Thêm chuyến bay'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số hiệu chuyến bay</label>
                                <input name="flightNumber" value={currentFlight.flightNumber} onChange={handleInputChange} placeholder="VD: VN123" required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Điểm đi</label>
                                    <input name="origin" value={currentFlight.origin} onChange={handleInputChange} placeholder="Hà Nội" required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Điểm đến</label>
                                    <input name="destination" value={currentFlight.destination} onChange={handleInputChange} placeholder="TP. HCM" required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Giờ khởi hành</label>
                                <input type="datetime-local" name="departureTime" value={currentFlight.departureTime} onChange={handleInputChange} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Giờ hạ cánh</label>
                                <input type="datetime-local" name="arrivalTime" value={currentFlight.arrivalTime} onChange={handleInputChange} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Giá (VNĐ)</label>
                                    <input type="number" name="price" value={currentFlight.price} onChange={handleInputChange} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Số ghế</label>
                                    <input type="number" name="availableSeats" value={currentFlight.availableSeats} onChange={handleInputChange} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="h-11 flex-1 rounded-lg bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800">
                                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                {isEditing && (
                                    <button onClick={resetForm} type="button" className="h-11 flex-1 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                                        Hủy
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="text-base font-bold text-slate-900">Danh sách chuyến bay</h3>
                            {loading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Số hiệu</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Tuyến đường</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Giá</th>
                                        <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Ghế</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map((flight) => (
                                        <tr key={flight.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-900">{flight.flightNumber}</td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-semibold text-slate-800">{flight.origin} → {flight.destination}</div>
                                                <div className="text-xs text-slate-400">{new Date(flight.departureTime).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-orange-500">{flight.price.toLocaleString()} VNĐ</td>
                                            <td className="px-4 py-4 text-sm text-slate-700">{flight.availableSeats}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleEdit(flight)} className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-100 text-sky-700" title="Sửa">✏️</button>
                                                    <button onClick={() => handleDelete(flight.id)} className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-700" title="Xóa">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {flights.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-12 text-center text-sm text-slate-400">
                                                <div className="mb-2 text-2xl">✈️</div>
                                                Chưa có chuyến bay nào trong hệ thống.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
