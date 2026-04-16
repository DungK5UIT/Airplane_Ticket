import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const formatMoney = (v) => (v != null ? Number(v).toLocaleString('vi-VN') + ' VNĐ' : '—');
const formatDT = (v) => {
    if (!v) return '—';
    if (Array.isArray(v)) {
        const d = new Date(v[0], v[1] - 1, v[2], v[3] || 0, v[4] || 0);
        return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return new Date(v).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Edit modal state
    const [editFlight, setEditFlight] = useState(null); // flight object being edited
    const [editForm, setEditForm] = useState(null);
    const [editError, setEditError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    // Form state
    const [form, setForm] = useState({
        maHangHK: '', maMayBay: '', maSanBayDi: '', maSanBayDen: '',
        ngayGioKhoiHanh: '', ngayGioHaCanh: '', thoiGianBay: '',
        trangThai: 'Đã lên lịch',
        chiTietHangVe: [{ maHangVe: 1, soLuongCho: '', giaCoBan: '' }],
        sanBayTrungGian: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        const role = currentUser?.user?.role ?? currentUser?.role;
        if (!currentUser || role !== 'ADMIN') { navigate('/login'); return; }
        setUser(currentUser);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [flightsData, airportsData] = await Promise.all([
                authService.getAllFlights(),
                authService.getAllAirports()
            ]);
            setFlights(flightsData);
            setAirports(airportsData);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Hạng vé dynamic
    const addHangVe = () => {
        setForm(prev => ({
            ...prev,
            chiTietHangVe: [...prev.chiTietHangVe, { maHangVe: 1, soLuongCho: '', giaCoBan: '' }]
        }));
    };
    const removeHangVe = (idx) => {
        setForm(prev => ({
            ...prev,
            chiTietHangVe: prev.chiTietHangVe.filter((_, i) => i !== idx)
        }));
    };
    const updateHangVe = (idx, field, value) => {
        setForm(prev => {
            const arr = [...prev.chiTietHangVe];
            arr[idx] = { ...arr[idx], [field]: value };
            return { ...prev, chiTietHangVe: arr };
        });
    };

    // Sân bay trung gian dynamic
    const addTrungGian = () => {
        setForm(prev => ({
            ...prev,
            sanBayTrungGian: [...prev.sanBayTrungGian, { maSanBayTG: '', thoiGianDung: '', thuTuDung: prev.sanBayTrungGian.length + 1, ghiChu: '' }]
        }));
    };
    const removeTrungGian = (idx) => {
        setForm(prev => ({
            ...prev,
            sanBayTrungGian: prev.sanBayTrungGian.filter((_, i) => i !== idx)
        }));
    };
    const updateTrungGian = (idx, field, value) => {
        setForm(prev => {
            const arr = [...prev.sanBayTrungGian];
            arr[idx] = { ...arr[idx], [field]: value };
            return { ...prev, sanBayTrungGian: arr };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        try {
            const payload = {
                maHangHK: form.maHangHK ? parseInt(form.maHangHK) : null,
                maMayBay: form.maMayBay ? parseInt(form.maMayBay) : null,
                maSanBayDi: parseInt(form.maSanBayDi),
                maSanBayDen: parseInt(form.maSanBayDen),
                ngayGioKhoiHanh: form.ngayGioKhoiHanh,
                ngayGioHaCanh: form.ngayGioHaCanh,
                thoiGianBay: parseInt(form.thoiGianBay),
                trangThai: form.trangThai || 'Đã lên lịch',
                chiTietHangVe: form.chiTietHangVe.filter(c => c.soLuongCho && c.giaCoBan).map(c => ({
                    maHangVe: parseInt(c.maHangVe),
                    soLuongCho: parseInt(c.soLuongCho),
                    giaCoBan: parseFloat(c.giaCoBan)
                })),
                sanBayTrungGian: form.sanBayTrungGian.filter(t => t.maSanBayTG).map((t, i) => ({
                    maSanBayTG: parseInt(t.maSanBayTG),
                    thoiGianDung: parseInt(t.thoiGianDung) || 0,
                    thuTuDung: i + 1,
                    ghiChu: t.ghiChu || ''
                }))
            };
            await authService.createFlightAdmin(payload);
            setSuccess('Thêm chuyến bay thành công!');
            setShowForm(false);
            setForm({
                maHangHK: '', maMayBay: '', maSanBayDi: '', maSanBayDen: '',
                ngayGioKhoiHanh: '', ngayGioHaCanh: '', thoiGianBay: '',
                trangThai: 'Đã lên lịch',
                chiTietHangVe: [{ maHangVe: 1, soLuongCho: '', giaCoBan: '' }],
                sanBayTrungGian: []
            });
            fetchData();
        } catch (err) {
            const msg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || err.message);
            setError(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa chuyến bay này?')) return;
        try {
            await authService.deleteFlight(id);
            setSuccess('Đã xóa chuyến bay.');
            fetchData();
        } catch (err) { setError('Xóa thất bại: ' + err.message); }
    };

    // Mở modal sửa — điền sẵn dữ liệu của chuyến bay
    const openEdit = (f) => {
        const toLocalDT = (v) => {
            if (!v) return '';
            const d = Array.isArray(v)
                ? new Date(v[0], v[1] - 1, v[2], v[3] || 0, v[4] || 0)
                : new Date(v);
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        setEditFlight(f);
        setEditForm({
            maSanBayDi: f.maSanBayDi?.maSanBay ?? '',
            maSanBayDen: f.maSanBayDen?.maSanBay ?? '',
            ngayGioKhoiHanh: toLocalDT(f.ngayGioKhoiHanh),
            ngayGioHaCanh: toLocalDT(f.ngayGioHaCanh),
            thoiGianBay: f.thoiGianBay ?? '',
            trangThai: f.trangThai ?? 'Đã lên lịch',
        });
        setEditError('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true); setEditError('');
        try {
            const payload = {
                maSanBayDi: parseInt(editForm.maSanBayDi),
                maSanBayDen: parseInt(editForm.maSanBayDen),
                ngayGioKhoiHanh: editForm.ngayGioKhoiHanh.replace('T', ' ') + ':00',
                ngayGioHaCanh: editForm.ngayGioHaCanh.replace('T', ' ') + ':00',
                thoiGianBay: parseInt(editForm.thoiGianBay),
                trangThai: editForm.trangThai,
                chiTietHangVe: [],
                sanBayTrungGian: []
            };
            await authService.updateFlightAdmin(editFlight.maChuyenBay, payload);
            setSuccess(`Cập nhật chuyến bay #${editFlight.maChuyenBay} thành công!`);
            setEditFlight(null);
            fetchData();
        } catch (err) {
            const msg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || err.message);
            setEditError(msg);
        } finally { setEditLoading(false); }
    };

    const handleLogout = () => { authService.logout(); navigate('/login'); };

    const hangVeNames = { 1: 'Economy', 2: 'Premium Economy', 3: 'Business', 4: 'First Class' };

    // Sidebar component
    const Sidebar = () => (
        <aside className="w-full bg-slate-900 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[280px] flex flex-col">
            <Link to="/" className="mb-10 flex items-center gap-2 text-xl font-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-base">✈️</span>
                <span>AdminPanel</span>
            </Link>
            <nav className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3 font-semibold text-cyan-300 cursor-pointer"><span>✈️</span> Quản lý chuyến bay</div>
                <Link to="/admin/regulations" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"><span>⚖️</span> Thay đổi quy định</Link>
                <Link to="/admin/revenue" className="flex items-center gap-2 rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors"><span>📊</span> Báo cáo doanh thu</Link>
            </nav>
            <div className="mt-6 border-t border-slate-700 pt-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-900">A</div>
                    <div>
                        <p className="text-sm font-semibold">Admin</p>
                        <p className="text-xs text-slate-300">{user?.user?.email ?? user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full rounded-lg border border-red-400 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/10">Đăng xuất</button>
            </div>
        </aside>
    );

    return (
        <>
        <div className="min-h-screen bg-slate-50 font-sans lg:flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-10">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Quản lý Chuyến Bay</h1>
                        <p className="mt-1 text-sm text-slate-500">Thêm, sửa hoặc xóa các chuyến bay trong hệ thống.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/')} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Xem Trang Chủ</button>
                        <button onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }} className="rounded-xl bg-blue-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
                            {showForm ? '✕ Đóng Form' : '➕ Thêm chuyến bay'}
                        </button>
                    </div>
                </header>

                {/* Thông báo */}
                {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 flex items-start gap-2"><span>❌</span>{error}</div>}
                {success && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700 flex items-start gap-2"><span>✅</span>{success}</div>}

                {/* Form thêm chuyến bay */}
                {showForm && (
                    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-bold text-slate-900">➕ Thêm chuyến bay mới</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Row 1: Sân bay */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Sân bay đi *</label>
                                    <select value={form.maSanBayDi} onChange={e => handleFormChange('maSanBayDi', e.target.value)} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                        <option value="">-- Chọn sân bay --</option>
                                        {airports.map(a => <option key={a.maSanBay} value={a.maSanBay}>{a.maIATA} - {a.thanhPho} ({a.tenSanBay})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Sân bay đến *</label>
                                    <select value={form.maSanBayDen} onChange={e => handleFormChange('maSanBayDen', e.target.value)} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                                        <option value="">-- Chọn sân bay --</option>
                                        {airports.map(a => <option key={a.maSanBay} value={a.maSanBay}>{a.maIATA} - {a.thanhPho} ({a.tenSanBay})</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Thời gian */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Giờ khởi hành *</label>
                                    <input type="datetime-local" value={form.ngayGioKhoiHanh} onChange={e => handleFormChange('ngayGioKhoiHanh', e.target.value)} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Giờ hạ cánh *</label>
                                    <input type="datetime-local" value={form.ngayGioHaCanh} onChange={e => handleFormChange('ngayGioHaCanh', e.target.value)} required className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian bay (phút) *</label>
                                    <input type="number" value={form.thoiGianBay} onChange={e => handleFormChange('thoiGianBay', e.target.value)} required min="1" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                                </div>
                            </div>

                            {/* Hạng vé */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Chi tiết hạng vé</label>
                                    <button type="button" onClick={addHangVe} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">+ Thêm hạng</button>
                                </div>
                                {form.chiTietHangVe.map((hv, i) => (
                                    <div key={i} className="mb-2 flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs text-slate-400">Hạng vé</label>
                                            <select value={hv.maHangVe} onChange={e => updateHangVe(i, 'maHangVe', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm">
                                                {Object.entries(hangVeNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                            </select>
                                        </div>
                                        <div className="w-28">
                                            <label className="mb-1 block text-xs text-slate-400">Số ghế</label>
                                            <input type="number" value={hv.soLuongCho} onChange={e => updateHangVe(i, 'soLuongCho', e.target.value)} min="0" className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" placeholder="150" />
                                        </div>
                                        <div className="w-40">
                                            <label className="mb-1 block text-xs text-slate-400">Giá cơ bản (VNĐ)</label>
                                            <input type="number" value={hv.giaCoBan} onChange={e => updateHangVe(i, 'giaCoBan', e.target.value)} min="0" className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" placeholder="1500000" />
                                        </div>
                                        {form.chiTietHangVe.length > 1 && (
                                            <button type="button" onClick={() => removeHangVe(i)} className="h-10 w-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-sm font-bold flex items-center justify-center">✕</button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Sân bay trung gian */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Sân bay trung gian</label>
                                    <button type="button" onClick={addTrungGian} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">+ Thêm điểm dừng</button>
                                </div>
                                {form.sanBayTrungGian.length === 0 && <p className="text-xs text-slate-400 italic">Chuyến bay trực tiếp (không có điểm dừng)</p>}
                                {form.sanBayTrungGian.map((tg, i) => (
                                    <div key={i} className="mb-2 flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs text-slate-400">Sân bay</label>
                                            <select value={tg.maSanBayTG} onChange={e => updateTrungGian(i, 'maSanBayTG', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm">
                                                <option value="">-- Chọn --</option>
                                                {airports.map(a => <option key={a.maSanBay} value={a.maSanBay}>{a.maIATA} - {a.thanhPho}</option>)}
                                            </select>
                                        </div>
                                        <div className="w-32">
                                            <label className="mb-1 block text-xs text-slate-400">Thời gian dừng (phút)</label>
                                            <input type="number" value={tg.thoiGianDung} onChange={e => updateTrungGian(i, 'thoiGianDung', e.target.value)} min="0" className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" placeholder="30" />
                                        </div>
                                        <div className="w-40">
                                            <label className="mb-1 block text-xs text-slate-400">Ghi chú</label>
                                            <input type="text" value={tg.ghiChu} onChange={e => updateTrungGian(i, 'ghiChu', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-2 text-sm" placeholder="Tiếp nhiên liệu" />
                                        </div>
                                        <button type="button" onClick={() => removeTrungGian(i)} className="h-10 w-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-sm font-bold flex items-center justify-center">✕</button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-3 border-t border-slate-100">
                                <button type="submit" className="h-11 flex-1 rounded-lg bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800">Thêm chuyến bay</button>
                                <button type="button" onClick={() => setShowForm(false)} className="h-11 rounded-lg border border-slate-300 px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">Hủy</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Bảng danh sách chuyến bay */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="text-base font-bold text-slate-900">Danh sách chuyến bay ({flights.length})</h3>
                        {loading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Mã</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Tuyến đường</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Giá từ</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Ghế</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">Trạng thái</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((f) => (
                                    <tr key={f.maChuyenBay} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-4 py-4 text-sm font-bold text-blue-600">#{f.maChuyenBay}</td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-semibold text-slate-800">
                                                {f.maSanBayDi?.thanhPho || '?'} → {f.maSanBayDen?.thanhPho || '?'}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {f.maSanBayDi?.maIATA || ''} → {f.maSanBayDen?.maIATA || ''} {f.maHangHK?.tenHang ? `· ${f.maHangHK.tenHang}` : ''}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-slate-700">{formatDT(f.ngayGioKhoiHanh)}</div>
                                            <div className="text-xs text-slate-400">{f.thoiGianBay} phút</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-bold text-orange-500">{formatMoney(f.giaCoBan)}</td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-slate-700">{f.soLuongChoConLai ?? '—'}</span>
                                            <span className="text-xs text-slate-400">/{f.soLuongCho ?? '—'}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${f.trangThai === 'Đã lên lịch' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {f.trangThai || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEdit(f)} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition" title="Sửa">✏️</button>
                                                <button onClick={() => handleDelete(f.maChuyenBay)} className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition" title="Xóa">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {flights.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center text-sm text-slate-400">
                                            <div className="mb-2 text-2xl">✈️</div>
                                            Chưa có chuyến bay nào trong hệ thống.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>

        {/* ── Modal Sửa chuyến bay ── */}
        {editFlight && editForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="text-base font-bold text-slate-900">✏️ Sửa chuyến bay <span className="text-blue-600">#{editFlight.maChuyenBay}</span></h2>
                        <button onClick={() => setEditFlight(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 text-lg">✕</button>
                    </div>
                    {/* Body */}
                    <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
                        {editError && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-semibold">❌ {editError}</div>}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Sân bay đi *</label>
                                <select value={editForm.maSanBayDi} onChange={e => setEditForm(p => ({ ...p, maSanBayDi: e.target.value }))} required
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                                    <option value="">-- Chọn --</option>
                                    {airports.map(a => <option key={a.maSanBay} value={a.maSanBay}>{a.maIATA} - {a.thanhPho}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Sân bay đến *</label>
                                <select value={editForm.maSanBayDen} onChange={e => setEditForm(p => ({ ...p, maSanBayDen: e.target.value }))} required
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                                    <option value="">-- Chọn --</option>
                                    {airports.map(a => <option key={a.maSanBay} value={a.maSanBay}>{a.maIATA} - {a.thanhPho}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Ngày giờ khởi hành *</label>
                                <input type="datetime-local" value={editForm.ngayGioKhoiHanh} onChange={e => setEditForm(p => ({ ...p, ngayGioKhoiHanh: e.target.value }))} required
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Ngày giờ hạ cánh *</label>
                                <input type="datetime-local" value={editForm.ngayGioHaCanh} onChange={e => setEditForm(p => ({ ...p, ngayGioHaCanh: e.target.value }))} required
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Thời gian bay (phút) *</label>
                                <input type="number" min="1" value={editForm.thoiGianBay} onChange={e => setEditForm(p => ({ ...p, thoiGianBay: e.target.value }))} required
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Trạng thái</label>
                                <select value={editForm.trangThai} onChange={e => setEditForm(p => ({ ...p, trangThai: e.target.value }))}
                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50">
                                    <option value="Đã lên lịch">Đã lên lịch</option>
                                    <option value="Đang bay">Đang bay</option>
                                    <option value="Đã hạ cánh">Đã hạ cánh</option>
                                    <option value="Bị hủy">Bị hủy</option>
                                    <option value="Bị hoãn">Bị hoãn</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setEditFlight(null)}
                                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Hủy</button>
                            <button type="submit" disabled={editLoading}
                                className="rounded-xl bg-blue-700 px-6 py-2 text-sm font-bold text-white hover:bg-blue-800 transition disabled:opacity-60">
                                {editLoading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
};

export default AdminDashboard;
