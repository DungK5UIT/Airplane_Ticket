import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import Navbar from '../../components/Navbar';
import EmployeeSidebar from '../../components/EmployeeSidebar';

const formatTimeOnly = (value) => {
    if (!value) return '--:--';
    let d;
    if (Array.isArray(value)) d = new Date(value[0], value[1] - 1, value[2], value[3] || 0, value[4] || 0);
    else d = new Date(value);
    if (Number.isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDateLong = (value) => {
    if (!value) return '---';
    let d;
    if (Array.isArray(value)) d = new Date(value[0], value[1] - 1, value[2]);
    else d = new Date(value);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const EmployeeCheckin = () => {
    const [user, setUser] = useState(null);
    const [searchPnr, setSearchPnr] = useState('');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) { navigate('/login'); return; }
        setUser(currentUser);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchPnr.trim()) return;
        setLoading(true);
        setError('');
        setBooking(null);
        try {
            const data = await authService.getBookingByPNR(searchPnr.toUpperCase());
            if (data) {
                setBooking(data);
            } else {
                setError('Không tìm thấy thông tin đặt chỗ với mã này.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tìm kiếm mã đặt chỗ.');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (ticketId) => {
        setLoading(true);
        try {
            await authService.updateCheckinStatus(ticketId, 'CHECKED_IN');
            // Refresh booking data
            const data = await authService.getBookingByPNR(searchPnr.toUpperCase());
            setBooking(data);
            alert("Check-in thành công!");
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi khi thực hiện check-in.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Roboto', sans-serif" }}>
            <Navbar />
            <div className="flex flex-1 pt-20">
                <EmployeeSidebar user={user} handleLogout={handleLogout} />
                
                <main className="flex-grow p-4 md:p-8">
                    <div className="max-w-[1000px] mx-auto">
                        <header className="mb-10 text-center">
                            <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">Hệ thống Check-in</h1>
                            <p className="text-gray-500 font-medium">Nhập mã đặt chỗ (PNR) để bắt đầu quy trình làm thủ tục.</p>
                        </header>

                        {/* Search Box */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-10 max-w-2xl mx-auto transform hover:scale-[1.01] transition-all">
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">#</span>
                                    <input 
                                        autoFocus
                                        placeholder="Mã PNR (VD: VJET24)" 
                                        className="w-full bg-gray-50 rounded-2xl pl-10 pr-4 py-4 text-xl font-black uppercase outline-none focus:ring-4 focus:ring-blue-500/10 border border-gray-100 placeholder:text-gray-300"
                                        value={searchPnr}
                                        onChange={e => setSearchPnr(e.target.value)}
                                    />
                                </div>
                                <button 
                                    disabled={loading}
                                    className="px-8 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                >
                                    TÌM KIẾM
                                </button>
                            </form>
                            {error && <p className="mt-4 text-center text-red-500 font-bold text-sm">⚠️ {error}</p>}
                        </div>

                        {loading && !booking && (
                            <div className="text-center py-20 animate-pulse font-black text-gray-300 uppercase tracking-widest">Đang truy xuất dữ liệu...</div>
                        )}

                        {booking && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Flight Info Card */}
                                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <p className="text-blue-100 text-xs font-black uppercase tracking-[0.2em] mb-1">Chuyến bay</p>
                                                <h2 className="text-4xl font-black">{booking.flight?.maChuyenBay || 'FLY-999'}</h2>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-blue-100 text-xs font-black uppercase tracking-[0.2em] mb-1">Ngày khởi hành</p>
                                                <p className="font-bold">{formatDateLong(booking.flight?.ngayGioKhoiHanh)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-10">
                                            <div className="flex-1">
                                                <p className="text-6xl font-black mb-1">{booking.flight?.maSanBayDi?.maIATA || 'SGN'}</p>
                                                <p className="text-blue-100 font-bold">{booking.flight?.maSanBayDi?.thanhPho}</p>
                                            </div>
                                            <div className="flex flex-col items-center flex-1 px-4">
                                                <div className="w-full h-px bg-blue-400/50 relative flex justify-center">
                                                    <span className="absolute -top-3.5 text-2xl">✈️</span>
                                                </div>
                                                <p className="mt-4 text-xs font-black bg-white/10 px-3 py-1 rounded-full">{formatTimeOnly(booking.flight?.ngayGioKhoiHanh)}</p>
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className="text-6xl font-black mb-1">{booking.flight?.maSanBayDen?.maIATA || 'HAN'}</p>
                                                <p className="text-blue-100 font-bold">{booking.flight?.maSanBayDen?.thanhPho}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Passenger List */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-gray-800 ml-4 uppercase tracking-wider">Danh sách hành khách</h3>
                                    {booking.passengers?.map((p, i) => (
                                        <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-2xl text-blue-600 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {p.soGhe || '??'}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-gray-800 uppercase">{p.hoTenHK}</h4>
                                                    <p className="text-sm font-bold text-gray-400 tracking-widest">CCCD: {p.cccd} · {p.doiTuong || 'NGƯỜI LỚN'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right mr-4">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</p>
                                                    <span className={`text-sm font-black uppercase ${p.trangThai === 'CHECKED_IN' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {p.trangThai === 'CHECKED_IN' ? 'Đã Check-in ✅' : 'Chưa Check-in ⏳'}
                                                    </span>
                                                </div>
                                                {p.trangThai !== 'CHECKED_IN' ? (
                                                    <button 
                                                        onClick={() => handleCheckin(p.maVe || p.id)}
                                                        className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
                                                    >
                                                        XÁC NHẬN
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="px-6 py-3 bg-emerald-50 text-emerald-600 font-black rounded-xl border border-emerald-100 cursor-default"
                                                    >
                                                        HOÀN TẤT
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Boarding Card (Simulated) */}
                                {booking.passengers?.every(p => p.trangThai === 'CHECKED_IN') && (
                                    <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-8 text-center animate-in zoom-in duration-500">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✨</div>
                                        <h4 className="text-2xl font-black text-emerald-800 mb-2">Tất cả đã hoàn tất!</h4>
                                        <p className="text-emerald-600 font-bold mb-6">Mã PNR {searchPnr.toUpperCase()} đã được làm thủ tục thành công cho toàn bộ hành khách.</p>
                                        <button onClick={() => window.print()} className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">IN THẺ LÊN MÁY BAY</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EmployeeCheckin;
