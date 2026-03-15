import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import '../App.css';

const Home = () => {
    const [flights, setFlights] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
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

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.searchFlights(origin, destination);
            setFlights(data);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="home-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header / Navbar */}
            <nav className="main-navbar">
                <Link to="/" className="app-logo">
                    <span style={{background: 'var(--primary)', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '18px'}}>✈️</span>
                    <span>FlightGreen</span>
                </Link>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '500', color: 'var(--text-sub)' }}>
                        <Link to="/" style={{ color: 'var(--primary)' }}>Chuyến bay</Link>
                        <a href="#">Khách sạn</a>
                        <a href="#">Combo tiện ích</a>
                    </div>
                    
                    <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }}></div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{user.name || 'Người dùng'}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{user.email}</div>
                            </div>
                            {user.role === 'ADMIN' && (
                                <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>Quản trị</button>
                            )}
                            <button onClick={handleLogout} className="btn" style={{ background: '#fff1f2', color: '#e11d48', padding: '6px 12px', fontSize: '12px' }}>Đăng xuất</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link to="/login" className="btn btn-outline">Đăng nhập</Link>
                            <Link to="/register" className="btn btn-primary">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Search Hero Section */}
            <div style={{ background: 'var(--primary)', padding: '60px 0 100px', color: '#fff', textAlign: 'center', position: 'relative' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Tìm chuyến bay giá tốt nhất</h1>
                    <p style={{ opacity: 0.9, fontSize: '18px', marginBottom: '40px' }}>Bay mọi nơi, tiết kiệm tối đa cùng FlightGreen</p>
                    
                    {/* Search Bar Container */}
                    <div className="card" style={{ maxWidth: '1000px', margin: '0 auto -140px', position: 'relative', zIndex: 10, padding: '32px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
                        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                            <div className="input-group" style={{ textAlign: 'left' }}>
                                <label style={{ color: 'var(--text-sub)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Điểm khởi hành</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>📍</span>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }} 
                                        placeholder="Ví dụ: Hà Nội (HAN)"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-group" style={{ textAlign: 'left' }}>
                                <label style={{ color: 'var(--text-sub)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Điểm đến</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>✈️</span>
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }} 
                                        placeholder="Ví dụ: TP. HCM (SGN)"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 40px', height: '48px', fontSize: '16px', background: 'var(--accent)' }} disabled={loading}>
                                {loading ? '...' : 'Tìm kiếm'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div style={{ maxWidth: '1000px', margin: '80px auto 60px', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {flights.length > 0 ? `Chuyến bay sẵn có (${flights.length})` : 'Kết quả tìm kiếm'}
                    </h2>
                    <div style={{ fontSize: '14px', color: 'var(--text-sub)' }}>Sắp xếp theo: <strong>Giá rẻ nhất</strong></div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                        <p style={{ color: 'var(--text-sub)' }}>Đang tìm những chuyến bay tốt nhất cho bạn...</p>
                    </div>
                ) : flights.length > 0 ? (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {flights.map(flight => (
                            <div key={flight.id} className="card flight-item" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                    {/* Airline Info */}
                                    <div style={{ width: '120px' }}>
                                        <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--primary)', marginBottom: '4px' }}>FlightGreen</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{flight.flightNumber}</div>
                                    </div>
                                    
                                    {/* Route */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '700', fontSize: '18px' }}>{new Date(flight.departureTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-sub)' }}>{flight.origin}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--text-sub)', marginBottom: '4px' }}>Trực tiếp</div>
                                            <div style={{ width: '100%', height: '1px', background: '#d1d5db', position: 'relative' }}>
                                                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '12px' }}>✈️</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '18px' }}>{new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-sub)' }}>{flight.destination}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent)', marginBottom: '12px' }}>
                                        {flight.price.toLocaleString('vi-VN')} <span style={{fontSize: '14px'}}>VNĐ</span>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '10px 24px' }}>Chọn</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '80px 40px', background: '#f8fafc' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Không tìm thấy chuyến bay</h3>
                        <p style={{ color: 'var(--text-sub)' }}>Thử tìm kiếm với một điểm khởi hành hoặc điểm đến khác.</p>
                        <button onClick={fetchFlights} className="btn btn-outline" style={{ marginTop: '24px' }}>Xem tất cả chuyến bay</button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .flight-item:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
            `}</style>
        </div>
    );
};

export default Home;
