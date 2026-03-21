import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/api';

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
    const location = useLocation();
    const routeState = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [flights, setFlights] = useState([]);

    const [origin, setOrigin] = useState(routeState.origin || '');
    const [destination, setDestination] = useState(routeState.destination || '');
    const [date, setDate] = useState(routeState.date || '');
    const [pax, setPax] = useState(routeState.pax || { adult: 1, child: 0, infant: 0 });
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
                    setFlights(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                if (!cancelled) {
                    setError('Không thể tải danh sách chuyến bay từ hệ thống. Vui lòng thử lại.');
                    setFlights([]);
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
            setFlights(Array.isArray(data) ? data : []);
        } catch (e2) {
            setError('Tìm kiếm thất bại. Vui lòng thử lại.');
            setFlights([]);
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
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar transparent={false} />
            <div className="mx-auto w-[min(1100px,92vw)] pb-14 pt-[100px]">
                <div className="mb-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h1 className="text-3xl font-black text-slate-900">Chuyến bay</h1>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Tìm chuyến bay theo điểm đi, điểm đến và ngày bay.
                        </p>

                        <form onSubmit={handleSearch} className="mt-4">
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Điểm đi</label>
                                    <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="VD: Hà Nội" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Điểm đến</label>
                                    <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="VD: TP. HCM" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Ngày bay</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div className="relative" ref={paxRef}>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Hành khách</label>
                                    <button type="button" onClick={() => setPaxOpen((v) => !v)} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                        <span>{totalPassengers} hành khách</span>
                                        <span>▾</span>
                                    </button>

                                    {paxOpen && (
                                        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:w-[340px]">
                                            <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                                                <span className="text-xs font-black uppercase tracking-wide text-slate-500">Yêu cầu trợ giúp</span>
                                                <button type="button" onClick={() => setPaxOpen(false)} className="h-7 w-7 rounded-full border border-slate-200 text-sm">×</button>
                                            </div>
                                            {[
                                                { key: 'adult', name: 'Người lớn', desc: '12 tuổi trở lên', min: 1 },
                                                { key: 'child', name: 'Trẻ em', desc: '2-11 tuổi', min: 0 },
                                                { key: 'infant', name: 'Em bé', desc: 'Dưới 2 tuổi', min: 0 },
                                            ].map((row) => {
                                                const value = pax[row.key];
                                                const canDec = value > row.min;
                                                const canIncTotal = totalPassengers < 20;
                                                const canIncInfant = row.key !== 'infant' || pax.infant < pax.adult;
                                                const canInc = canIncTotal && canIncInfant;
                                                return (
                                                    <div key={row.key} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50">
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{row.name}</p>
                                                            <p className="text-xs font-semibold text-slate-400">{row.desc}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button type="button" disabled={!canDec} onClick={() => setPax((prev) => {
                                                                const next = { ...prev, [row.key]: prev[row.key] - 1 };
                                                                if (next.adult < 1) next.adult = 1;
                                                                if (next.infant > next.adult) next.infant = next.adult;
                                                                return next;
                                                            })} className="h-8 w-8 rounded-full border border-slate-200 font-bold disabled:opacity-40">-</button>
                                                            <span className="w-6 text-center text-sm font-black text-slate-900">{value}</span>
                                                            <button type="button" disabled={!canInc} onClick={() => setPax((prev) => ({ ...prev, [row.key]: prev[row.key] + 1 }))} className="h-8 w-8 rounded-full border border-slate-200 font-bold disabled:opacity-40">+</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="mt-2 border-t border-slate-100 pt-2">
                                                <button type="button" onClick={() => setPaxOpen(false)} className="h-9 w-full rounded-xl bg-blue-700 text-sm font-bold text-white hover:bg-blue-800">Xong</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <button type="submit" disabled={loading || searching} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 text-sm font-black text-white disabled:opacity-70">
                                    {searching ? 'Đang tìm...' : 'Tìm chuyến bay'}
                                </button>
                                <button type="button" onClick={clearFilters} disabled={loading || searching} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">✈ Tìm nhanh</span>
                        <p className="mt-3 text-sm font-black text-slate-900">Lọc theo thời gian thực</p>
                        <p className="mt-2 text-sm font-semibold text-slate-500">Danh sách tự cập nhật theo điểm đi/đến và ngày bay bạn chọn.</p>
                        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-sm">
                            <div className="flex justify-between"><span className="font-semibold text-slate-500">Hành khách</span><span className="font-black text-slate-900">{totalPassengers}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-slate-500">Bộ lọc</span><span className="font-black text-slate-900">{(origin || destination || date) ? 'Đang áp dụng' : 'Chưa có'}</span></div>
                            <button type="button" onClick={() => navigate('/')} className="mt-2 h-10 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50">Về trang chủ</button>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
                        <div className="text-sm font-bold text-slate-600">{loading ? 'Đang tải...' : `Có ${list.length} chuyến bay phù hợp`}</div>
                        <div className="text-xs font-semibold text-slate-400">Giá có thể thay đổi theo thời điểm</div>
                    </div>

                    {error && <div className="px-5 py-3 text-sm font-bold text-red-600">{error}</div>}
                    {loading ? (
                        <div className="px-5 py-4 text-sm font-semibold text-slate-500">Đang tải danh sách chuyến bay...</div>
                    ) : list.length === 0 ? (
                        <div className="px-5 py-4 text-sm font-semibold text-slate-500">Không tìm thấy chuyến bay phù hợp.</div>
                    ) : (
                        <div className="grid gap-3 p-4">
                            {list.map((f) => (
                                <div key={f.id ?? `${f.flightNumber}-${f.departureTime}`} className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200 hover:shadow-sm lg:grid-cols-[1.2fr_1.1fr_0.7fr]">
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{normalize(f.origin) || '—'} → {normalize(f.destination) || '—'}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            <span className="font-black text-slate-800">{f.flightNumber || 'Chuyến bay'}</span>
                                            {' · '}Khởi hành: {formatDateTime(f.departureTime)}
                                            {' · '}Đến: {formatDateTime(f.arrivalTime)}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-black text-slate-800">Ghế trống: {f.availableSeats ?? '—'}</span>
                                            {f.airline && <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-black text-slate-800">{f.airline}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900">{formatMoneyVND(f.price)}</p>
                                        <p className="text-xs font-semibold text-slate-500">/ người · {totalPassengers} hành khách</p>
                                    </div>
                                    <button type="button" onClick={() => navigate('/flight-detail', { state: { flight: f, totalPassengers, pax } })} className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 text-sm font-black text-white lg:justify-self-end">
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
