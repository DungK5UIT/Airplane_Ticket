import React, { useState } from 'react';
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
            <div style={{ minHeight: '100vh', background: '#f6f8fc', padding: 50, textAlign: 'center' }}>
                <h3>Không tìm thấy dữ liệu chuyến bay.</h3>
                <button onClick={() => navigate('/flight')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Quay lại</button>
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
        <div style={{ minHeight: '100vh', background: '#f6f8fc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Navbar transparent={false} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .ord-page {
                    width: min(1200px, 95vw);
                    margin: 0 auto;
                    padding: 100px 0 56px;
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 24px;
                    align-items: start;
                }

                .ord-card {
                    background: #fff;
                    border: 1.5px solid #e6eaf2;
                    border-radius: 20px;
                    box-shadow: 0 18px 40px -20px rgba(2,6,23,0.08);
                    padding: 24px;
                    margin-bottom: 24px;
                }

                .ord-title {
                    font-size: 20px;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 20px;
                    letter-spacing: -0.01em;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ord-title span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-field.full {
                    grid-column: 1 / -1;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 800;
                    color: #475569;
                }

                .form-input, .form-select {
                    height: 46px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 0 14px;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                    background: #fff;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    outline: none;
                }

                .form-input:focus, .form-select:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .pax-block {
                    border: 1.5px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 16px;
                    background: #fafaf9;
                }
                .pax-block:last-child {
                    margin-bottom: 0;
                }

                .pax-head {
                    font-size: 16px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pax-icon {
                    color: #64748b;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #475569;
                    margin-bottom: 12px;
                }
                .summary-val {
                    font-weight: 800;
                    color: #0f172a;
                    text-align: right;
                }

                .btn-submit {
                    width: 100%;
                    height: 52px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
                    color: white;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 30px -10px rgba(37, 99, 235, 0.5);
                }

                @media (max-width: 992px) {
                    .ord-page {
                        grid-template-columns: 1fr;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            
            <div className="ord-page">
                <div>
                    <form onSubmit={handleSubmit}>
                        {/* Thông tin liên hệ */}
                        <div className="ord-card">
                            <h2 className="ord-title">
                                <span>1</span> Thông tin liên lạc
                            </h2>
                            <div className="form-grid">
                                <div className="form-field full">
                                    <label className="form-label">Họ và tên người liên hệ</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="Ví dụ: NGUYEN VAN A" 
                                        value={contact.name}
                                        onChange={e => handleContactChange('name', e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Số điện thoại</label>
                                    <input 
                                        type="tel" 
                                        className="form-input" 
                                        placeholder="Ví dụ: 0901234567" 
                                        value={contact.phone}
                                        onChange={e => handleContactChange('phone', e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-input" 
                                        placeholder="Ví dụ: email@domain.com" 
                                        value={contact.email}
                                        onChange={e => handleContactChange('email', e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Thông tin hành khách */}
                        <div className="ord-card">
                            <h2 className="ord-title">
                                <span>2</span> Thông tin hành khách
                            </h2>
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                                Vui lòng điền tên in hoa không dấu và kiểm tra kỹ ngày sinh.
                            </p>
                            
                            {passengers.map((p, idx) => (
                                <div key={idx} className="pax-block">
                                    <div className="pax-head">
                                        <svg className="pax-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {p.label}
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label className="form-label">Danh xưng</label>
                                            <select 
                                                className="form-select"
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

                                        <div className="form-field">
                                            <label className="form-label">Họ và tên (In hoa không dấu)</label>
                                            <input 
                                                type="text" 
                                                className="form-input" 
                                                placeholder="VD: NGUYEN VAN A" 
                                                value={p.fullName}
                                                onChange={e => handlePaxChange(idx, 'fullName', e.target.value.toUpperCase())}
                                                required 
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="form-label">Ngày sinh</label>
                                            <input 
                                                type="date" 
                                                className="form-input" 
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
                        <button type="submit" className="btn-submit">
                            Tiến hành thanh toán
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Right Panel */}
                <div className="ord-card" style={{ position: 'sticky', top: 100 }}>
                    <h2 className="ord-title" style={{ fontSize: 18, marginBottom: 16 }}>Tóm tắt chuyến bay</h2>
                    
                    <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 18 }}>{flight.origin}</div>
                            <svg width="20" height="20" style={{ color: '#94a3b8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <div style={{ fontWeight: 900, fontSize: 18 }}>{flight.destination}</div>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                            {flight.airline} • {flight.flightNumber}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>
                            Khởi hành: {formatDateTime(flight.departureTime)}
                        </div>
                    </div>

                    <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                        <div className="summary-row">
                            <span>Người lớn</span>
                            <span className="summary-val">{pax.adult}</span>
                        </div>
                        {pax.child > 0 && (
                            <div className="summary-row">
                                <span>Trẻ em</span>
                                <span className="summary-val">{pax.child}</span>
                            </div>
                        )}
                        {pax.infant > 0 && (
                            <div className="summary-row">
                                <span>Em bé</span>
                                <span className="summary-val">{pax.infant}</span>
                            </div>
                        )}
                        <div className="summary-row" style={{ marginTop: 8 }}>
                            <span>Ghế chọn</span>
                            <span className="summary-val" style={{ color: '#2563eb' }}>{selectedSeats.join(', ')}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 800 }}>Tổng tiền</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>
                            {formatMoneyVND(totalPrice)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
