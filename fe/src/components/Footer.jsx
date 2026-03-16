import React from 'react';
import { Link } from 'react-router-dom';

import brandLogo from '../assets/logo.jpg';
import visaLogo from '../assets/visa.jpg';
import momoLogo from '../assets/momo.jpg';
import zalopayLogo from '../assets/zalopay.jpg';
import vietqrLogo from '../assets/vietqr.jpg';
import onepayLogo from '../assets/onepay.jpg';

const Footer = () => {
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .footer {
            background: #1a2e45;
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 72px 5vw 0;
            position: relative;
            overflow: hidden;
        }

        /* subtle horizon glow */
        .footer::before {
            content: '';
            position: absolute;
            top: 0; left: 50%; transform: translateX(-50%);
            width: 70%; height: 1px;
            background: linear-gradient(90deg, transparent, #7ec3ff88, #f0c97a88, transparent);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr 1fr 1fr;
            gap: 48px;
            padding-bottom: 56px;
        }
        @media(max-width:960px){ .footer-grid{ grid-template-columns: 1fr 1fr; } }
        @media(max-width:560px){ .footer-grid{ grid-template-columns: 1fr; } }

        /* Brand col */
        .footer-logo {
            display: flex; align-items: center; gap: 11px;
            text-decoration: none; margin-bottom: 20px;
        }
        .footer-brand-img {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            object-fit: cover;
            border: 1px solid rgba(126,195,255,0.30);
            background: rgba(255,255,255,0.06);
            box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }
        .footer-logo-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 21px; font-weight: 600;
            letter-spacing: 0.10em; color: #fff;
        }
        .footer-logo-dot {
            display: inline-block; width: 5px; height: 5px;
            border-radius: 50%; background: #f0c97a;
            margin-left: 2px; vertical-align: super; font-size: 0;
        }
        .footer-tagline {
            font-size: 13px; color: rgba(255,255,255,0.55);
            line-height: 1.7; margin-bottom: 28px; max-width: 260px;
        }

        /* Social */
        .footer-socials { display: flex; gap: 10px; }
        .footer-social {
            width: 34px; height: 34px; border-radius: 50%;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.18);
            display: flex; align-items: center; justify-content: center;
            color: rgba(255,255,255,0.60);
            font-size: 13px; font-weight: 600;
            text-decoration: none;
            transition: background .18s, color .18s, border-color .18s, transform .18s;
        }
        .footer-social:hover {
            background: rgba(126,195,255,0.25);
            border-color: rgba(126,195,255,0.50);
            color: #7ec3ff;
            transform: translateY(-3px);
        }

        /* Nav cols */
        .footer-col-title {
            font-size: 11px; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: rgba(255,255,255,0.48);
            margin-bottom: 20px;
        }
        .footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 13px; }
        .footer-links a {
            font-size: 13.5px; font-weight: 400;
            color: rgba(255,255,255,0.68);
            text-decoration: none;
            transition: color .18s;
        }
        .footer-links a:hover { color: #fff; }

        /* Payment */
        .footer-pay-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .pay-logo-badge {
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .pay-logo-img {
            height: 18px;
            max-width: 92px;
            object-fit: contain;
            filter: grayscale(18%) contrast(1.05);
            opacity: 0.92;
        }
        .pay-logo-badge:hover .pay-logo-img {
            filter: grayscale(0%) contrast(1.1);
            opacity: 1;
        }

        /* Bottom bar */
        .footer-bar {
            border-top: 1px solid rgba(255,255,255,0.12);
            padding: 22px 0 24px;
            display: flex; align-items: center; justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }
        .footer-copy {
            font-size: 12px; color: rgba(255,255,255,0.40);
        }
        .footer-bar-links { display: flex; gap: 24px; }
        .footer-bar-links a {
            font-size: 12px; color: rgba(255,255,255,0.42);
            text-decoration: none; transition: color .18s;
        }
        .footer-bar-links a:hover { color: rgba(255,255,255,0.75); }
    `;

    return (
        <footer className="footer">
            <style>{css}</style>

            <div className="footer-grid">

                {/* Brand */}
                <div>
                    <Link to="/" className="footer-logo">
                        <img className="footer-brand-img" src={brandLogo} alt="FlyViet" loading="lazy" />
                        <span className="footer-logo-text">FLYVIET<span className="footer-logo-dot" /></span>
                    </Link>
                    <p className="footer-tagline">
                        Trải nghiệm đặt vé máy bay mượt mà, an toàn và luôn có giá tốt nhất.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="footer-social">f</a>
                        <a href="#" className="footer-social">x</a>
                        <a href="#" className="footer-social">in</a>
                        <a href="#" className="footer-social">yt</a>
                    </div>
                </div>

                {/* Company */}
                <div>
                    <p className="footer-col-title">Về chúng tôi</p>
                    <ul className="footer-links">
                        <li><a href="#">Giới thiệu FlyViet</a></li>
                        <li><a href="#">Tin tức & Sự kiện</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <p className="footer-col-title">Hỗ trợ</p>
                    <ul className="footer-links">
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Điều khoản sử dụng</a></li>
                        <li><a href="#">Hướng dẫn đặt vé</a></li>
                    </ul>
                </div>

                {/* Payment */}
                <div>
                    <p className="footer-col-title">Thanh toán an toàn</p>
                    <div className="footer-pay-row">
                        <span className="pay-logo-badge" title="VietQR">
                            <img className="pay-logo-img" src={vietqrLogo} alt="VietQR" loading="lazy" />
                        </span>
                        <span className="pay-logo-badge" title="VISA">
                            <img className="pay-logo-img" src={visaLogo} alt="VISA" loading="lazy" />
                        </span>
                        <span className="pay-logo-badge" title="MoMo">
                            <img className="pay-logo-img" src={momoLogo} alt="MoMo" loading="lazy" />
                        </span>
                        <span className="pay-logo-badge" title="ZaloPay">
                            <img className="pay-logo-img" src={zalopayLogo} alt="ZaloPay" loading="lazy" />
                        </span>
                        <span className="pay-logo-badge" title="OnePay">
                            <img className="pay-logo-img" src={onepayLogo} alt="OnePay" loading="lazy" />
                        </span>
                    </div>
                    <p className="footer-col-title" style={{ marginBottom: 12 }}>Chứng nhận</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🛡️</span>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.58)' }}>ĐÃ THÔNG BÁO BCT</span>
                    </div>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="footer-bar">
                <p className="footer-copy">© {new Date().getFullYear()} FlyViet. Tất cả các quyền được bảo lưu.</p>
                <div className="footer-bar-links">
                    <a href="#">Việt Nam (VNĐ)</a>
                    <a href="#">English</a>
                    <a href="#">Tiếng Việt</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;