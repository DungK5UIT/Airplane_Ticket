import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { authService } from '../services/api';
import FlightList from '../components/FlightList';

const normalize = (s) => (s || '').toString().trim();

const Flight = () => {
    const location = useLocation();
    const routeState = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);

    const [origin, setOrigin] = useState(routeState.origin || '');
    const [destination, setDestination] = useState(routeState.destination || '');
    const [date, setDate] = useState(routeState.date || '');
    const [pax, setPax] = useState(routeState.pax || { adult: 1, child: 0, infant: 0 });

    const [originOpen, setOriginOpen] = useState(false);
    const [destOpen, setDestOpen] = useState(false);
    const [paxOpen, setPaxOpen] = useState(false);

    const [searchOriginText, setSearchOriginText] = useState('');
    const [searchDestText, setSearchDestText] = useState('');

    const originRef = useRef(null);
    const destRef = useRef(null);
    const paxRef = useRef(null);

    const [searching, setSearching] = useState(false);
    const totalPassengers = pax.adult + pax.child + pax.infant;

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await api.get('/api/airports');
                setAirports(response.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sân bay", error);
            }
        };
        fetchAirports();
    }, []);

    useEffect(() => {
        const onDown = (e) => {
            if (paxOpen && paxRef.current && !paxRef.current.contains(e.target)) setPaxOpen(false);
            if (originOpen && originRef.current && !originRef.current.contains(e.target)) setOriginOpen(false);
            if (destOpen && destRef.current && !destRef.current.contains(e.target)) setDestOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [paxOpen, originOpen, destOpen]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                let data;
                if (routeState.origin && routeState.destination && routeState.date) {
                    data = await authService.searchFlights(routeState.origin, routeState.destination, routeState.date);
                } else {
                    data = await authService.getAllFlights();
                }

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
        return () => { cancelled = true; };
    }, [routeState.origin, routeState.destination, routeState.date]);

    const filteredOriginAirports = airports.filter(a =>
        (a.thanhPho && a.thanhPho.toLowerCase().includes(searchOriginText.toLowerCase())) ||
        (a.maIATA && a.maIATA.toLowerCase().includes(searchOriginText.toLowerCase())) ||
        (a.tenSanBay && a.tenSanBay.toLowerCase().includes(searchOriginText.toLowerCase()))
    );

    const filteredDestAirports = airports.filter(a =>
        (a.thanhPho && a.thanhPho.toLowerCase().includes(searchDestText.toLowerCase())) ||
        (a.maIATA && a.maIATA.toLowerCase().includes(searchDestText.toLowerCase())) ||
        (a.tenSanBay && a.tenSanBay.toLowerCase().includes(searchDestText.toLowerCase()))
    );

    const filteredClientSide = useMemo(() => {
        const o = normalize(origin).toLowerCase();
        const d = normalize(destination).toLowerCase();
        const day = normalize(date);

        return (flights || []).filter((f) => {
            const cityDi = normalize(f.maSanBayDi?.thanhPho).toLowerCase();
            const airportDi = normalize(f.maSanBayDi?.tenSanBay).toLowerCase();
            const cityDen = normalize(f.maSanBayDen?.thanhPho).toLowerCase();
            const airportDen = normalize(f.maSanBayDen?.tenSanBay).toLowerCase();

            const matchO = !o || cityDi.includes(o) || airportDi.includes(o);
            const matchD = !d || cityDen.includes(d) || airportDen.includes(d);

            if (!matchO || !matchD) return false;

            if (!day) return true;
            const depart = f.ngayGioKhoiHanh ? new Date(f.ngayGioKhoiHanh) : null;
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

        if (!o && !d && !date) return;

        setSearching(true);
        try {
            let data;
            if (o && d && date) {
                data = await authService.searchFlights(o, d, date);
            } else {
                data = await authService.getAllFlights();
            }
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

    const selectedOriginIATA = useMemo(() => {
        const apt = airports.find(a => a.thanhPho === origin);
        return apt ? apt.maIATA : (list[0]?.maSanBayDi?.maIATA || '---');
    }, [airports, origin, list]);

    const selectedDestIATA = useMemo(() => {
        const apt = airports.find(a => a.thanhPho === destination);
        return apt ? apt.maIATA : (list[0]?.maSanBayDen?.maIATA || '---');
    }, [airports, destination, list]);

    return (
        <div className="min-h-screen bg-[#f5f5f5] text-slate-900 flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
                `}
            </style>

            <Navbar transparent={false} />

            <div className="mx-auto w-[min(1200px,96vw)] pt-[100px] flex-grow">
                {/* PHẦN TÌM KIẾM */}
                <div className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h1 className="text-3xl font-black text-slate-900">Chuyến bay</h1>
                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            Tìm chuyến bay theo điểm đi, điểm đến và ngày bay.
                        </p>

                        <form onSubmit={handleSearch} className="mt-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                                {/* ĐIỂM ĐI */}
                                <div className="relative" ref={originRef}>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Điểm đi</label>
                                    <button type="button" onClick={() => { setOriginOpen(!originOpen); setDestOpen(false); setPaxOpen(false); setSearchOriginText(''); }} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                        <span className="truncate">{origin || 'Chọn điểm đi'}</span>
                                        <span className="text-xs opacity-60">▾</span>
                                    </button>
                                    {originOpen && (
                                        <div className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-[300px] w-full min-w-[260px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                            <div className="sticky top-0 mb-2 bg-white px-2 py-1">
                                                <input type="text" autoFocus placeholder="Tìm thành phố..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" value={searchOriginText} onChange={(e) => setSearchOriginText(e.target.value)} />
                                            </div>
                                            {filteredOriginAirports.length > 0 ? filteredOriginAirports.map((airport) => (
                                                <button key={airport.maSanBay} type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setOrigin(airport.thanhPho); setOriginOpen(false); setSearchOriginText(''); }}>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{airport.thanhPho}</p>
                                                        <p className="text-xs font-medium text-slate-500">{airport.tenSanBay}</p>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700">{airport.maIATA}</span>
                                                </button>
                                            )) : <div className="px-3 py-4 text-center text-sm font-semibold text-slate-400">Không tìm thấy kết quả</div>}
                                        </div>
                                    )}
                                </div>

                                {/* ĐIỂM ĐẾN */}
                                <div className="relative" ref={destRef}>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Điểm đến</label>
                                    <button type="button" onClick={() => { setDestOpen(!destOpen); setOriginOpen(false); setPaxOpen(false); setSearchDestText(''); }} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                        <span className="truncate">{destination || 'Chọn điểm đến'}</span>
                                        <span className="text-xs opacity-60">▾</span>
                                    </button>
                                    {destOpen && (
                                        <div className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-[300px] w-full min-w-[260px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                            <div className="sticky top-0 mb-2 bg-white px-2 py-1">
                                                <input type="text" autoFocus placeholder="Tìm thành phố..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" value={searchDestText} onChange={(e) => setSearchDestText(e.target.value)} />
                                            </div>
                                            {filteredDestAirports.length > 0 ? filteredDestAirports.map((airport) => (
                                                <button key={airport.maSanBay} type="button" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setDestination(airport.thanhPho); setDestOpen(false); setSearchDestText(''); }}>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{airport.thanhPho}</p>
                                                        <p className="text-xs font-medium text-slate-500">{airport.tenSanBay}</p>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700">{airport.maIATA}</span>
                                                </button>
                                            )) : <div className="px-3 py-4 text-center text-sm font-semibold text-slate-400">Không tìm thấy kết quả</div>}
                                        </div>
                                    )}
                                </div>

                                {/* NGÀY BAY */}
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Ngày bay</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>

                                {/* HÀNH KHÁCH */}
                                <div className="relative" ref={paxRef}>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Hành khách</label>
                                    <button type="button" onClick={() => { setPaxOpen((v) => !v); setOriginOpen(false); setDestOpen(false); }} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
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
                                                            })} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 font-bold disabled:opacity-40">-</button>
                                                            <span className="w-6 text-center text-sm font-black text-slate-900">{value}</span>
                                                            <button type="button" disabled={!canInc} onClick={() => setPax((prev) => ({ ...prev, [row.key]: prev[row.key] + 1 }))} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 font-bold disabled:opacity-40">+</button>
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

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <button type="submit" disabled={loading || searching} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0b2046] px-6 text-sm font-black text-white hover:bg-opacity-90 disabled:opacity-70">
                                    {searching ? 'Đang tìm...' : 'Tìm chuyến bay'}
                                </button>
                                <button type="button" onClick={clearFilters} disabled={loading || searching} className="h-11 rounded-xl bg-slate-200 px-6 text-sm font-bold text-slate-700 hover:bg-slate-300">
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="relative min-h-[200px] overflow-hidden rounded-2xl shadow-sm lg:h-full">
                        <img src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Phong cảnh" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute bottom-4 right-4 rounded-xl bg-white/70 px-4 py-3 text-right backdrop-blur-md shadow-lg border border-white/30">
                            <p className="text-sm text-slate-800">Hành khách: <span className="font-black">{totalPassengers}</span></p>
                            <p className="mt-1 text-sm text-slate-800">Bộ lọc: <span className="font-black">{(origin || destination || date) ? 'Đang áp dụng' : 'Chưa có'}</span></p>
                        </div>
                    </div>
                </div>

                {/* --- COMPONENT DANH SÁCH CHUYẾN BAY --- */}
                <FlightList
                    list={list}
                    loading={loading}
                    error={error}
                    origin={origin}
                    destination={destination}
                    selectedOriginIATA={selectedOriginIATA}
                    selectedDestIATA={selectedDestIATA}
                    totalPassengers={totalPassengers}
                    pax={pax}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Flight;