import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const formatMoneyVND = (value) => {
    if (value == null || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const formatDateTime = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
};

const SEAT_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TOTAL_ROWS = 20;

export default function FlightDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const flight = state?.flight;
    const initialTotal = state?.totalPassengers || 1;
    const [pax, setPax] = useState(state?.pax || { adult: initialTotal, child: 0, infant: 0 });
    const totalPassengers = pax.adult + pax.child + pax.infant;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    useEffect(() => {
        if (!flight) {
            navigate('/flight');
            return;
        }

        // Generate some random occupied seats based on flight id
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
                // ~30% chance occupied
                if (seedRandom(seed++) < 0.3) {
                    occupied.push(`${r}${c}`);
                }
            }
        }
        setOccupiedSeats(occupied);
    }, [flight, navigate]);

    if (!flight) return null;

    const toggleSeat = (seatId) => {
        if (occupiedSeats.includes(seatId)) return;
        
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(s => s !== seatId);
            }
            if (prev.length >= totalPassengers) {
                // Tự động thêm một người lớn (nếu chọn dư ghế)
                setPax(p => ({ ...p, adult: p.adult + 1 }));
            }
            return [...prev, seatId];
        });
    };

    const totalPrice = flight.price * selectedSeats.length;

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar transparent={false} />
            <div className="mx-auto grid w-[min(1200px,95vw)] gap-6 pb-14 pt-[100px] lg:grid-cols-[1fr_340px]">
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-black text-slate-900">Chọn ghế ngồi</h2>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Chuyến bay <b>{flight.flightNumber}</b> · {flight.origin} ✈ {flight.destination}
                        </p>
                    </div>

                    <div className="mb-6 flex flex-wrap justify-center gap-4 border-b border-slate-100 pb-5 text-xs font-bold text-slate-500">
                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-slate-300 bg-white" /> Trống</span>
                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-blue-600 bg-blue-500" /> Đang chọn</span>
                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded border-2 border-slate-200 bg-slate-100" /> Đã đặt</span>
                    </div>

                    <div className="mx-auto w-max rounded-[50px] border-8 border-slate-200 bg-white px-6 py-8">
                        {Array.from({ length: TOTAL_ROWS }).map((_, rIdx) => {
                            const rowNum = rIdx + 1;
                            const leftSeats = SEAT_COLS.slice(0, 3);
                            const rightSeats = SEAT_COLS.slice(3, 6);
                            const renderSeat = (c) => {
                                const seatId = `${rowNum}${c}`;
                                const isOccupied = occupiedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);
                                const base = 'h-9 w-9 rounded-lg border-2 text-xs font-black';
                                const cls = isOccupied ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : isSelected ? 'border-blue-700 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-blue-500 hover:bg-blue-50';
                                return (
                                    <button key={seatId} type="button" onClick={() => toggleSeat(seatId)} disabled={isOccupied} title={seatId} className={`${base} ${cls}`}>
                                        {isOccupied ? '×' : (isSelected ? c : '')}
                                    </button>
                                );
                            };
                            return (
                                <div key={rowNum} className="mb-2 flex items-center justify-center gap-4">
                                    <div className="flex gap-2">{leftSeats.map(renderSeat)}</div>
                                    <span className="w-6 text-center text-xs font-black text-slate-400">{rowNum}</span>
                                    <div className="flex gap-2">{rightSeats.map(renderSeat)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-[100px]">
                    <h3 className="text-xl font-black text-slate-900">Thông tin đặt vé</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Kiểm tra lại chuyến bay và ghế bạn đã chọn</p>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="mb-3 text-sm font-black text-slate-900">Số lượng hành khách</p>
                        {[
                            { key: 'adult', label: 'Người lớn', desc: 'Từ 12 tuổi' },
                            { key: 'child', label: 'Trẻ em', desc: 'Từ 2 - 11 tuổi' },
                            { key: 'infant', label: 'Em bé', desc: 'Dưới 2 tuổi' },
                        ].map((type) => (
                            <div key={type.key} className="mb-2.5 flex items-center justify-between last:mb-0">
                                <div>
                                    <p className="text-xs font-black text-slate-600">{type.label}</p>
                                    <p className="text-[11px] font-semibold text-slate-400">{type.desc}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setPax((p) => ({ ...p, [type.key]: Math.max(type.key === 'adult' ? 1 : 0, p[type.key] - 1) }))} className="h-6 w-6 rounded-full border border-slate-300 text-sm font-black">-</button>
                                    <span className="w-4 text-center text-sm font-black">{pax[type.key]}</span>
                                    <button type="button" onClick={() => setPax((p) => ({ ...p, [type.key]: p[type.key] + 1 }))} className="h-6 w-6 rounded-full border border-slate-300 text-sm font-black">+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                        <div className="mb-2 flex justify-between"><span className="text-slate-500">Chuyến bay</span><span className="text-right font-black text-slate-800">{flight.flightNumber} ({flight.airline})</span></div>
                        <div className="mb-2 flex justify-between"><span className="text-slate-500">Khởi hành</span><span className="font-black text-slate-800">{flight.origin}</span></div>
                        <div className="mb-2 flex justify-between"><span className="text-slate-500">Thời gian</span><span className="text-right font-black text-slate-800">{formatDateTime(flight.departureTime)}</span></div>
                        <div className="mb-2 flex justify-between"><span className="text-slate-500">Đến</span><span className="font-black text-slate-800">{flight.destination}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Số lượng</span><span className="font-black text-slate-800">{totalPassengers} hành khách</span></div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-black text-slate-900">Ghế đã chọn</span>
                            <span className="font-semibold text-slate-500">{selectedSeats.length}/{totalPassengers}</span>
                        </div>
                        <div className="mt-2 flex min-h-8 flex-wrap gap-2">
                            {selectedSeats.length === 0 ? (
                                <span className="text-xs italic font-semibold text-slate-400">Vui lòng chọn ghế trên biểu đồ</span>
                            ) : (
                                selectedSeats.map((s) => <span key={s} className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-black text-blue-700">{s}</span>)
                            )}
                        </div>
                    </div>

                    <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-black text-slate-900">Tổng tiền</span>
                            <span className="text-2xl font-black text-blue-700">{formatMoneyVND(totalPrice)}</span>
                        </div>
                    </div>

                    <button
                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-sm font-black text-white disabled:bg-slate-300"
                        disabled={selectedSeats.length !== totalPassengers}
                        onClick={() => navigate('/orders', { state: { flight, pax, selectedSeats, totalPrice } })}
                    >
                        Tiếp tục đến thanh toán
                    </button>
                    {selectedSeats.length < totalPassengers && (
                        <p className="mt-2 text-center text-xs font-bold text-red-500">Hãy chọn đủ {totalPassengers} ghế để tiếp tục.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
