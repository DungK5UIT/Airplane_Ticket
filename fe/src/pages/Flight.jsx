import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

const generateDummyFlights = () => {
    const today = new Date();
    const future = (days, hours) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        d.setHours(d.getHours() + hours);
        return d.toISOString();
    };

    return [
        {
            id: 'DUMMY1',
            flightNumber: 'VJ123',
            origin: 'Hà Nội',
            destination: 'TP. HCM',
            departureTime: future(1, 2),
            arrivalTime: future(1, 4),
            availableSeats: 50,
            airline: 'VietJet Air',
            price: 1500000
        },
        {
            id: 'DUMMY2',
            flightNumber: 'VN456',
            origin: 'Đà Nẵng',
            destination: 'Hà Nội',
            departureTime: future(2, 5),
            arrivalTime: future(2, 6.5),
            availableSeats: 30,
            airline: 'Vietnam Airlines',
            price: 2500000
        },
        {
            id: 'DUMMY3',
            flightNumber: 'QH789',
            origin: 'TP. HCM',
            destination: 'Hải Phòng',
            departureTime: future(3, 3),
            arrivalTime: future(3, 5),
            availableSeats: 15,
            airline: 'Bamboo Airways',
            price: 1800000
        },
        {
            id: 'DUMMY4',
            flightNumber: 'VJ321',
            origin: 'Hà Nội',
            destination: 'Phú Quốc',
            departureTime: future(4, 1),
            arrivalTime: future(4, 3),
            availableSeats: 25,
            airline: 'VietJet Air',
            price: 3200000
        },
        {
            id: 'DUMMY5',
            flightNumber: 'VN999',
            origin: 'Nha Trang',
            destination: 'TP. HCM',
            departureTime: future(5, 4),
            arrivalTime: future(5, 5),
            availableSeats: 10,
            airline: 'Vietnam Airlines',
            price: 1200000
        },
        {
            id: 'DUMMY6',
            flightNumber: 'BL111',
            origin: 'Hải Phòng',
            destination: 'Đà Nẵng',
            departureTime: future(6, 2),
            arrivalTime: future(6, 3.5),
            availableSeats: 40,
            airline: 'Pacific Airlines',
            price: 900000
        },
        {
            id: 'DUMMY7',
            flightNumber: 'VU222',
            origin: 'Đà Lạt',
            destination: 'Hà Nội',
            departureTime: future(7, 1),
            arrivalTime: future(7, 3),
            availableSeats: 20,
            airline: 'Vietravel Airlines',
            price: 2100000
        },
        {
            id: 'DUMMY8',
            flightNumber: 'VN333',
            origin: 'TP. HCM',
            destination: 'Đà Nẵng',
            departureTime: future(1, 6),
            arrivalTime: future(1, 7.5),
            availableSeats: 55,
            airline: 'Vietnam Airlines',
            price: 1350000
        }
    ];
};

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

const normalize = (s) => (s || '').toString().trim();

