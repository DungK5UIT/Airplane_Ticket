import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

export default function Orders() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const flight = state?.flight;
    const pax = state?.pax || { adult: 1, child: 0, infant: 0 };
    const selectedSeats = state?.selectedSeats || [];
    const totalPrice = state?.totalPrice || 0;

    const [contact, setContact] = useState({ name: '', email: '', phone: '' });

    // Create initial passenger lists based on pax object from previous steps
    const [passengers, setPassengers] = useState(() => {
        const list = [];
        const initPax = (type, count, labelPrefix) => {
            for (let i = 1; i <= count; i++) {
                list.push({
                    type,
                    label: `${labelPrefix} ${i}`,
                    title: type === 'adult' ? 'Ông' : 'Bé trai',
                    fullName: '',
                    dob: ''
                });
            }
        };
        initPax('adult', pax.adult, 'Người lớn');
        initPax('child', pax.child, 'Trẻ em');
        initPax('infant', pax.infant, 'Em bé');
        return list;
    });

    if (!flight) {
        return (
            <div className="min-h-screen bg-slate-100 p-10 text-center">
                <h3 className="mb-4 text-xl font-bold text-slate-800">Không tìm thấy dữ liệu chuyến bay.</h3>
                <button
                    onClick={() => navigate('/flight')}
                    className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    const handlePaxChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    };

    const handleContactChange = (field, value) => {
        setContact(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!contact.name || !contact.email || !contact.phone) {
            alert('Vui lòng nhập đầy đủ thông tin liên hệ!');
            return;
        }
        for (let p of passengers) {
            if (!p.fullName || !p.dob) {
                alert(`Vui lòng nhập đầy đủ thông tin cho ${p.label}!`);
                return;
            }
        }

        alert('Đặt vé thành công! Bạn có thể chuyển sang gateway thanh toán từ đây.');
        // navigate('/payment', { state: { flight, pax, selectedSeats, totalPrice, contact, passengers } });
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar transparent={false} />
            <div className="mx-auto grid w-[min(1200px,95vw)] gap-6 pb-14 pt-[100px] lg:grid-cols-[1fr_360px]">
                <div>
                    <form onSubmit={handleSubmit}>
                        {/* Thông tin liên hệ */}
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-3 text-xl font-black text-slate-900">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">1</span> Thông tin liên lạc
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-sm font-bold text-slate-600">Họ và tên người liên hệ</label>
                                    <input
                                        type="text"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Ví dụ: NGUYEN VAN A"
                                        value={contact.name}
                                        onChange={e => handleContactChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-600">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Ví dụ: 0901234567"
                                        value={contact.phone}
                                        onChange={e => handleContactChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-slate-600">Email</label>
                                    <input
                                        type="email"
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="Ví dụ: email@domain.com"
                                        value={contact.email}
                                        onChange={e => handleContactChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin hành khách */}
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 flex items-center gap-3 text-xl font-black text-slate-900">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">2</span> Thông tin hành khách
                            </h2>
                            <p className="mb-5 text-sm text-slate-500">
                                Vui lòng điền tên in hoa không dấu và kiểm tra kỹ ngày sinh.
                            </p>

                            {passengers.map((p, idx) => (
                                <div key={idx} className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 last:mb-0">
                                    <div className="mb-4 flex items-center gap-2 text-base font-extrabold text-slate-900">
                                        <svg className="text-slate-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {p.label}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-slate-600">Danh xưng</label>
                                            <select
                                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                value={p.title}
                                                onChange={e => handlePaxChange(idx, 'title', e.target.value)}
                                            >
                                                {p.type === 'adult' ? (
                                                    <>
                                                        <option value="Ông">Ông</option>
                                                        <option value="Bà">Bà</option>
                                                        <option value="Anh">Anh</option>
                                                        <option value="Chị">Chị</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="Bé trai">Bé trai</option>
                                                        <option value="Bé gái">Bé gái</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-slate-600">Họ và tên (In hoa không dấu)</label>
                                            <input
                                                type="text"
                                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                placeholder="VD: NGUYEN VAN A"
                                                value={p.fullName}
                                                onChange={e => handlePaxChange(idx, 'fullName', e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-sm font-bold text-slate-600">Ngày sinh</label>
                                            <input
                                                type="date"
                                                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                                value={p.dob}
                                                onChange={e => handlePaxChange(idx, 'dob', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit button */}
                        <button type="submit" className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-sm font-extrabold text-white transition hover:brightness-105">
                            Tiến hành thanh toán
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Right Panel */}
                <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-[100px]">
                    <h2 className="mb-4 text-lg font-black text-slate-900">Tóm tắt chuyến bay</h2>

                    <div className="mb-4 border-b border-dashed border-slate-200 pb-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-lg font-black">{flight.origin}</div>
                            <svg width="20" height="20" className="text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <div className="text-lg font-black">{flight.destination}</div>
                        </div>
                        <div className="text-sm font-semibold text-slate-500">
                            {flight.airline} • {flight.flightNumber}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-500">
                            Khởi hành: {formatDateTime(flight.departureTime)}
                        </div>
                    </div>

                    <div className="mb-4 border-b border-dashed border-slate-200 pb-4 text-sm">
                        <div className="mb-2 flex justify-between text-slate-600">
                            <span>Người lớn</span>
                            <span className="font-extrabold text-slate-900">{pax.adult}</span>
                        </div>
                        {pax.child > 0 && (
                            <div className="mb-2 flex justify-between text-slate-600">
                                <span>Trẻ em</span>
                                <span className="font-extrabold text-slate-900">{pax.child}</span>
                            </div>
                        )}
                        {pax.infant > 0 && (
                            <div className="mb-2 flex justify-between text-slate-600">
                                <span>Em bé</span>
                                <span className="font-extrabold text-slate-900">{pax.infant}</span>
                            </div>
                        )}
                        <div className="mt-3 flex justify-between text-slate-600">
                            <span>Ghế chọn</span>
                            <span className="font-extrabold text-blue-600">{selectedSeats.join(', ')}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold">Tổng tiền</span>
                        <span className="text-2xl font-black text-red-500">
                            {formatMoneyVND(totalPrice)}
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
