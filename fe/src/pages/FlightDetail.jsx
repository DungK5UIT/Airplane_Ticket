import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// --- Helpers ---
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

const SEAT_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TOTAL_ROWS = 20;

// --- Dữ liệu gói hành lý ---
const BAGGAGE_OPTIONS = [
    {
        id: 'none',
        label: 'Không thêm hành lý',
        weight: null,
        price: 0,
        description: 'Chỉ bao gồm 7kg hành lý xách tay miễn phí.',
        icon: '🚫',
        tag: null,
    },
    {
        id: '15kg',
        label: 'Hành lý 15kg',
        weight: 15,
        price: 150000,
        description: '1 kiện ký gửi tối đa 15kg. Phù hợp cho chuyến đi ngắn ngày.',
        icon: '🧳',
        tag: null,
    },
    {
        id: '20kg',
        label: 'Hành lý 20kg',
        weight: 20,
        price: 220000,
        description: '1 kiện ký gửi tối đa 20kg. Lựa chọn phổ biến nhất cho hành khách.',
        icon: '🧳',
        tag: 'Phổ biến',
    },
    {
        id: '30kg',
        label: 'Hành lý 30kg',
        weight: 30,
        price: 320000,
        description: '1 kiện ký gửi tối đa 30kg. Lý tưởng cho chuyến đi dài hoặc gia đình.',
        icon: '🧳',
        tag: 'Tiết kiệm',
    },
];

// --- Dữ liệu gói bảo hiểm ---
const INSURANCE_OPTIONS = [
    {
        id: 'none',
        label: 'Không mua bảo hiểm',
        price: 0,
        description: 'Bạn tự chịu rủi ro trong suốt hành trình.',
        icon: '🚫',
        tag: null,
        benefits: [],
    },
    {
        id: 'basic',
        label: 'Gói Cơ Bản',
        price: 55000,
        description: 'Bảo vệ cơ bản cho chuyến bay của bạn với các quyền lợi thiết yếu.',
        icon: '🛡️',
        tag: null,
        benefits: [
            { icon: '✈️', text: 'Trễ chuyến bay (bồi thường đến 500.000đ)' },
            { icon: '🧳', text: 'Mất/hư hỏng hành lý (bồi thường đến 2.000.000đ)' },
            { icon: '🏥', text: 'Chi phí y tế khẩn cấp (đến 10.000.000đ)' },
        ],
    },
    {
        id: 'premium',
        label: 'Gói Cao Cấp',
        price: 120000,
        description: 'Bảo hiểm toàn diện — tâm lý thoải mái suốt hành trình.',
        icon: '🛡️',
        tag: 'Khuyên dùng',
        benefits: [
            { icon: '✈️', text: 'Hủy/hoãn chuyến (bồi thường đến 5.000.000đ)' },
            { icon: '🧳', text: 'Mất/hư hỏng hành lý (bồi thường đến 5.000.000đ)' },
            { icon: '🏥', text: 'Chi phí y tế & cấp cứu (đến 50.000.000đ)' },
            { icon: '🌐', text: 'Hỗ trợ toàn cầu 24/7' },
            { icon: '💼', text: 'Bồi thường tai nạn cá nhân (đến 100.000.000đ)' },
        ],
    },
];

