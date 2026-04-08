import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingSummary from '../components/BookingSummary';
import PartnerBanks from '../components/PartnerBanks';
import api, { authService } from '../services/api';

const formatMoneyVND = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const formatTimeOnly = (value) => {
    if (!value) return '--:--';
    let d;
    if (Array.isArray(value)) {
        d = new Date(value[0], value[1] - 1, value[2], value[3] || 0, value[4] || 0);
    } else if (typeof value === 'string' && value.includes('T')) {
        const [datePart, timePart] = value.split('T');
        const [y, m, day] = datePart.split('-').map(Number);
        const [h, min] = timePart.split(':').map(Number);
        d = new Date(y, m - 1, day, h, min);
    } else {
        d = new Date(value);
    }
    if (Number.isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDateShort = (value) => {
    if (!value) return '--/--/----';
    let d;
    if (Array.isArray(value)) {
        d = new Date(value[0], value[1] - 1, value[2]);
    } else if (typeof value === 'string' && value.includes('T')) {
        const [dPart] = value.split('T');
        const [y, m, day] = dPart.split('-').map(Number);
        d = new Date(y, m - 1, day);
    } else {
        d = new Date(value);
    }
    if (Number.isNaN(d.getTime())) return '--/--/----';
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = days[d.getDay()];
    return `${dayName}, ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
};

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [isVnpayModalOpen, setIsVnpayModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!state || !state.requestData) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans">
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');`}
                </style>
                <div style={{ fontFamily: "'Nunito', sans-serif" }}>
                    <h3 className="mb-4 text-xl font-bold text-slate-800">Không tìm thấy thông tin thanh toán.</h3>
                    <button onClick={() => navigate('/')} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Trang chủ</button>
                </div>
            </div>
        );
    }

    const {
        requestData,
        flight,
        pax,
        selectedSeats,
        totalPrice,
        selectedBaggage,
        selectedInsurance,
        ticketClass,
        ticketClassDetail,
        discountAmount = 0
    } = state;

    const totalPassengers = pax.adult + pax.child + pax.infant;
    const baggageTotal = (selectedBaggage?.price || 0) * totalPassengers;
    const insuranceTotal = (selectedInsurance?.price || 0) * totalPassengers;
    const fareAndTaxes = totalPrice - baggageTotal - insuranceTotal;
    const totalTicketPrice = fareAndTaxes / 1.2;
    const taxesAndFees = fareAndTaxes - totalTicketPrice;

    // Call API helper
    const submitBooking = async (methodInfo) => {
        setIsProcessing(true);
        const user = authService.getCurrentUser();
        console.log("[DEBUG Frontend] Current user:", user);
        try {
            // Data is already mapped in Orders.jsx to BookingRequestDto
            const finalData = { ...requestData };

            // Ensure maNguoiDung is populated if the user is logged in
            if (!finalData.maNguoiDung && user) {
                const userId = user?.maNguoiDung || user?.user?.maNguoiDung || user?.user?.id || user?.id;
                if (userId) {
                    finalData.maNguoiDung = userId;
                    console.log("[DEBUG Frontend] Re-injected user ID:", userId);
                }
            }

            console.log("[DEBUG Frontend] Sending booking payload:", finalData);

            // Using the api instance (axios) to include base URL and headers
            const response = await api.post('/api/bookings', finalData, {
                headers: {
                    'Authorization': user?.token ? `Bearer ${user.token}` : ''
                }
            });

            if (response.status === 200 || response.status === 201) {
                const data = response.data;
                setIsProcessing(false);
                setIsVnpayModalOpen(false);

                alert(`Đặt vé thành công!\nSố PNR: ${data.maDatCho || 'N/A'}\nTrạng thái: ${methodInfo === 'VNPAY' ? 'Đã thanh toán (Mô phỏng)' : 'Đang chờ thanh toán'}`);
                navigate('/');
            }
        } catch (error) {
            setIsProcessing(false);
            console.error('Lỗi khi đặt vé:', error);

            let errorMsg = 'Lỗi hệ thống hoặc không thể kết nối tới máy chủ.';
            if (error.response) {
                // Backend returned an error response (400, 401, 500 etc)
                errorMsg = typeof error.response.data === 'string' ? error.response.data : (error.response.data?.message || JSON.stringify(error.response.data));
            }

            alert('Có lỗi xảy ra trong quá trình đặt vé: ' + errorMsg);
        }
    };

    const handleConfirmPayment = () => {
        if (paymentMethod === 'VNPAY') {
            setIsVnpayModalOpen(true); // Open mock VNPay Modal
        } else {
            submitBooking('PAY_LATER'); // Immediate call for Pay Later
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-slate-900 font-sans" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');`}
            </style>
            <Navbar transparent={false} />
            <div className="mx-auto w-[min(1200px,96vw)] pt-[100px] mb-10 flex-grow grid lg:grid-cols-[1fr_360px] gap-6 items-start">

                {/* Left Panel: Payment Method Selection */}
                <div className="flex flex-col gap-5">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-slate-800">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm font-black text-sky-600">3</span>
                            Phương thức thanh toán
                        </h2>

                        <div className="flex flex-col gap-4">
                            {/* VNPAY Option */}
                            <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-sky-500 bg-sky-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    className="mt-1 w-5 h-5 text-sky-600"
                                    checked={paymentMethod === 'VNPAY'}
                                    onChange={() => setPaymentMethod('VNPAY')}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="h-8 rounded overflow-hidden">
                                            {/* Dummy VNPAY Logo */}
                                            <div className="bg-blue-600 text-white font-black italic px-2 py-1 text-sm h-full flex items-center">
                                                VN<span className="text-red-500 font-bold">PAY</span>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-800 text-base">Thanh toán qua VNPAY / App Ngân hàng</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Quét mã QR qua ứng dụng Mobile Banking hoặc thanh toán bằng thẻ ATM/Visa/MasterCard qua cổng VNPAY.</p>
                                </div>
                            </label>

                            {/* PAY LATER Option */}
                            <label className={`border-2 rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${paymentMethod === 'PAY_LATER' ? 'border-sky-500 bg-sky-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    className="mt-1 w-5 h-5 text-sky-600"
                                    checked={paymentMethod === 'PAY_LATER'}
                                    onChange={() => setPaymentMethod('PAY_LATER')}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="h-8 w-14 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <span className="font-bold text-slate-800 text-base">Thanh toán sau (Giữ chỗ)</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Giữ chỗ ngay lập tức và thanh toán sau trong vòng 24 giờ. Mã đặt chỗ sẽ gửi qua Email hoặc trang Quản lý đặt chỗ.</p>
                                </div>
                            </label>
                        </div>

                        <PartnerBanks />
                    </div>
                </div>

                {/* Right Panel: Order Summary (Recycled Component) */}
                <BookingSummary
                    flight={flight}
                    pax={pax}
                    selectedSeats={selectedSeats}
                    totalPrice={totalPrice}
                    discount={discountAmount}
                    selectedBaggage={selectedBaggage}
                    selectedInsurance={selectedInsurance}
                    ticketClass={ticketClass}
                    ticketClassDetail={ticketClassDetail}
                    onEdit={() => navigate(-1)}
                    actionButton={
                        <button
                            type="button"
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="w-full py-3 rounded-xl bg-orange-500 text-white font-black text-base hover:bg-orange-600 transition-colors shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Đang xử lý...
                                </>
                            ) : (
                                paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPAY' : 'Xác nhận đặt vé (Trả sau)'
                            )}
                        </button>
                    }
                />
            </div>
            <Footer />
            {isVnpayModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden font-sans border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                            <div className="font-black italic px-2 py-1 text-lg flex items-center bg-white/10 rounded">
                                VN<span className="text-red-300 font-bold">PAY</span><sup className="text-[10px] ml-1 opacity-80 pl-1 border-l border-white/30">QR</sup>
                            </div>
                            <button onClick={() => !isProcessing && setIsVnpayModalOpen(false)} disabled={isProcessing} className="text-blue-100 hover:text-white transition p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col items-center text-center">
                            <h3 className="text-slate-800 font-black text-xl mb-1 mt-2">Quét mã để thanh toán</h3>
                            <p className="text-slate-500 text-sm font-medium mb-6">Mở app Ngân hàng và quét mã QR bên dưới</p>

                            <div className="bg-white p-3 rounded-xl shadow-sm border-2 border-slate-100 mb-6 relative">
                                {/* Dummy QR Code using gradient and dashed lines */}
                                <div className="w-48 h-48 bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-x-0 h-[2px] bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                    <svg className="w-full h-full text-slate-800 p-2 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4 4h6v6H4V4zm2 2v2h2V6H6zm10-2h6v6h-6V4zm2 2v2h2V6h-2zM4 14h6v6H4v-6zm2 2v2h2v-2H6zm10 2h-2v2h2v-2zm-2-4h2v2h-2v-2zm4 0h2v2h-2v-2zm0 4h2v2h-2v-2zm-6-2h2v2h-2v-2zM10 4h2v2h-2V4zm0 14h2v2h-2v-2z" />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded flex items-center justify-center p-1 w-10 h-10 shadow-sm border border-slate-100 text-blue-600 font-black text-xs leading-none">
                                        VNP
                                    </div>
                                </div>

                                <style>{`
                                    @keyframes scan {
                                        0% { top: 0; }
                                        50% { top: 100%; }
                                        100% { top: 0; }
                                    }
                                    @keyframes fadeIn {
                                        from { opacity: 0; transform: scale(0.95) }
                                        to { opacity: 1; transform: scale(1) }
                                    }
                                `}</style>

                                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-blue-600"></div>
                                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-blue-600"></div>
                                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-blue-600"></div>
                                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-blue-600"></div>
                            </div>

                            <div className="bg-slate-50 text-slate-700 font-bold p-3 rounded-xl w-full flex justify-between items-center text-sm border border-slate-200">
                                <span>Số tiền thanh toán:</span>
                                <span className="text-blue-600 text-lg">{formatMoneyVND(totalPrice)}</span>
                            </div>

                            <div className="mt-6 w-full pt-4 border-t border-slate-100 flex flex-col gap-3">
                                {/* Simulated button to complete payment mock */}
                                <button
                                    onClick={() => submitBooking('VNPAY')}
                                    disabled={isProcessing}
                                    className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? 'Đang xác thực giao dịch...' : '(Mô phỏng) Đã quét & Thanh toán'}
                                </button>
                                <button
                                    onClick={() => !isProcessing && setIsVnpayModalOpen(false)}
                                    disabled={isProcessing}
                                    className="text-slate-500 font-medium text-sm hover:text-slate-700 transition disabled:opacity-50"
                                >
                                    Hủy giao dịch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
