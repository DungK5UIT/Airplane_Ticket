import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const formatMoney = (v) => {
    if (!v && v !== 0) return '0 VNĐ';
    return Number(v).toLocaleString('vi-VN') + ' VNĐ';
};
const formatMoneyShort = (v) => {
    const n = Number(v || 0);
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' Tỷ';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' Tr';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
    return n.toString();
};

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
const MONTH_NAMES = ['','Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
    'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// Màu sắc biểu đồ tròn
const PIE_COLORS = ['#3b82f6','#06b6d4','#8b5cf6','#f59e0b','#10b981','#f43f5e','#64748b'];

/** SVG Pie Chart */
const PieChart = ({ data, size = 180 }) => {
    if (!data || data.length === 0) return <div className="text-slate-400 text-sm text-center py-8">Không có dữ liệu</div>;
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return <div className="text-slate-400 text-sm text-center py-8">Chưa có giao dịch</div>;

    const cx = size / 2, cy = size / 2, r = size / 2 - 10;
    let cumulativeAngle = -Math.PI / 2;
    const slices = data.map((d, i) => {
        const angle = (d.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(cumulativeAngle);
        const y1 = cy + r * Math.sin(cumulativeAngle);
        cumulativeAngle += angle;
        const x2 = cx + r * Math.cos(cumulativeAngle);
        const y2 = cy + r * Math.sin(cumulativeAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        return { ...d, path, color: PIE_COLORS[i % PIE_COLORS.length], pct: ((d.value / total) * 100).toFixed(1) };
    });

    return (
        <div className="flex items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices.map((sl, i) => (
                    <path key={i} d={sl.path} fill={sl.color} stroke="white" strokeWidth="2">
                        <title>{sl.label}: {sl.pct}%</title>
                    </path>
                ))}
            </svg>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                {slices.map((sl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: sl.color }} />
                        <span className="truncate text-slate-600">{sl.label}</span>
                        <span className="ml-auto font-bold text-slate-800 flex-shrink-0">{sl.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/** SVG Line Chart */
const LineChart = ({ data, width = 500, height = 160 }) => {
    if (!data || data.length === 0) return null;
    const values = data.map(d => Number(d.value || 0));
    const maxVal = Math.max(...values, 1);
    const padL = 10, padR = 10, padT = 20, padB = 24;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const points = values.map((v, i) => ({
        x: padL + (i / (values.length - 1)) * chartW,
        y: padT + chartH - (v / maxVal) * chartH
    }));

    const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
    const area = `${points[0].x},${padT + chartH} ` + polyline + ` ${points[points.length-1].x},${padT + chartH}`;

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={padL} x2={width - padR} y1={padT + chartH * (1 - f)} y2={padT + chartH * (1 - f)}
                    stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {/* Area fill */}
            <polygon points={area} fill="url(#lineGrad)" opacity="0.3" />
            {/* Line */}
            <polyline points={polyline} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Points */}
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2">
                    <title>{MONTH_LABELS[i]}: {formatMoney(values[i])}</title>
                </circle>
            ))}
            {/* X labels */}
            {points.map((p, i) => (
                <text key={i} x={p.x} y={height - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{MONTH_LABELS[i]}</text>
            ))}
            <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const AdminRevenue = () => {
    const [user, setUser] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        const role = currentUser?.user?.role ?? currentUser?.role;
        if (!currentUser || role !== 'ADMIN') { navigate('/login'); return; }
        setUser(currentUser);
        fetchYears();
    }, []);

    useEffect(() => { if (selectedYear) fetchRevenue(selectedYear); }, [selectedYear]);

    const fetchYears = async () => {
        try { const d = await authService.getRevenueYears(); setYears(d); } catch {}
    };

    const fetchRevenue = async (year) => {
        setLoading(true);
        try { const d = await authService.getRevenue(year); setData(d); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleLogout = () => { authService.logout(); navigate('/login'); };

    // Prepare chart data
    const barData = data?.theoThang?.map(m => ({ label: MONTH_LABELS[m.month - 1], value: Number(m.doanhThu || 0) })) || [];
    const lineData = data?.theoThang?.map(m => ({ value: Number(m.doanhThu || 0) })) || [];
    const maxBar = Math.max(...barData.map(d => d.value), 1);

    const pieDataPTTT = data?.theoHinhThucThanhToan
        ? Object.entries(data.theoHinhThucThanhToan).map(([k, v]) => ({ label: k, value: Number(v) }))
        : [];

    const pieDataStatus = data?.theoThang ? (() => {
        const success = data.theoThang.reduce((s, m) => s + m.soGiaoDichSuccess, 0);
        const pending = data.theoThang.reduce((s, m) => s + m.soGiaoDichPending, 0);
        return [
            { label: 'Thành công', value: success },
            { label: 'Chờ xử lý', value: pending }
        ].filter(d => d.value > 0);
    })() : [];

    const txData = data?.theoThang?.map(m => ({ label: MONTH_LABELS[m.month - 1], success: m.soGiaoDichSuccess, pending: m.soGiaoDichPending })) || [];
    const maxTx = Math.max(...txData.map(d => d.success + d.pending), 1);

    const Sidebar = () => (
        <aside className="w-full bg-slate-900 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[260px] flex flex-col">
            <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-base">✈️</span>
                <span>AdminPanel</span>
            </Link>
            <nav className="flex flex-1 flex-col gap-1.5">
                <Link to="/admin/dashboard" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors text-sm"><span>✈️</span> Quản lý chuyến bay</Link>
                <Link to="/admin/regulations" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors text-sm"><span>⚖️</span> Thay đổi quy định</Link>
                <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3 font-semibold text-cyan-300 text-sm"><span>📊</span> Báo cáo doanh thu</div>
            </nav>
            <div className="mt-6 border-t border-slate-700 pt-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-900 text-sm">A</div>
                    <div><p className="text-sm font-semibold">Admin</p><p className="text-xs text-slate-400">{user?.user?.email ?? user?.email}</p></div>
                </div>
                <button onClick={handleLogout} className="w-full rounded-lg border border-red-400 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10">Đăng xuất</button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans lg:flex" style={{ fontFamily: "'Inter', 'Nunito', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
                {/* Header */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">📊 Báo cáo Doanh thu</h1>
                        <p className="mt-1 text-sm text-slate-500">Thống kê từ bảng THANHTOAN · Chỉ tính giao dịch đã thanh toán thành công</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600">Năm:</span>
                        <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
                    </div>
                ) : data ? (
                    <div className="space-y-6">

                        {/* ── KPI Cards ── */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                { label: 'Tổng doanh thu', value: formatMoney(data.tongDoanhThu), sub: 'Giao dịch SUCCESS', color: 'from-blue-600 to-cyan-500', icon: '💰' },
                                { label: 'Tổng giao dịch', value: (data.tongGiaoDich || 0).toLocaleString('vi-VN'), sub: `${data.tongGiaoDichSuccess || 0} thành công`, color: 'from-violet-600 to-purple-500', icon: '🧾' },
                                { label: 'Tỷ lệ thành công', value: data.tongGiaoDich ? ((data.tongGiaoDichSuccess / data.tongGiaoDich) * 100).toFixed(1) + '%' : '—', sub: 'SUCCESS / Tổng', color: 'from-emerald-600 to-teal-500', icon: '✅' },
                                { label: 'TB doanh thu/tháng', value: formatMoneyShort(Number(data.tongDoanhThu || 0) / 12), sub: 'VNĐ mỗi tháng', color: 'from-orange-500 to-amber-400', icon: '📈' },
                            ].map((card, i) => (
                                <div key={i} className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="text-xs font-semibold opacity-80 uppercase tracking-wide">{card.label}</p>
                                        <span className="text-xl">{card.icon}</span>
                                    </div>
                                    <p className="text-2xl font-black leading-tight">{card.value}</p>
                                    <p className="mt-1 text-xs opacity-70">{card.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* ── Biểu đồ đường: Doanh thu theo tháng ── */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">📈 Xu hướng doanh thu theo tháng</h3>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Năm {selectedYear}</span>
                            </div>
                            <LineChart data={lineData} width={600} height={180} />
                        </div>

                        {/* ── Biểu đồ cột: Doanh thu ── */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-base font-bold text-slate-900">📊 Doanh thu theo tháng (cột)</h3>
                                <span className="text-xs text-slate-400">Chỉ tính SUCCESS</span>
                            </div>
                            <div className="flex items-end gap-1.5" style={{ height: 200 }}>
                                {barData.map((d, i) => {
                                    const pct = maxBar > 0 ? (d.value / maxBar) * 100 : 0;
                                    const hasVal = d.value > 0;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                                                {formatMoney(d.value)}
                                            </div>
                                            <div className="w-full flex flex-col justify-end" style={{ height: 172 }}>
                                                <div
                                                    className={`w-full rounded-t-md transition-all duration-700 ${hasVal ? 'bg-gradient-to-t from-blue-700 to-blue-400' : 'bg-slate-100'}`}
                                                    style={{ height: `${Math.max(pct, 2)}%` }}
                                                />
                                            </div>
                                            <span className="mt-1.5 text-[10px] font-bold text-slate-400">{d.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Y-axis labels */}
                            <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                                <span>0</span>
                                <span>{formatMoneyShort(maxBar / 2)}</span>
                                <span>{formatMoneyShort(maxBar)}</span>
                            </div>
                        </div>

                        {/* ── 2 Biểu đồ tròn + Biểu đồ cột giao dịch ── */}
                        <div className="grid gap-5 lg:grid-cols-3">
                            {/* Pie: Phương thức thanh toán */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold text-slate-900">🥧 Doanh thu theo PTTT</h3>
                                <PieChart data={pieDataPTTT} size={150} />
                                {pieDataPTTT.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Chưa có dữ liệu</p>}
                            </div>

                            {/* Pie: Trạng thái giao dịch */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold text-slate-900">🥧 Trạng thái giao dịch</h3>
                                <PieChart
                                    data={pieDataStatus.map((d, i) => ({
                                        ...d,
                                        color: i === 0 ? '#10b981' : '#f59e0b'
                                    }))}
                                    size={150}
                                />
                                {pieDataStatus.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Chưa có giao dịch</p>}
                            </div>

                            {/* Stacked Bar: Giao dịch SUCCESS vs PENDING */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-sm font-bold text-slate-900">📊 Giao dịch theo tháng</h3>
                                <div className="flex items-end gap-1" style={{ height: 140 }}>
                                    {txData.map((d, i) => {
                                        const total = d.success + d.pending;
                                        const totalPct = maxTx > 0 ? (total / maxTx) * 100 : 0;
                                        const successPct = total > 0 ? (d.success / total) * 100 : 0;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center" title={`${MONTH_LABELS[i]}: ${d.success} OK, ${d.pending} chờ`}>
                                                <div className="w-full flex flex-col justify-end overflow-hidden rounded-t" style={{ height: 112 }}>
                                                    <div style={{ height: `${Math.max(totalPct, total > 0 ? 4 : 0)}%` }} className="w-full flex flex-col justify-end">
                                                        <div style={{ height: `${100 - successPct}%` }} className="w-full bg-amber-400 min-h-0" />
                                                        <div style={{ height: `${successPct}%` }} className="w-full bg-emerald-500 min-h-0" />
                                                    </div>
                                                </div>
                                                <span className="mt-1 text-[9px] font-bold text-slate-400">{MONTH_LABELS[i]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />Thành công</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />Chờ xử lý</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Bảng chi tiết ── */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">📋 Bảng chi tiết theo tháng</h3>
                                <span className="text-xs text-slate-400">Năm {selectedYear} · Nguồn: bảng THANHTOAN</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50">
                                            {['Tháng','Doanh thu (SUCCESS)','Tổng GD','Thành công','Chờ xử lý','Tỷ lệ TT'].map(h => (
                                                <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.theoThang?.map((m) => {
                                            const pct = m.soGiaoDich > 0 ? ((m.soGiaoDichSuccess / m.soGiaoDich) * 100).toFixed(0) : null;
                                            const hasData = m.soGiaoDich > 0;
                                            return (
                                                <tr key={m.month} className={`border-b border-slate-100 transition ${hasData ? 'hover:bg-blue-50/30' : ''}`}>
                                                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{MONTH_NAMES[m.month]}</td>
                                                    <td className="px-5 py-3.5 text-sm font-bold text-blue-600">{formatMoney(m.doanhThu)}</td>
                                                    <td className="px-5 py-3.5 text-sm text-slate-600">{m.soGiaoDich}</td>
                                                    <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600">{m.soGiaoDichSuccess}</td>
                                                    <td className="px-5 py-3.5 text-sm font-semibold text-amber-600">{m.soGiaoDichPending}</td>
                                                    <td className="px-5 py-3.5">
                                                        {pct != null ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                                </div>
                                                                <span className={`text-xs font-bold ${+pct >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{pct}%</span>
                                                            </div>
                                                        ) : <span className="text-xs text-slate-300">—</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 border-t-2 border-slate-200">
                                            <td className="px-5 py-3 text-sm font-black text-slate-800">Tổng cộng</td>
                                            <td className="px-5 py-3 text-sm font-black text-blue-700">{formatMoney(data.tongDoanhThu)}</td>
                                            <td className="px-5 py-3 text-sm font-bold text-slate-700">{data.tongGiaoDich}</td>
                                            <td className="px-5 py-3 text-sm font-bold text-emerald-700">{data.tongGiaoDichSuccess}</td>
                                            <td className="px-5 py-3 text-sm font-bold text-amber-700">{data.tongGiaoDich - data.tongGiaoDichSuccess}</td>
                                            <td className="px-5 py-3 text-sm font-black text-slate-700">
                                                {data.tongGiaoDich > 0 ? ((data.tongGiaoDichSuccess / data.tongGiaoDich) * 100).toFixed(1) + '%' : '—'}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 text-slate-400">
                        <div className="text-5xl mb-4">📊</div>
                        <p className="text-base font-semibold">Không có dữ liệu cho năm {selectedYear}</p>
                        <p className="text-sm mt-1">Thực hiện giao dịch để xem báo cáo</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminRevenue;