const Flight = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [flights, setFlights] = useState([]);

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [pax, setPax] = useState({ adult: 1, child: 0, infant: 0 });
    const [paxOpen, setPaxOpen] = useState(false);
    const paxRef = useRef(null);

    const [searching, setSearching] = useState(false);
    const totalPassengers = pax.adult + pax.child + pax.infant;

    useEffect(() => {
        const onDown = (e) => {
            if (!paxOpen) return;
            if (!paxRef.current) return;
            if (!paxRef.current.contains(e.target)) setPaxOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [paxOpen]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await authService.getAllFlights();
                if (!cancelled) {
                    if (Array.isArray(data) && data.length > 0) {
                        setFlights(data);
                    } else {
                        setFlights(generateDummyFlights());
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    console.error('Lỗi tải danh sách chuyến bay, sử dụng dữ liệu mẫu.');
                    setFlights(generateDummyFlights());
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        run();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredClientSide = useMemo(() => {
        const o = normalize(origin).toLowerCase();
        const d = normalize(destination).toLowerCase();
        const day = normalize(date);

        return (flights || []).filter((f) => {
            const fo = normalize(f.origin).toLowerCase();
            const fd = normalize(f.destination).toLowerCase();

            const matchOD = (!o || fo.includes(o)) && (!d || fd.includes(d));
            if (!matchOD) return false;

            if (!day) return true;
            const depart = f.departureTime ? new Date(f.departureTime) : null;
            if (!depart || Number.isNaN(depart.getTime())) return true;
            const yyyy = depart.getFullYear();
            const mm = String(depart.getMonth() + 1).padStart(2, '0');
            const dd = String(depart.getDate()).padStart(2, '0');
            const departDay = `${yyyy}-${mm}-${dd}`;
            return departDay === day;
        });
    }, [flights, origin, destination, date]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        const o = normalize(origin);
        const d = normalize(destination);

        // Nếu có API search thì ưu tiên gọi, không thì filter client-side.
        if (!o && !d) return;

        setSearching(true);
        try {
            const data = await authService.searchFlights(o, d);
            if (Array.isArray(data) && data.length > 0) {
                setFlights(data);
            } else {
                const dummies = generateDummyFlights().filter(f => 
                  (!o || f.origin.toLowerCase().includes(o.toLowerCase())) &&
                  (!d || f.destination.toLowerCase().includes(d.toLowerCase()))
                );
                setFlights(dummies);
            }
        } catch (e2) {
            setError('Tìm kiếm thất bại. Đang hiển thị kết quả do hệ thống tự lọc theo dữ liệu mẫu.');
            const dummies = generateDummyFlights().filter(f => 
                (!o || f.origin.toLowerCase().includes(o.toLowerCase())) &&
                (!d || f.destination.toLowerCase().includes(d.toLowerCase()))
            );
            setFlights(dummies);
        } finally {
            setSearching(false);
        }
    };

    const clearFilters = () => {
        setOrigin('');
        setDestination('');
        setDate('');
        setPax({ adult: 1, child: 0, infant: 0 });
    };

    const list = filteredClientSide;

    return (
        <div style={{ minHeight: '100vh', background: '#f6f8fc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Navbar transparent={false} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .fl-page {
                    width: min(1100px, 92vw);
                    margin: 0 auto;
                    padding: 100px 0 56px;
                }
                .fl-hero {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr;
                    gap: 22px;
                    align-items: stretch;
                    margin-bottom: 18px;
                }
                .fl-title {
                    font-size: 30px;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    margin: 0 0 8px;
                }
                .fl-sub {
                    margin: 0;
                    font-size: 14.5px;
                    font-weight: 600;
                    color: #64748b;
                    line-height: 1.65;
                    max-width: 62ch;
                }
                .fl-card {
                    background: #fff;
                    border: 1.5px solid #e6eaf2;
                    border-radius: 18px;
                    box-shadow: 0 18px 60px -28px rgba(2,6,23,0.28);
                }
                .fl-search {
                    padding: 18px;
                }
                .fl-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 1.1fr 0.9fr 0.9fr;
                    gap: 12px;
                    margin-top: 14px;
                }
                .fl-field label {
                    display: block;
                    font-size: 12px;
                    font-weight: 800;
                    color: #475569;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 7px;
                }
                .fl-field input {
                    width: 100%;
                    height: 46px;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 0 14px;
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                    transition: box-shadow .18s, border-color .18s;
                    background: #fff;
                    color: #0f172a;
                }
                .fl-field input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
                }

                .fl-pax-btn {
                    width: 100%;
                    height: 46px;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 0 14px;
                    font-size: 14px;
                    font-weight: 800;
                    outline: none;
                    background: #fff;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    cursor: pointer;
                    transition: box-shadow .18s, border-color .18s, background .18s;
                }
                .fl-pax-btn:hover { background: #fbfdff; }
                .fl-pax-btn:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
                }
                .fl-pax-muted { font-weight: 700; color: #64748b; }
                .fl-pax-pop {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 340px;
                    max-width: min(340px, 92vw);
                    background: #fff;
                    border: 1.5px solid #e6eaf2;
                    border-radius: 16px;
                    box-shadow: 0 22px 64px -40px rgba(2,6,23,0.35);
                    padding: 12px;
                    z-index: 30;
                }
                .fl-pax-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding: 8px 8px 10px;
                    border-bottom: 1px solid #f1f5f9;
                    margin-bottom: 8px;
                }
                .fl-pax-head-title {
                    font-size: 12.5px;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: 0.02em;
                }
                .fl-pax-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 12px 10px;
                    border-radius: 12px;
                }
                .fl-pax-row:hover { background: #f8fafc; }
                .fl-pax-left { display: grid; gap: 2px; }
                .fl-pax-name { font-size: 14px; font-weight: 900; color: #0f172a; }
                .fl-pax-desc { font-size: 12px; font-weight: 700; color: #94a3b8; }
                .fl-pax-ctrl { display: flex; align-items: center; gap: 12px; }
                .fl-step-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 999px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    color: #0f172a;
                    cursor: pointer;
                    transition: background .15s, border-color .15s, transform .12s;
                }
                .fl-step-btn:hover:not(:disabled) { background: #f8fafc; transform: translateY(-1px); }
                .fl-step-btn:disabled { opacity: 0.45; cursor: not-allowed; }
                .fl-pax-num { width: 26px; text-align: center; font-weight: 900; color: #ef4444; }
                .fl-pax-foot {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                    padding: 10px 8px 6px;
                    border-top: 1px solid #f1f5f9;
                    margin-top: 8px;
                }
                .fl-pax-note {
                    font-size: 12px;
                    font-weight: 700;
                    color: #94a3b8;
                    line-height: 1.5;
                }
                .fl-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    margin-top: 14px;
                    flex-wrap: wrap;
                }
                .fl-btn {
                    height: 46px;
                    border-radius: 14px;
                    padding: 0 16px;
                    border: 1px solid transparent;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: transform .12s, box-shadow .18s, background .18s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .fl-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .fl-btn-primary {
                    background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
                    color: #fff;
                    box-shadow: 0 10px 30px -18px rgba(37,99,235,0.6);
                }
                .fl-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 14px 38px -18px rgba(14,165,233,0.55); }
                .fl-btn-ghost {
                    background: #fff;
                    border-color: #e5e7eb;
                    color: #0f172a;
                }
                .fl-btn-ghost:hover:not(:disabled) { background: #f8fafc; }

                .fl-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 14px 18px 0;
                }
                .fl-count {
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                }
                .fl-hint {
                    font-size: 12px;
                    font-weight: 700;
                    color: #94a3b8;
                }

                .fl-list {
                    padding: 14px 18px 18px;
                    display: grid;
                    gap: 12px;
                }
                .fl-item {
                    border: 1.5px solid #e6eaf2;
                    border-radius: 16px;
                    padding: 14px 14px;
                    display: grid;
                    grid-template-columns: 1.2fr 1.1fr 0.7fr;
                    gap: 12px;
                    align-items: center;
                    transition: transform .12s, box-shadow .18s, border-color .18s;
                    background: #fff;
                }
                .fl-item:hover {
                    border-color: #cfe1ff;
                    box-shadow: 0 14px 40px -26px rgba(2,6,23,0.28);
                    transform: translateY(-1px);
                }
                .fl-route {
                    font-size: 15px;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 4px;
                    letter-spacing: -0.01em;
                }
                .fl-small {
                    font-size: 12.5px;
                    font-weight: 700;
                    color: #64748b;
                    margin: 0;
                    line-height: 1.55;
                }
                .fl-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 900;
                    color: #0f172a;
                    background: #f1f5ff;
                    border: 1px solid #dbeafe;
                    width: fit-content;
                }
                .fl-price {
                    font-size: 16px;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 4px;
                }
                .fl-buy {
                    justify-self: end;
                    min-width: 140px;
                }
                .fl-empty, .fl-error {
                    padding: 14px 18px 18px;
                    font-size: 14px;
                    font-weight: 700;
                    color: #475569;
                }
                .fl-error {
                    color: #b91c1c;
                }

                @media (max-width: 920px) {
                    .fl-hero { grid-template-columns: 1fr; }
                    .fl-grid { grid-template-columns: 1fr 1fr; }
                    .fl-item { grid-template-columns: 1fr; }
                    .fl-buy { justify-self: start; width: 100%; }
                    .fl-pax-pop { right: 0; width: 100%; max-width: 100%; }
                }
                @media (max-width: 520px) {
                    .fl-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="fl-page">
                <div className="fl-hero">
                    <div className="fl-card fl-search">
                        <h1 className="fl-title">Chuyến bay</h1>
                        <p className="fl-sub">
                            Tìm chuyến bay theo điểm đi, điểm đến và ngày bay. Danh sách sẽ tự lọc theo thông tin bạn nhập.
                        </p>

                        <form onSubmit={handleSearch}>
                            <div className="fl-grid">
                                <div className="fl-field">
                                    <label>Điểm đi</label>
                                    <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="VD: Hà Nội" />
                                </div>
                                <div className="fl-field">
                                    <label>Điểm đến</label>
                                    <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="VD: TP. HCM" />
                                </div>
                                <div className="fl-field">
                                    <label>Ngày bay</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="fl-field" style={{ position: 'relative' }} ref={paxRef}>
                                    <label>Hành khách</label>
                                    <button
                                        type="button"
                                        className="fl-pax-btn"
                                        onClick={() => setPaxOpen((v) => !v)}
                                        aria-haspopup="dialog"
                                        aria-expanded={paxOpen}
                                    >
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11a4 4 0 100-8 4 4 0 000 8z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 00-3-3.87" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
                                            </svg>
                                            <span>
                                                {totalPassengers} <span className="fl-pax-muted">hành khách</span>
                                            </span>
                                        </span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ opacity: 0.7 }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>

                                    {paxOpen && (
                                        <div className="fl-pax-pop" role="dialog" aria-label="Chọn hành khách">
                                            <div className="fl-pax-head">
                                                <div className="fl-pax-head-title">Yêu cầu trợ giúp đặc biệt</div>
                                                <button
                                                    type="button"
                                                    className="fl-step-btn"
                                                    onClick={() => setPaxOpen(false)}
                                                    aria-label="Đóng"
                                                    style={{ width: 30, height: 30 }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            {[
                                                { key: 'adult', name: 'Người lớn', desc: '12 tuổi trở lên', min: 1 },
                                                { key: 'child', name: 'Trẻ em', desc: '2–11 tuổi', min: 0 },
                                                { key: 'infant', name: 'Em bé', desc: 'Dưới 2 tuổi', min: 0 }
                                            ].map((row) => {
                                                const value = pax[row.key];
                                                const canDec = value > row.min;
                                                const canIncTotal = totalPassengers < 20;
                                                const canIncInfant = row.key !== 'infant' || pax.infant < pax.adult;
                                                const canInc = canIncTotal && canIncInfant;

                                                return (
                                                    <div className="fl-pax-row" key={row.key}>
                                                        <div className="fl-pax-left">
                                                            <div className="fl-pax-name">{row.name}</div>
                                                            <div className="fl-pax-desc">{row.desc}</div>
                                                        </div>
                                                        <div className="fl-pax-ctrl">
                                                            <button
                                                                type="button"
                                                                className="fl-step-btn"
                                                                disabled={!canDec}
                                                                onClick={() => {
                                                                    setPax((prev) => {
                                                                        const next = { ...prev, [row.key]: prev[row.key] - 1 };
                                                                        if (next.adult < 1) next.adult = 1;
                                                                        if (next.infant > next.adult) next.infant = next.adult;
                                                                        return next;
                                                                    });
                                                                }}
                                                                aria-label={`Giảm ${row.name}`}
                                                            >
                                                                −
                                                            </button>
                                                            <div className="fl-pax-num">{value}</div>
                                                            <button
                                                                type="button"
                                                                className="fl-step-btn"
                                                                disabled={!canInc}
                                                                onClick={() => setPax((prev) => ({ ...prev, [row.key]: prev[row.key] + 1 }))}
                                                                aria-label={`Tăng ${row.name}`}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <div className="fl-pax-foot">
                                                <div className="fl-pax-note">
                                                    Tối đa 20 hành khách. Em bé không vượt quá số người lớn.
                                                </div>
                                                <button type="button" className="fl-btn fl-btn-primary" onClick={() => setPaxOpen(false)} style={{ height: 40 }}>
                                                    Xong
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="fl-actions">
                                <button className="fl-btn fl-btn-primary" type="submit" disabled={loading || searching}>
                                    {searching ? 'Đang tìm...' : 'Tìm chuyến bay'}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <button className="fl-btn fl-btn-ghost" type="button" onClick={clearFilters} disabled={loading || searching}>
                                    Xóa bộ lọc
                                </button>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span className="fl-hint">Gợi ý: nhập “Hà Nội”, “Đà Nẵng”, “HCM”...</span>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="fl-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div className="fl-pill">
                                <span>✈</span> Tìm nhanh
                            </div>
                            <p style={{ margin: '10px 0 0', fontSize: 14.5, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                                Lọc theo thời gian thực
                            </p>
                            <p style={{ margin: '6px 0 0', fontSize: 13, fontWeight: 700, color: '#64748b', lineHeight: 1.65 }}>
                                Không cần bấm tìm, danh sách tự cập nhật theo điểm đi/đến và ngày bay bạn chọn.
                            </p>
                        </div>

                        <div style={{ marginTop: 18, borderTop: '1px solid #eef2ff', paddingTop: 14, display: 'grid', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b' }}>Hành khách</span>
                                <span style={{ fontSize: 12.5, fontWeight: 900, color: '#0f172a' }}>{totalPassengers}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <span style={{ fontSize: 12.5, fontWeight: 800, color: '#64748b' }}>Bộ lọc</span>
                                <span style={{ fontSize: 12.5, fontWeight: 900, color: '#0f172a' }}>
                                    {(origin || destination || date) ? 'Đang áp dụng' : 'Chưa có'}
                                </span>
                            </div>
                            <button
                                className="fl-btn fl-btn-ghost"
                                type="button"
                                onClick={() => navigate('/')}
                                style={{ width: '100%' }}
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>

                <div className="fl-card">
                    <div className="fl-meta">
                        <div className="fl-count">
                            {loading ? 'Đang tải...' : `Có ${list.length} chuyến bay phù hợp`}
                        </div>
                        <div className="fl-hint">Giá hiển thị có thể thay đổi theo thời điểm</div>
                    </div>

                    {error && <div className="fl-error">{error}</div>}

                    {loading ? (
                        <div className="fl-empty">Đang tải danh sách chuyến bay...</div>
                    ) : list.length === 0 ? (
                        <div className="fl-empty">
                            Không tìm thấy chuyến bay phù hợp. Thử đổi điểm đi/đến hoặc bỏ chọn ngày bay nhé.
                        </div>
                    ) : (
                        <div className="fl-list">
                            {list.map((f) => (
                                <div key={f.id ?? `${f.flightNumber}-${f.departureTime}`} className="fl-item">
                                    <div>
                                        <p className="fl-route">
                                            {normalize(f.origin) || '—'} → {normalize(f.destination) || '—'}
                                        </p>
                                        <p className="fl-small">
                                            <span style={{ fontWeight: 900, color: '#0f172a' }}>{f.flightNumber || 'Chuyến bay'}</span>
                                            {' · '}
                                            Khởi hành: {formatDateTime(f.departureTime)}
                                            {' · '}
                                            Đến: {formatDateTime(f.arrivalTime)}
                                        </p>
                                        <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                            <span className="fl-pill">Ghế trống: {f.availableSeats ?? '—'}</span>
                                            {f.airline && <span className="fl-pill">{f.airline}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="fl-price">{formatMoneyVND(f.price)}</p>
                                        <p className="fl-small">/ người · {totalPassengers} hành khách</p>
                                    </div>

                                    <button
                                        type="button"
                                        className="fl-btn fl-btn-primary fl-buy"
                                        onClick={() => navigate('/flight-detail', { state: { flight: f, totalPassengers, pax } })}
                                    >
                                        Chọn chuyến
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Flight;
