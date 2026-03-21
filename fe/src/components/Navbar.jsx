import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import logoImg from '../assets/logo.jpg';

const Navbar = ({ transparent = false }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
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
        setMenuOpen(false);
        navigate('/login');
    };

    const solid = !transparent || scrolled;
    const profile = user?.user || user || {};
    const userRole = profile?.role || user?.role || '';
    const isAdmin = userRole === 'ADMIN';
    const navBaseLink = "rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-wide transition !text-white visited:!text-white";
    const navInactive = "hover:bg-white/10";
    const navActive = "bg-white/15 ring-1 ring-white/25 shadow-sm hover:bg-white/20";

    return (
        <nav
            className={`fixed left-0 right-0 top-0 z-[100] h-[66px] px-[5vw] transition ${
                solid
                    ? 'bg-slate-900/95 shadow-[0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(2,6,23,0.45)]'
                    : 'bg-slate-900/70 backdrop-blur-md'
            }`}
        >
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent transition ${solid ? 'opacity-100' : 'opacity-0'}`} />
            <div className="flex h-full items-center justify-between">
                <Link to="/" className="group flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg">
                        <img src={logoImg} alt="FlyViet Logo" className="h-full w-full rounded-lg object-contain transition group-hover:scale-105" />
                    </div>
                    <span className="font-serif text-[22px] font-semibold tracking-[0.1em] text-white">
                        FLYVIET<span className="ml-0.5 inline-block h-1.5 w-1.5 align-super rounded-full bg-amber-300" />
                    </span>
                </Link>

                <div className="hidden items-center gap-0.5 sm:flex">
                    <Link to="/" className={`${navBaseLink} ${location.pathname === '/' ? navActive : navInactive}`}>Trang chủ</Link>
                    <Link to="/flight" className={`${navBaseLink} ${location.pathname === '/flight' ? navActive : navInactive}`}>Chuyến bay</Link>
                    {user && !isAdmin && (
                        <Link to="/orders" className={`${navBaseLink} ${location.pathname === '/orders' ? navActive : navInactive}`}>Chuyến bay của tôi</Link>
                    )}
                    {user && isAdmin && (
                        <Link to="/admin/dashboard" className={`${navBaseLink} ${location.pathname === '/admin/dashboard' ? navActive : navInactive}`}>Quản lý FlightTicket</Link>
                    )}
                    <a href="#" className={`${navBaseLink} ${navInactive}`}>Ưu đãi</a>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-2 py-1.5 text-white transition hover:bg-white/15"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-300/50 bg-sky-400/30 text-[11px] font-extrabold">
                                    {(profile.name || profile.email || 'U').toString().trim().charAt(0).toUpperCase() || 'U'}
                                </span>
                                <svg className={`h-4 w-4 opacity-80 transition ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-[calc(100%+8px)] z-[200] w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl" role="menu">
                                    {!isAdmin && <Link to="/profile" className="block rounded-lg px-3 py-2.5 text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Hồ sơ</Link>}
                                    {!isAdmin && <Link to="/orders" className="block rounded-lg px-3 py-2.5 text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Chuyến bay của tôi</Link>}
                                    {!isAdmin && <Link to="/notifications" className="block rounded-lg px-3 py-2.5 text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Thông báo</Link>}
                                    {!isAdmin && <Link to="/support" className="block rounded-lg px-3 py-2.5 text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Hỗ trợ</Link>}
                                    {isAdmin && <Link to="/admin/dashboard" className="block rounded-lg px-3 py-2.5 text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Quản lý FlightTicket</Link>}
                                    <div className="my-1 h-px bg-slate-100" />
                                    <button type="button" className="block w-full rounded-lg px-3 py-2.5 text-left text-[13.5px] font-bold text-slate-900 hover:bg-slate-50" onClick={handleLogout}>Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-full border border-white/40 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-white hover:bg-white/10">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="rounded-full bg-amber-300 px-5 py-2 text-[13px] font-semibold text-slate-900 shadow-[0_2px_12px_rgba(240,201,122,0.28)] transition hover:bg-amber-200">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;