export default function FlightDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const flight = state?.flight;
    const ticketClass = state?.ticketClass || 'ECO';
    const initialTotal = state?.totalPassengers || 1;
    const [pax, setPax] = useState(state?.pax || { adult: initialTotal, child: 0, infant: 0 });
    const totalPassengers = pax.adult + pax.child + pax.infant;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [expandedSection, setExpandedSection] = useState(null);

    // Hành lý & bảo hiểm state
    const [selectedBaggage, setSelectedBaggage] = useState('none');
    const [selectedInsurance, setSelectedInsurance] = useState('none');

    useEffect(() => {
        window.scrollTo(0, 0); // Đảm bảo trang bắt đầu ở trên cùng
        if (!flight) { navigate('/flight'); return; }
        const hash = flight.id ? flight.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 123;
        const seedRandom = (seed) => {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
        const occupied = [];
        let seed = hash;
        for (let r = 1; r <= TOTAL_ROWS; r++) {
            for (let c of SEAT_COLS) {
                if (seedRandom(seed++) < 0.3) occupied.push(`${r}${c}`);
            }
        }
        setOccupiedSeats(occupied);
    }, [flight, navigate]);

    if (!flight) return null;

    const toggleSeat = (seatId) => {
        if (occupiedSeats.includes(seatId)) return;
        setSelectedSeats(prev => {
            const isRemoving = prev.includes(seatId);
            const nextSeats = isRemoving ? prev.filter(s => s !== seatId) : [...prev, seatId];

            // Nếu đã chọn đủ (hoặc vượt quá) số ghế so với hành khách ban đầu, thì tự động đóng accordion
            if (!isRemoving && nextSeats.length >= totalPassengers) {
                setTimeout(() => setExpandedSection(null), 300);
            }

            if (!isRemoving && prev.length >= totalPassengers) {
                setPax(p => ({ ...p, adult: p.adult + 1 }));
            }
            return nextSeats;
        });
    };

    const basePrice = ticketClass === 'BUSINESS' ? (flight.giaThuongGia || flight.giaCoBan * 2.5) : (flight.giaPhoThong || flight.giaCoBan || 0);
    const totalTicketPrice = basePrice * totalPassengers;
    const taxesAndFees = totalTicketPrice * 0.2;

    const baggageOption = BAGGAGE_OPTIONS.find(o => o.id === selectedBaggage);
    const insuranceOption = INSURANCE_OPTIONS.find(o => o.id === selectedInsurance);
    const baggageTotal = (baggageOption?.price || 0) * totalPassengers;
    const insuranceTotal = (insuranceOption?.price || 0) * totalPassengers;

    const finalTotal = totalTicketPrice + taxesAndFees + baggageTotal + insuranceTotal;

    const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
                `}
            </style>

            <div className="relative z-10 w-full flex-grow">
                <Navbar transparent={false} />

                <div className="mx-auto w-[min(1200px,96vw)] pt-[100px] pb-10 grid lg:grid-cols-[1fr_360px] gap-6 items-start">

                    {/* --- CỘT TRÁI --- */}
                    <div className="flex flex-col gap-5">
                        <h2 className="text-xl font-bold text-sky-700 mb-1">
                            Hoàn thiện chuyến bay của bạn
                        </h2>

                        {/* ── Accordion 1: Chọn chỗ ngồi ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleSection('seat')}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-slate-800">Chọn chỗ ngồi yêu thích</h3>
                                        <p className="text-sm font-medium text-slate-500">Hãy chọn chỗ ngồi yêu thích của bạn</p>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'seat' ? 'rotate-90' : ''}`}><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </button>

                            {expandedSection === 'seat' && (
                                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                    <div className="mb-6 flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-600 bg-white p-3 rounded-xl shadow-sm w-max mx-auto border border-slate-200">
                                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-slate-300 bg-white" /> Trống</span>
                                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-sky-600 bg-sky-500" /> Đang chọn</span>
                                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-slate-200 bg-slate-200" /> Đã đặt</span>
                                    </div>
                                    <div className="mx-auto w-max rounded-[40px] border-[10px] border-slate-300 bg-white px-8 py-10 shadow-inner">
                                        {Array.from({ length: TOTAL_ROWS }).map((_, rIdx) => {
                                            const rowNum = rIdx + 1;
                                            const leftSeats = SEAT_COLS.slice(0, 3);
                                            const rightSeats = SEAT_COLS.slice(3, 6);
                                            const renderSeat = (c) => {
                                                const seatId = `${rowNum}${c}`;
                                                const isOccupied = occupiedSeats.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);
                                                const base = 'h-10 w-10 rounded-lg border-2 text-sm font-black transition-all';
                                                const cls = isOccupied
                                                    ? 'border-slate-200 bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    : isSelected
                                                        ? 'border-sky-700 bg-sky-500 text-white shadow-md scale-110'
                                                        : 'border-slate-300 bg-white text-slate-600 hover:border-sky-500 hover:bg-sky-50';
                                                return (
                                                    <button key={seatId} type="button" onClick={() => toggleSeat(seatId)} disabled={isOccupied} title={seatId} className={`${base} ${cls}`}>
                                                        {isOccupied ? '×' : (isSelected ? c : '')}
                                                    </button>
                                                );
                                            };
                                            return (
                                                <div key={rowNum} className="mb-3 flex items-center justify-center gap-6">
                                                    <div className="flex gap-2">{leftSeats.map(renderSeat)}</div>
                                                    <span className="w-6 text-center text-sm font-black text-slate-400 bg-slate-100 rounded-full py-1">{rowNum}</span>
                                                    <div className="flex gap-2">{rightSeats.map(renderSeat)}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm font-bold text-slate-700">Đã chọn: <span className="text-sky-600">{selectedSeats.length}/{totalPassengers}</span> ghế</p>
                                        <div className="mt-2 flex justify-center flex-wrap gap-2">
                                            {selectedSeats.map(s => <span key={s} className="px-3 py-1 bg-sky-100 text-sky-800 font-black rounded-lg text-sm border border-sky-200">{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Accordion 2: Hành lý ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleSection('baggage')}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-slate-800">Chọn hành lý</h3>
                                        <p className="text-sm font-medium text-slate-500">
                                            {flight.maSanBayDi?.maIATA || 'SGN'} ✈ {flight.maSanBayDen?.maIATA || 'VCL'} · Miễn phí 7kg xách tay
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-sky-600 text-lg">{formatMoneyVND(baggageTotal)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'baggage' ? 'rotate-90' : ''}`}><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                                </div>
                            </button>

                            {expandedSection === 'baggage' && (
                                <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                                    {/* Thông tin hành lý xách tay miễn phí */}
                                    <div className="mb-4 flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl p-4">
                                        <span className="text-2xl">ℹ️</span>
                                        <div className="text-sm text-sky-800">
                                            <p className="font-bold mb-0.5">Hành lý xách tay miễn phí</p>
                                            <p className="font-medium text-sky-700">Mỗi hành khách được mang <b>1 túi xách tay tối đa 7kg</b> và 1 vật dụng cá nhân (ví, ba lô nhỏ). Kích thước tối đa: 56 × 36 × 23cm.</p>
                                        </div>
                                    </div>

                                    {/* Danh sách gói hành lý ký gửi */}
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">Hành lý ký gửi — chọn 1 gói/người</p>
                                    <div className="flex flex-col gap-3">
                                        {BAGGAGE_OPTIONS.map(opt => {
                                            const isSelected = selectedBaggage === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setSelectedBaggage(opt.id)}
                                                    className={`relative w-full text-left rounded-xl border-2 p-4 transition-all ${isSelected ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                >
                                                    {opt.tag && (
                                                        <span className="absolute top-3 right-3 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                            {opt.tag}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        {/* Radio indicator */}
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-300'}`}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className="text-2xl">{opt.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-bold text-slate-800 text-sm">{opt.label}</span>
                                                                <span className={`font-black text-base flex-shrink-0 ${opt.price === 0 ? 'text-emerald-600' : 'text-sky-600'}`}>
                                                                    {opt.price === 0 ? 'Miễn phí' : `+${formatMoneyVND(opt.price)}/người`}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{opt.description}</p>
                                                            {opt.weight && (
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                                                        ⚖️ Tối đa {opt.weight}kg
                                                                    </span>
                                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                                                        📦 1 kiện
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Tổng tiền nếu nhiều hành khách */}
                                                    {opt.price > 0 && totalPassengers > 1 && isSelected && (
                                                        <div className="mt-3 pt-3 border-t border-sky-100 flex justify-between items-center text-xs text-sky-700 font-bold">
                                                            <span>{formatMoneyVND(opt.price)} × {totalPassengers} hành khách</span>
                                                            <span className="text-sky-600">= {formatMoneyVND(opt.price * totalPassengers)}</span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Lưu ý thêm hành lý */}
                                    <p className="mt-4 text-xs text-slate-400 font-medium text-center">
                                        ⚠️ Vượt quá cân nặng cho phép sẽ bị tính phụ phí tại sân bay. Khuyến khích mua trước để tiết kiệm chi phí.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ── Accordion 3: Bảo hiểm ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => toggleSection('insurance')}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-base font-bold text-slate-800">Bảo hiểm du lịch</h3>
                                        <p className="text-sm font-medium text-slate-500">
                                            {flight.maSanBayDi?.maIATA || 'SGN'} ✈ {flight.maSanBayDen?.maIATA || 'VCL'} · Bảo vệ chuyến đi của bạn
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-sky-600 text-lg">{formatMoneyVND(insuranceTotal)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 text-slate-400 transition-transform ${expandedSection === 'insurance' ? 'rotate-90' : ''}`}><path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                                </div>
                            </button>

                            {expandedSection === 'insurance' && (
                                <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                                    {/* Banner giới thiệu */}
                                    <div className="mb-4 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                        <span className="text-2xl">🛡️</span>
                                        <div className="text-sm text-blue-800">
                                            <p className="font-bold mb-0.5">Tại sao nên mua bảo hiểm?</p>
                                            <p className="font-medium text-blue-700">Chuyến bay có thể bị hoãn, hành lý có thể bị thất lạc. Bảo hiểm du lịch giúp bạn yên tâm và được bồi thường nhanh chóng khi sự cố xảy ra.</p>
                                        </div>
                                    </div>

                                    {/* Các gói bảo hiểm */}
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">Chọn gói bảo hiểm</p>
                                    <div className="flex flex-col gap-3">
                                        {INSURANCE_OPTIONS.map(opt => {
                                            const isSelected = selectedInsurance === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setSelectedInsurance(opt.id)}
                                                    className={`relative w-full text-left rounded-xl border-2 p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                >
                                                    {opt.tag && (
                                                        <span className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                            {opt.tag}
                                                        </span>
                                                    )}
                                                    <div className="flex items-start gap-3">
                                                        {/* Radio indicator */}
                                                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-bold text-slate-800 text-sm">{opt.label}</span>
                                                                <span className={`font-black text-base flex-shrink-0 ${opt.price === 0 ? 'text-slate-400' : 'text-blue-600'}`}>
                                                                    {opt.price === 0 ? 'Không mua' : `+${formatMoneyVND(opt.price)}/người`}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{opt.description}</p>

                                                            {/* Danh sách quyền lợi */}
                                                            {opt.benefits.length > 0 && (
                                                                <ul className="mt-3 flex flex-col gap-1.5">
                                                                    {opt.benefits.map((b, i) => (
                                                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                                                                            <span className="flex-shrink-0">{b.icon}</span>
                                                                            <span>{b.text}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}

                                                            {/* Tổng tiền nhiều hành khách */}
                                                            {opt.price > 0 && totalPassengers > 1 && isSelected && (
                                                                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center text-xs text-blue-700 font-bold">
                                                                    <span>{formatMoneyVND(opt.price)} × {totalPassengers} hành khách</span>
                                                                    <span className="text-blue-600">= {formatMoneyVND(opt.price * totalPassengers)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <p className="mt-4 text-xs text-slate-400 font-medium text-center">
                                        📄 Bảo hiểm có hiệu lực từ khi xuất vé đến khi hoàn thành hành trình. Điều khoản áp dụng theo quy định của công ty bảo hiểm.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* --- CỘT PHẢI: THÔNG TIN ĐẶT CHỖ --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-[100px]">
                        <div className="bg-sky-600 text-white p-4 flex justify-between items-center">
                            <h3 className="font-bold uppercase tracking-wider text-sm">Thông tin đặt chỗ</h3>
                            <button className="bg-white text-sky-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-sky-50 transition-colors">Chi Tiết</button>
                        </div>

                        <div className="p-0">
                            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50">
                                <span className="font-bold text-slate-700">Thông tin hành khách</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                            </div>

                            <div className="px-5 py-3 bg-sky-50/50 border-b border-sky-100 flex justify-between items-center">
                                <span className="font-medium text-slate-600">Chuyến đi</span>
                                <div className="flex items-center gap-2 text-sky-600 font-black">
                                    {formatMoneyVND(finalTotal)}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 cursor-pointer hover:text-sky-800"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                                </div>
                            </div>

                            <div className="px-5 py-4 border-b border-slate-100 text-sm">
                                <p className="font-bold text-slate-800 mb-1">
                                    {flight.maSanBayDi?.thanhPho || flight.origin} ({flight.maSanBayDi?.maIATA || 'SGN'}) ✈ {flight.maSanBayDen?.thanhPho || flight.destination} ({flight.maSanBayDen?.maIATA || 'VCL'})
                                </p>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {formatDateShort(flight.ngayGioKhoiHanh || flight.departureTime)} | {formatTimeOnly(flight.ngayGioKhoiHanh || flight.departureTime)} - {formatTimeOnly(flight.ngayGioHaCanh || flight.arrivalTime)}<br />
                                    Chuyến bay {flight.flightNumber || flight.maChuyenBay} | Hạng vé {ticketClass === 'BUSINESS' ? 'Thương gia' : 'Phổ thông'}
                                </p>
                            </div>

                            {/* Bảng giá chi tiết */}
                            <div className="px-5 py-3 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <span className="font-bold text-slate-700">Giá vé</span>
                                <span className="font-black text-slate-800">{formatMoneyVND(totalTicketPrice)}</span>
                            </div>
                            <div className="px-5 py-3 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <span className="font-bold text-slate-700">Phí, thuế</span>
                                <span className="font-black text-slate-800">{formatMoneyVND(taxesAndFees)}</span>
                            </div>

                            {/* Hành lý (hiển thị nếu đã chọn) */}
                            {baggageTotal > 0 && (
                                <div className="px-5 py-3 flex justify-between items-center border-b border-slate-100 bg-amber-50">
                                    <span className="font-bold text-amber-700 flex items-center gap-1.5">
                                        <span>🧳</span> Hành lý ({baggageOption?.label})
                                    </span>
                                    <span className="font-black text-amber-700">+{formatMoneyVND(baggageTotal)}</span>
                                </div>
                            )}

                            {/* Bảo hiểm (hiển thị nếu đã chọn) */}
                            {insuranceTotal > 0 && (
                                <div className="px-5 py-3 flex justify-between items-center border-b border-slate-100 bg-blue-50">
                                    <span className="font-bold text-blue-600 flex items-center gap-1.5">
                                        <span>🛡️</span> {insuranceOption?.label}
                                    </span>
                                    <span className="font-black text-blue-600">+{formatMoneyVND(insuranceTotal)}</span>
                                </div>
                            )}

                            {/* Tổng cộng */}
                            <div className="px-5 py-4 flex justify-between items-center bg-sky-600 text-white mt-2">
                                <span className="font-bold text-sky-100 uppercase text-xs tracking-wider">Tổng cộng</span>
                                <span className="font-black text-xl">{formatMoneyVND(finalTotal)}</span>
                            </div>

                            {/* Nút Đi tiếp trong Sidebar */}
                            <div className="p-5">
                                <button
                                    onClick={() => navigate('/orders', {
                                        state: {
                                            flight, pax, selectedSeats,
                                            selectedBaggage: baggageOption,
                                            selectedInsurance: insuranceOption,
                                            totalPrice: finalTotal,
                                        }
                                    })}
                                    disabled={selectedSeats.length !== totalPassengers}
                                    className="w-full py-3 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedSeats.length === totalPassengers ? 'Đi tiếp' : `Chọn thêm ${totalPassengers - selectedSeats.length} ghế`}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-full mt-2 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BOTTOM BAR REMOVED --- */}


            </div>
            <Footer />
        </div>
    );
}
