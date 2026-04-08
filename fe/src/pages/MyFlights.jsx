import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';

export default function MyFlights() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }
            setUser(currentUser);

            const userId = currentUser?.maNguoiDung || currentUser?.user?.maNguoiDung || currentUser?.user?.id || currentUser?.id;
            if (userId) {
                try {
                    setIsLoading(true);
                    const data = await authService.getUserBookings(userId);
                    setBookings(data || []);
                } catch (error) {
                    console.error("Failed to fetch bookings:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchBookings();
    }, [navigate]);

    const formatMoney = (value) => {
        if (value == null) return '—';
        return Number(value).toLocaleString('vi-VN') + ' VNĐ';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) { return dateStr; }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '--:--';
        try {
            const d = new Date(dateStr);
            return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) { return '--:--'; }
    };

    const allFlights = bookings.flatMap(booking =>
        (booking.tickets || []).map(ticket => ({
            ...ticket,
            maDatCho: booking.maDatCho,
            tongTien: booking.tongTien,
            trangThaiBooking: booking.trangThai,
            ngayDatVe: booking.ngayDatVe
        }))
    );

    const handleDownloadTicket = (maVe) => {
        if (!maVe) {
            console.error("Ticket ID (maVe) is missing");
            return;
        }
        window.location.href = `http://localhost:8080/api/tickets/download/${maVe}`;
    };

    const filteredFlights = allFlights.filter(f => {
        const isUpcoming = f.trangThaiBooking === 'PENDING' || f.trangThaiBooking === 'SUCCESS';
        return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Chờ thanh toán</span>;
            case 'SUCCESS':
                return <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Sắp bay</span>;
            case 'COMPLETED':
                return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Đã hoàn thành</span>;
            case 'CANCELLED':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Đã hủy</span>;
            default:
                return null;
        }
    };

    const getAirlineInfo = (flightNumber) => {
        if (!flightNumber) return { bg: 'from-slate-600 to-slate-800', text: 'AIR' };
        if (flightNumber?.startsWith('VN')) return { bg: 'from-blue-600 to-blue-800', text: 'VNA' };
        if (flightNumber?.startsWith('VJ')) return { bg: 'from-red-500 to-red-600', text: 'VJA' };
        if (flightNumber?.startsWith('QH')) return { bg: 'from-emerald-500 to-emerald-700', text: 'BBA' };
        return { bg: 'from-slate-600 to-slate-800', text: 'FLY' };
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <Navbar transparent={true} />
            <div className="relative h-[360px] w-full overflow-hidden bg-sky-100">
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-700/30 to-sky-900/40 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                    alt="Airplane wing"
                    className="w-full h-full object-cover transform scale-105"
                />
                <div className="absolute bottom-12 left-0 right-0 z-20 px-6">
                    <div className="max-w-5xl mx-auto flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-wide">Nhật Ký Đích Đến</h1>
                            <p className="text-sky-50 font-medium text-base md:text-lg max-w-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Theo dõi và quản lý mọi hành trình cùng FlyViet.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-slate-200 pt-6 px-6 sticky top-16 md:top-20 z-[90] shadow-sm">
                <div className="max-w-5xl mx-auto flex gap-8">
                    <button
                        className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'upcoming' ? 'text-sky-600' : 'text-slate-400'}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Chuyến bay sắp tới
                        {activeTab === 'upcoming' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-600 rounded-t-full"></span>}
                    </button>
                    <button
                        className={`pb-4 text-sm font-black transition-all relative ${activeTab === 'history' ? 'text-sky-600' : 'text-slate-400'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử chuyến bay
                        {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-600 rounded-t-full"></span>}
                    </button>
                </div>
            </div>

            <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-bold uppercase text-xs">Đang tải...</p>
                    </div>
                ) : filteredFlights.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Không có chuyến bay nào</h3>
                        <button onClick={() => navigate('/flight')} className="mt-6 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold">Đặt vé mới ngay</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filteredFlights.map((flight, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
                                <div className={`absolute top-0 left-0 w-full h-1 ${flight.trangThaiBooking === 'SUCCESS' ? 'bg-sky-500' : 'bg-amber-500'}`}></div>
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                    <div className="flex-grow flex flex-col md:border-r border-slate-100 md:pr-8">
                                        <div className="flex justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAirlineInfo(flight.maChuyenBay).bg} flex items-center justify-center text-white font-black text-xs`}>
                                                    {getAirlineInfo(flight.maChuyenBay).text}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400">Chuyến bay</p>
                                                    <p className="text-sm font-black text-slate-800">{flight.maChuyenBay || 'FLY-001'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-sky-50 px-4 py-2 rounded-lg text-right">
                                                <p className="text-[10px] font-bold text-sky-600 uppercase">Ngày bay</p>
                                                <p className="text-sm font-bold text-sky-700">{formatDate(flight.thoiGianDi)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-left w-max pr-4">
                                                <h3 className="text-3xl font-black text-slate-900">{formatTime(flight.thoiGianDi)}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase">{flight.noiDi}</p>
                                            </div>
                                            <div className="flex-grow border-t-2 border-dashed border-slate-200 relative mx-4">
                                                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-sky-500">✈</div>
                                            </div>
                                            <div className="text-right w-max pl-4">
                                                <h3 className="text-3xl font-black text-slate-900">{formatTime(flight.thoiGianDen)}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase">{flight.noiDen}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-[280px] flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between mb-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mã đặt chỗ</p>
                                                    <p className="text-sm font-black text-slate-800 tracking-widest">{flight.maDatCho}</p>
                                                </div>
                                                {getStatusBadge(flight.trangThaiBooking)}
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2">
                                                <div className="col-span-2">
                                                    <p className="text-[10px] font-bold text-slate-400">Hành khách</p>
                                                    <p className="text-sm font-bold text-slate-700 truncate capitalize">{flight.hoTenHK}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400">Hạng vé</p>
                                                    <p className="text-xs font-bold text-slate-700">{flight.tenHangVe}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400">Ghế ngồi</p>
                                                    <p className="text-xs font-black text-sky-600 bg-sky-50 rounded px-1.5 py-0.5 inline-block">{flight.soGhe || '--'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex flex-col">
                                            <div className="flex justify-between items-end mb-3">
                                                <p className="text-[10px] font-bold text-slate-400">Tổng đơn hàng</p>
                                                <p className="text-xl font-black text-emerald-600">{formatMoney(flight.tongTien)}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {(flight.trangThaiBooking === 'SUCCESS' || flight.trangThaiBooking === 'COMPLETED') && (
                                                    <button 
                                                        onClick={() => handleDownloadTicket(flight.maVe)}
                                                        className="flex-grow py-3 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-sky-200"
                                                        title="Tải vé PDF"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        <span>Tải vé</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
