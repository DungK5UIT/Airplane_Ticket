import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import logoImg from '../assets/logo.jpg'; // Đảm bảo file img1.png (hoặc .jpg) đã có trong thư mục src/assets

const Navbar = ({ transparent = false }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    const solid = !transparent || scrolled;

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .navbar {
            position: fixed; top: 0; left: 0; right: 0;
            z-index: 100;
            padding: 0 5vw;
            height: 66px;
            display: flex; align-items: center; justify-content: space-between;
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: background .38s ease, box-shadow .38s ease;
        }
        .navbar.solid {
            background: #0b1f3a;
            box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.25);
        }
        .navbar.glass {
            background: rgba(6,14,28,0.22);
            backdrop-filter: blur(14px);
        }
        .navbar::after {
            content: '';
            position: absolute; bottom: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #4a9eff 35%, #f0c97a 65%, transparent 100%);
            opacity: 0;
            transition: opacity .38s;
        }
        .navbar.solid::after { opacity: 1; }

        .nav-logo {
            display: flex; align-items: center; gap: 11px;
            text-decoration: none;
        }
        .nav-logo-icon {
            width: 36px; height: 36px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 16px;
            background: rgba(74,158,255,0.18);
            border: 1px solid rgba(74,158,255,0.30);
            transition: transform .22s, background .2s;
        }
        .nav-logo:hover .nav-logo-icon {
            transform: rotate(-10deg) scale(1.08);
            background: rgba(74,158,255,0.28);
        }
        .nav-logo-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 22px; font-weight: 600;
            letter-spacing: 0.10em;
            color: #fff;
        }
        .nav-logo-dot {
            display: inline-block;
            width: 5px; height: 5px; border-radius: 50%;
            background: #f0c97a;
            margin-left: 2px;
            vertical-align: super; font-size: 0;
        }

        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-link {
            text-decoration: none;
            font-size: 13px; font-weight: 500;
            color: rgba(255,255,255,0.60);
            padding: 7px 15px; border-radius: 100px;
            letter-spacing: 0.025em;
            transition: background .18s, color .18s;
        }
        .nav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .nav-link.active { color: #fff; background: rgba(74,158,255,0.15); }

        .nav-right { display: flex; align-items: center; gap: 8px; }
        .nav-divider { width:1px; height:18px; background:rgba(255,255,255,0.12); margin:0 4px; }

        .nav-user-name { font-size:13px; font-weight:500; color:#fff; text-align:right; }
        .nav-user-email { font-size:11px; color:rgba(255,255,255,0.38); text-align:right; }

        .nav-btn-ghost {
            padding: 8px 18px; border-radius: 100px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px; font-weight: 500;
            color: rgba(255,255,255,0.75);
            background: transparent;
            border: 1px solid rgba(255,255,255,0.18);
            cursor: pointer; text-decoration: none;
            display: flex; align-items: center;
            letter-spacing: 0.02em;
            transition: background .18s, color .18s, border-color .18s;
        }
        .nav-btn-ghost:hover {
            background: rgba(255,255,255,0.08);
            color: #fff;
            border-color: rgba(255,255,255,0.32);
        }

        .nav-btn-cta {
            padding: 8px 22px; border-radius: 100px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px; font-weight: 600;
            background: #f0c97a; color: #0b1f3a;
            border: none; cursor: pointer;
            text-decoration: none;
            display: flex; align-items: center;
            letter-spacing: 0.02em;
            transition: background .18s, transform .14s, box-shadow .18s;
            box-shadow: 0 2px 12px rgba(240,201,122,0.28);
        }
        .nav-btn-cta:hover {
            background: #f5d48e;
            transform: scale(1.03);
            box-shadow: 0 4px 20px rgba(240,201,122,0.45);
        }
        .nav-btn-cta:active { transform: scale(.98); }

        @media(max-width:700px){
            .nav-links { display: none; }
            .nav-user-email { display: none; }
        }
    `;

    return (
        <>
            <style>{css}</style>
            <nav className={`navbar ${solid ? 'solid' : 'glass'}`}>

                <Link to="/" className="nav-logo">
                    <div className="nav-logo-icon" style={{ background: 'transparent', border: 'none', width: '36px', height: '36px' }}>
                        <img src={logoImg} alt="FlyViet Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    </div>
                    <span className="nav-logo-text">FLYVIET<span className="nav-logo-dot" /></span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Trang chủ</Link>
                    <Link to="/flight" className={`nav-link ${location.pathname === '/flight' ? 'active' : ''}`}>Chuyến bay</Link>
                    <a href="#" className="nav-link">Ưu đãi</a>
                </div>

                <div className="nav-right">
                    {user ? (
                        <>
                            <div>
                                <p className="nav-user-name">{user.name || 'User'}</p>
                                <p className="nav-user-email">{user.email}</p>
                            </div>
                            <div className="nav-divider" />
                            <button onClick={handleLogout} className="nav-btn-ghost">Đăng xuất</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-btn-ghost">Đăng nhập</Link>
                            <Link to="/register" className="nav-btn-cta">Đăng ký</Link>
                        </>
                    )}
                </div>

            </nav>
        </>
    );
};

export default Navbar;