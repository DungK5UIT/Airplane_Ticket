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
        <div style={{ minHeight: '100vh', background: '#f6f8fc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Navbar transparent={false} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .fd-page {
                    width: min(1200px, 95vw);
                    margin: 0 auto;
                    padding: 30px 0 56px;
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 24px;
                    align-items: start;
                }

                .fd-card {
                    background: #fff;
                    border: 1.5px solid #e6eaf2;
                    border-radius: 20px;
                    box-shadow: 0 18px 40px -20px rgba(2,6,23,0.08);
                    padding: 24px;
                }

                .fd-title {
                    font-size: 24px;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 8px;
                    letter-spacing: -0.02em;
                }

                .fd-subtitle {
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #64748b;
                    margin: 0 0 24px;
                }

                .airplane-body {
                    background: #fdfdfd;
                    border: 10px solid #e2e8f0;
                    border-radius: 120px 120px 40px 40px;
                    padding: 50px 30px 40px;
                    width: max-content;
                    margin: 0 auto;
                    position: relative;
                }
                
                .airplane-head {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 140px;
                    height: 80px;
                    background: #e2e8f0;
                    border-radius: 140px 140px 0 0;
                    z-index: 1;
                }

                .airplane-tail {
                    position: absolute;
                    bottom: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 120px;
                    height: 40px;
                    background: #e2e8f0;
                    border-radius: 0 0 40px 40px;
                    z-index: 1;
                }

                .seat-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                    gap: 20px;
                }

                .seat-group {
                    display: flex;
                    gap: 10px;
                }

                .seat-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                
                .seat-number {
                    font-size: 10px;
                    font-weight: 800;
                    color: #94a3b8;
                }

                .seat {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px 10px 4px 4px;
                    background: #fff;
                    border: 2px solid #cbd5e1;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 800;
                    color: #475569;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .seat::after {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 24px;
                    height: 4px;
                    background: #cbd5e1;
                    border-radius: 4px 4px 0 0;
                    transition: all 0.2s;
                }

                .seat.available:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                    color: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
                }
                .seat.available:hover::after { background: #3b82f6; }

                .seat.selected {
                    background: #3b82f6;
                    border-color: #2563eb;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                .seat.selected::after { background: #2563eb; }

                .seat.occupied {
                    background: #f1f5f9;
                    border-color: #e2e8f0;
                    color: transparent;
                    cursor: not-allowed;
                }
                .seat.occupied::after { background: #e2e8f0; }
                .seat.occupied::before {
                    content: '✕';
                    position: absolute;
                    color: #94a3b8;
                    font-size: 16px;
                }

                .row-number {
                    width: 24px;
                    text-align: center;
                    font-size: 14px;
                    font-weight: 900;
                    color: #94a3b8;
                }

                .legend {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 24px;
                    margin-bottom: 30px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13.5px;
                    font-weight: 700;
                    color: #64748b;
                }

                .legend-box {
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                }
                .legend-box.available { border: 2px solid #cbd5e1; background: #fff; }
                .legend-box.selected { border: 2px solid #2563eb; background: #3b82f6; }
                .legend-box.occupied { border: 2px solid #e2e8f0; background: #f1f5f9; position: relative; }
                .legend-box.occupied::before { 
                    content: '✕'; position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
                    display: flex; align-items: center; justify-content: center; 
                    color: #94a3b8; font-size: 10px; font-weight: 900;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #475569;
                }
                .info-val {
                    font-weight: 800;
                    color: #0f172a;
                    text-align: right;
                }

                .btn-submit {
                    width: 100%;
                    height: 50px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
                    color: white;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    margin-top: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-submit:disabled {
                    background: #cbd5e1;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px -10px rgba(37, 99, 235, 0.5);
                }

                .selected-seat-chip {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 13px;
                    font-weight: 800;
                    padding: 6px 10px;
                    border-radius: 8px;
                    border: 1px solid #bfdbfe;
                }

                @media (max-width: 992px) {
                    .fd-page {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            
            <div style={{ height: 100 }}></div>

            <div className="fd-page">
                <div className="fd-card" style={{ padding: '32px 24px', overflowX: 'auto' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="fd-title">Chọn ghế ngồi</h2>
                        <p className="fd-subtitle">
                            Chuyến bay <b>{flight.flightNumber}</b> • {flight.origin} ✈ {flight.destination}
                        </p>
                    </div>

                    <div className="legend">
                        <div className="legend-item">
                            <div className="legend-box available"></div> Trống
                        </div>
                        <div className="legend-item">
                            <div className="legend-box selected"></div> Đang chọn
                        </div>
                        <div className="legend-item">
                            <div className="legend-box occupied"></div> Đã đặt
                        </div>
                    </div>

                    <div className="airplane-body">
                        <div className="airplane-head"></div>
                        <div className="airplane-tail"></div>
                        
                        {Array.from({ length: TOTAL_ROWS }).map((_, rIdx) => {
                            const rowNum = rIdx + 1;
                            const leftSeats = SEAT_COLS.slice(0, 3);
                            const rightSeats = SEAT_COLS.slice(3, 6);

                            const renderSeat = (c) => {
                                const seatId = `${rowNum}${c}`;
                                const isOccupied = occupiedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);
                                const statusClass = isOccupied ? 'occupied' : isSelected ? 'selected' : 'available';

                                return (
                                    <div className="seat-wrapper" key={seatId}>
                                        {rowNum === 1 && <span className="seat-number">{c}</span>}
                                        <div 
                                            className={`seat ${statusClass}`}
                                            onClick={() => toggleSeat(seatId)}
                                            title={isOccupied ? 'Ghế đã được đặt' : `Ghế ${seatId}`}
                                        >
                                            {(!isOccupied && isSelected) ? c : ''}
                                        </div>
                                    </div>
                                );
                            };

                            return (
                                <div className="seat-row" key={rowNum}>
                                    <div className="seat-group">
                                        {leftSeats.map(renderSeat)}
                                    </div>
                                    
                                    <div className="row-number">{rowNum}</div>
                                    
                                    <div className="seat-group">
                                        {rightSeats.map(renderSeat)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="fd-card" style={{ position: 'sticky', top: 100 }}>
                    <h3 className="fd-title" style={{ fontSize: 20 }}>Thông tin đặt vé</h3>
                    <p className="fd-subtitle" style={{ margin: '0 0 20px', fontSize: 13 }}>
                        Kiểm tra lại chuyến bay và ghế bạn đã chọn
                    </p>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20 }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 12, fontSize: 14 }}>Số lượng hành khách</div>
                        {[
                            { key: 'adult', label: 'Người lớn', desc: 'Từ 12 tuổi' },
                            { key: 'child', label: 'Trẻ em', desc: 'Từ 2 - 11 tuổi' },
                            { key: 'infant', label: 'Em bé', desc: 'Dưới 2 tuổi' }
                        ].map(type => (
                            <div key={type.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#475569' }}>{type.label}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{type.desc}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setPax(p => ({ ...p, [type.key]: Math.max(type.key==='adult'?1:0, p[type.key] - 1) }))}
                                        style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 900, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >−</button>
                                    <span style={{ fontSize: 14, fontWeight: 800, width: 14, textAlign: 'center' }}>{pax[type.key]}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setPax(p => ({ ...p, [type.key]: p[type.key] + 1 }))}
                                        style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 900, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20 }}>
                        <div className="info-row">
                            <span>Chuyến bay</span>
                            <span className="info-val">{flight.flightNumber} ({flight.airline})</span>
                        </div>
                        <div className="info-row">
                            <span>Khởi hành</span>
                            <span className="info-val">{flight.origin}</span>
                        </div>
                        <div className="info-row">
                            <span>Thời gian</span>
                            <span className="info-val">{formatDateTime(flight.departureTime)}</span>
                        </div>
                        <div className="info-row">
                            <span>Đến</span>
                            <span className="info-val">{flight.destination}</span>
                        </div>
                        <div className="info-row" style={{ marginBottom: 0 }}>
                            <span>Số lượng</span>
                            <span className="info-val">{totalPassengers} hành khách</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <div className="info-row" style={{ alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>Ghế đã chọn:</span>
                            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>
                                {selectedSeats.length} / {totalPassengers}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, minHeight: 34 }}>
                            {selectedSeats.length === 0 ? (
                                <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                                    Vui lòng chọn ghế trên biểu đồ
                                </span>
                            ) : (
                                selectedSeats.map(s => <span key={s} className="selected-seat-chip">{s}</span>)
                            )}
                        </div>
                    </div>

                    <div style={{ borderTop: '1.5px dashed #e2e8f0', paddingTop: 20 }}>
                        <div className="info-row" style={{ fontSize: 16, alignItems: 'center' }}>
                            <span style={{ fontWeight: 800 }}>Tổng tiền</span>
                            <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb' }}>
                                {formatMoneyVND(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <button 
                        className="btn-submit" 
                        disabled={selectedSeats.length !== totalPassengers}
                        onClick={() => navigate('/orders', { state: { flight, pax, selectedSeats, totalPrice } })}
                    >
                        Tiếp tục đến thanh toán
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                    </button>
                    {selectedSeats.length < totalPassengers && (
                        <p style={{ textAlign: 'center', fontSize: 12, color: '#ef4444', fontWeight: 700, marginTop: 12 }}>
                            Hãy chọn đủ {totalPassengers} ghế để tiếp tục.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
