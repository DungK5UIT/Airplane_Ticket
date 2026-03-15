import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../App.css';

const AdminDashboard = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [currentFlight, setCurrentFlight] = useState({
        flightNumber: '', origin: '', destination: '',
        departureTime: '', arrivalTime: '', price: 0, availableSeats: 0
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const data = await authService.getAllFlights();
            setFlights(data);
        } catch (err) {
            console.error('Failed to fetch flights', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentFlight({ ...currentFlight, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await authService.updateFlight(currentFlight.id, currentFlight);
            } else {
                await authService.createFlight(currentFlight);
            }
            fetchFlights();
            resetForm();
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (flight) => {
        setIsEditing(true);
        setCurrentFlight({
            ...flight,
            departureTime: flight.departureTime.slice(0, 16),
            arrivalTime: flight.arrivalTime.slice(0, 16)
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
            try {
                await authService.deleteFlight(id);
                fetchFlights();
            } catch (err) {
                alert('Xóa thất bại');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentFlight({
            flightNumber: '', origin: '', destination: '',
            departureTime: '', arrivalTime: '', price: 0, availableSeats: 0
        });
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: '#1e293b', color: '#fff', padding: '32px 24px', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Link to="/" className="app-logo" style={{ color: '#fff', marginBottom: '48px', fontSize: '20px' }}>
                    <span style={{background: '#38bdf8', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '16px'}}>✈️</span>
                    <span>AdminPanel</span>
                </Link>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#334155', color: '#38bdf8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span>📊</span> Tổng quan
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span>✈️</span> Quản lý chuyến bay
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span>👤</span> Quản lý người dùng
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span>🎫</span> Đơn đặt vé
                    </div>
                </nav>

                <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>A</div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>Admin</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{user?.email}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>Đăng xuất</button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>Quản lý Chuyến Bay</h1>
                        <p style={{ color: '#64748b' }}>Thêm, sửa hoặc xóa các chuyến bay trong hệ thống của bạn.</p>
                    </div>
                    <button onClick={() => navigate('/')} className="btn btn-outline" style={{ background: '#fff' }}>Xem Trang Chủ</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }}>
                    {/* Form Side */}
                    <div className="card" style={{ padding: '32px', position: 'sticky', top: '40px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isEditing ? '✏️ Sửa thông tin' : '➕ Thêm chuyến bay'}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Số hiệu chuyến bay</label>
                                <input name="flightNumber" value={currentFlight.flightNumber} onChange={handleInputChange} placeholder="VD: VN123" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Điểm đi</label>
                                    <input name="origin" value={currentFlight.origin} onChange={handleInputChange} placeholder="Hà Nội" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Điểm đến</label>
                                    <input name="destination" value={currentFlight.destination} onChange={handleInputChange} placeholder="TP. HCM" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Giờ khởi hành</label>
                                <input type="datetime-local" name="departureTime" value={currentFlight.departureTime} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Giờ hạ cánh</label>
                                <input type="datetime-local" name="arrivalTime" value={currentFlight.arrivalTime} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Giá (VNĐ)</label>
                                    <input type="number" name="price" value={currentFlight.price} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                </div>
                                <div className="input-group">
                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Số ghế</label>
                                    <input type="number" name="availableSeats" value={currentFlight.availableSeats} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>
                                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                {isEditing && (
                                    <button onClick={resetForm} type="button" className="btn btn-outline" style={{ flex: 1, padding: '14px', border: '1px solid #cbd5e1', color: '#64748b' }}>Hủy</button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table Side */}
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Danh sách chuyến bay</h3>
                            {loading && <div className="spinner-sm" style={{ width: '20px', height: '20px', border: '2px solid #f3f3f3', borderTop: '2px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Số hiệu</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Tuyến đường</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Giá</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Ghế</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map(flight => (
                                        <tr key={flight.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{flight.flightNumber}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: '500' }}>{flight.origin} → {flight.destination}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(flight.departureTime).toLocaleDateString('vi-VN')}</div>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--accent)' }}>{flight.price.toLocaleString()} VNĐ</td>
                                            <td style={{ padding: '16px', fontSize: '14px' }}>{flight.availableSeats}</td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                    <button onClick={() => handleEdit(flight)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: '#e0f2fe', color: '#0369a1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Sửa">✏️</button>
                                                    <button onClick={() => handleDelete(flight.id)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Xóa">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {flights.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                                                <div style={{ fontSize: '24px', marginBottom: '12px' }}>✈️</div>
                                                Chưa có chuyến bay nào trong hệ thống.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                tbody tr:hover { background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
