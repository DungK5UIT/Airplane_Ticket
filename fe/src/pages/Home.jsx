import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import acbLogo from '../assets/acb.jpg';
import bidvLogo from '../assets/bidv.jpg';
import hdbankLogo from '../assets/hdbank.jpg';
import kbankLogo from '../assets/kbank.jpg';
import mbLogo from '../assets/mb.jpg';
import momoLogo from '../assets/momo.jpg';
import ocbLogo from '../assets/ocb.jpg';
import onepayLogo from '../assets/onepay.jpg';
import sacombankLogo from '../assets/sacombank.jpg';
import seabankLogo from '../assets/seabank.jpg';
import techcombankLogo from '../assets/techcombank.jpg';
import tpbankLogo from '../assets/tpbank.jpg';
import vibLogo from '../assets/vib.jpg';
import vietcombankLogo from '../assets/vietcombank.jpg';
import vietqrLogo from '../assets/vietqr.jpg';
import viettinbankLogo from '../assets/viettinbank.jpg';
import visaLogo from '../assets/visa.jpg';
import vpbankLogo from '../assets/vpbank.jpg';
import zalopayLogo from '../assets/zalopay.jpg';

const Home = () => {
    const [origin, setOrigin] = useState('SGN');
    const [destination, setDestination] = useState('HAN');
    const [pax, setPax] = useState({ adult: 2, child: 1, infant: 0 });
    const [paxOpen, setPaxOpen] = useState(false);
    const paxRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [activeServiceTab, setActiveServiceTab] = useState('Trước khi đặt vé');
    const navigate = useNavigate();
    const totalPassengers = pax.adult + pax.child + pax.infant;

    const paxLabel = (() => {
        const parts = [];
        if (pax.adult) parts.push(`${pax.adult} Người lớn`);
        if (pax.child) parts.push(`${pax.child} Trẻ em`);
        if (pax.infant) parts.push(`${pax.infant} Em bé`);
        return parts.join(', ') || '1 Người lớn';
    })();

    useEffect(() => {
        authService.getCurrentUser();
    }, []);

    useEffect(() => {
        const onDown = (e) => {
            if (!paxOpen) return;
            if (!paxRef.current) return;
            if (!paxRef.current.contains(e.target)) setPaxOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [paxOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const destinations = [
        { name: 'Phú Quốc', tag: 'Đảo ngọc', price: '799.000đ', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80' },
        { name: 'Đà Nẵng', tag: 'Thành phố biển', price: '599.000đ', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80' },
        { name: 'Nha Trang', tag: 'Nghỉ dưỡng', price: '699.000đ', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80' },
        { name: 'Hạ Long', tag: 'Kỳ quan', price: '899.000đ', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
    ];

    const serviceTabs = ['Trước khi đặt vé', 'Khi đặt vé', 'Sau khi đặt vé', 'Lên kế hoạch chuyến đi'];

    const serviceData = {
        'Trước khi đặt vé': [
            {
                title: 'Smart Combo',
                desc: 'Với vé Smart Combo của FlyViet, bạn có thể đặt vé máy bay hạng sang với giá rẻ hơn tới 40%. Tận hưởng chuyến bay với giá cả phải chăng hơn. Trải nghiệm các chuyến bay với Air France, Cathay Pacific, Etihad, KLM, Lufthansa và Singapore Airlines với giá cả phải chăng hơn. Thật dễ dàng: tìm các chuyến bay được đánh dấu Smart Combo, sau đó chọn chuyến bay phù hợp với nhu cầu của bạn.',
                action: 'Tìm hiểu thêm',
                actionLink: '#'
            },
            {
                title: 'Vé máy bay đa thành phố',
                desc: 'Khám phá nhiều thành phố hơn bằng cách đặt vé máy bay trên FlyViet. Bạn có thể đi du lịch đến nhiều điểm đến khác nhau—bay tới đa 5 tuyến đường khác nhau, đặt chân đến 10 thành phố—tất cả trong một lần đặt. Bắt đầu hành trình của bạn bằng cách mở menu Vé máy bay, chọn tùy chọn Đa thành phố, điền các tuyến bay của bạn, sau đó chọn các chuyến bay bạn muốn.'
            },
            {
                title: 'Vé linh hoạt cao',
                desc: 'Kế hoạch du lịch của bạn liên tục thay đổi? Với Vé linh hoạt cao trên FlyViet, bạn có thể thay đổi lịch trình chuyến bay nội địa của mình mà không bị phạt và được hoàn tiền với phí thấp. Mở menu Vé máy bay, điền thông tin chi tiết chuyến bay của bạn, nhấp vào \'Các tùy chọn khác\' ở dưới cùng và chọn \'Linh hoạt cao\' trong các tùy chọn Linh hoạt vé trước khi bạn bắt đầu tìm kiếm chuyến bay của mình.'
            }
        ],
        'Khi đặt vé': [
            {
                title: 'Thanh toán an toàn',
                desc: 'Đảm bảo mọi giao dịch của bạn đều được mã hóa an toàn với các chuẩn quốc tế. FlyViet hỗ trợ đa dạng phương thức thanh toán linh hoạt giúp quá trình đặt vé của bạn nhanh chóng.'
            },
            {
                title: 'Tích điểm thành viên',
                desc: 'Đăng nhập khi đặt vé để tích lũy điểm thưởng. Điểm thưởng có thể được sử dụng để đổi các chuyến bay miễn phí hoặc nhận ưu đãi độc quyền từ mạng lưới đối tác của FlyViet.'
            }
        ],
        'Sau khi đặt vé': [
            {
                title: 'Quản lý đặt chỗ',
                desc: 'Dễ dàng thay đổi thông tin, mua thêm hành lý hoặc nâng hạng ghế sau khi đã hoàn tất đặt vé. Tất cả thao tác chỉ cần thực hiện trực tuyến trên website của FlyViet.'
            },
            {
                title: 'Làm thủ tục trực tuyến',
                desc: 'Tiết kiệm thời gian chờ đợi tại sân bay bằng cách check-in online trước 24 giờ so với giờ bay. Chọn sẵn ghế ngồi ưa thích và nhận thẻ lên tàu bay điện tử sớm nhất.'
            }
        ],
        'Lên kế hoạch chuyến đi': [
            {
                title: 'Cẩm nang du lịch',
                desc: 'Khám phá các mẹo du lịch, gợi ý điểm đến và lịch trình hoàn hảo cho chuyến đi của bạn cùng FlyViet. Các kinh nghiệm được chia sẻ từ những travel blogger hàng đầu.'
            },
            {
                title: 'Combo du lịch',
                desc: 'Tối ưu chi phí bằng cách đặt trọn gói Vé máy bay & Khách sạn. Mức giá ưu đãi đặc biệt khi sử dụng các gói du lịch được thiết kế riêng cho bạn.'
            }
        ]
    };

    const paymentPartners = [
        { name: 'VietQR', src: vietqrLogo },
        { name: 'VISA', src: visaLogo },
        { name: 'MoMo', src: momoLogo },
        { name: 'ZaloPay', src: zalopayLogo },
        { name: 'OnePay', src: onepayLogo },
        { name: 'Vietcombank', src: vietcombankLogo },
        { name: 'BIDV', src: bidvLogo },
        { name: 'VietinBank', src: viettinbankLogo },
        { name: 'Techcombank', src: techcombankLogo },
        { name: 'MB', src: mbLogo },
        { name: 'ACB', src: acbLogo },
        { name: 'TPBank', src: tpbankLogo },
        { name: 'VPBank', src: vpbankLogo },
        { name: 'HDBank', src: hdbankLogo },
        { name: 'OCB', src: ocbLogo },
        { name: 'Sacombank', src: sacombankLogo },
        { name: 'SeABank', src: seabankLogo },
        { name: 'VIB', src: vibLogo },
        { name: 'KBank', src: kbankLogo },
    ];

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        /* ── Hero ── */
        .hero {
            position: relative;
            height: 60vh;
            min-height: 400px;
            max-height: 560px;
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        .hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; object-position: center 40%;
            animation: heroZoom 16s ease-out forwards;
        }
        @keyframes heroZoom { from{transform:scale(1.06)} to{transform:scale(1)} }
        .hero-vignette {
            position: absolute; inset: 0;
            background: linear-gradient(100deg, rgba(11,31,58,.65) 0%, rgba(11,31,58,.25) 45%, rgba(255,255,255,.0) 100%);
        }
        .hero-content {
            position: relative; z-index: 2;
            padding: 0 8vw;
            animation: fadeUp .85s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        /* ── Search bar floated below hero ── */
        .search-band {
            background: transparent;
            padding: 0 5vw 0;
            display: flex;
            justify-content: center;
            position: relative;
            z-index: 10;
        }
        .widget {
            width: min(1120px, 100%);
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 52px rgba(11,31,58,.08), 0 2px 6px rgba(11,31,58,.04);
            padding: 8px;
            display: flex;
            align-items: center;
            margin-top: -36px;
            animation: slideUp .9s .2s ease both;
        }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .w-field {
            flex: 1; min-width: 0;
            display: flex; align-items: center; gap: 12px;
            padding: 14px 20px;
            border-radius: 14px;
            cursor: text;
            transition: background .2s, box-shadow .2s;
        }
        .w-field:hover { background: #f8f9fc; }
        .w-icon { font-size: 18px; flex-shrink: 0; filter: grayscale(100%) opacity(0.4); transition: filter .3s; }
        .w-field:hover .w-icon { filter: grayscale(0%) opacity(1); }
        .w-label {
            display: block;
            font-size: 10px; font-weight: 700;
            letter-spacing: .15em; text-transform: uppercase;
            color: #7a869a; margin-bottom: 2px;
        }
        .w-input {
            border: none; outline: none; background: transparent;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px; font-weight: 600; color: #0b1f3a;
            width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .w-sep { width: 1px; height: 32px; background: #ede8e0; flex-shrink: 0; }

        /* ── Passenger popover (Home widget) ── */
        .w-pax-btn{
            width: 100%;
            border: none; outline: none; background: transparent;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px; font-weight: 600; color: #0b1f3a;
            display: flex; align-items: center; justify-content: space-between;
            gap: 10px;
            padding: 0;
            cursor: pointer;
            text-align: left;
        }
        .w-pax-chev { opacity: .55; flex-shrink: 0; }
        .w-pax-pop{
            position: absolute;
            top: calc(100% + 10px);
            right: 10px;
            width: 340px;
            max-width: min(340px, 92vw);
            background: #fff;
            border: 1px solid rgba(11,31,58,.10);
            border-radius: 16px;
            box-shadow: 0 26px 80px -46px rgba(11,31,58,.55);
            padding: 12px;
            z-index: 50;
        }
        .w-pax-head{
            display:flex; align-items:center; justify-content:space-between;
            gap:10px;
            padding: 6px 6px 10px;
            border-bottom: 1px solid #f1f5f9;
            margin-bottom: 8px;
        }
        .w-pax-title{
            font-size: 12.5px;
            font-weight: 800;
            color: #0b1f3a;
            letter-spacing: .02em;
        }
        .w-pax-close{
            width: 30px; height: 30px;
            border-radius: 999px;
            border: 1px solid rgba(11,31,58,.10);
            background: #fff;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            display:flex; align-items:center; justify-content:center;
            color: #0b1f3a;
        }
        .w-pax-row{
            display:flex; align-items:center; justify-content:space-between;
            gap: 12px;
            padding: 12px 10px;
            border-radius: 12px;
        }
        .w-pax-row:hover{ background:#f8f9fc; }
        .w-pax-left{ display:grid; gap:2px; }
        .w-pax-name{ font-size: 14px; font-weight: 800; color:#0b1f3a; }
        .w-pax-desc{ font-size: 12px; font-weight: 700; color:#7a869a; }
        .w-pax-ctrl{ display:flex; align-items:center; gap: 12px; }
        .w-step{
            width: 34px; height: 34px;
            border-radius: 999px;
            border: 1px solid rgba(11,31,58,.12);
            background: #fff;
            cursor: pointer;
            font-weight: 900;
            display:flex; align-items:center; justify-content:center;
            transition: transform .12s, background .15s;
        }
        .w-step:hover:not(:disabled){ background:#fff; transform: translateY(-1px); }
        .w-step:disabled{ opacity:.45; cursor:not-allowed; }
        .w-pax-num{ width: 26px; text-align:center; font-weight: 900; color: #ef4444; }
        .w-pax-foot{
            display:flex; align-items:center; justify-content:space-between;
            gap: 10px;
            padding: 10px 6px 6px;
            border-top: 1px solid #f1f5f9;
            margin-top: 8px;
        }
        .w-pax-note{ font-size: 12px; font-weight: 700; color:#7a869a; line-height: 1.4; }
        .w-pax-done{
            height: 36px;
            padding: 0 14px;
            border-radius: 12px;
            border: none;
            background: #0b1f3a;
            color: #fff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            white-space: nowrap;
        }
        @media(max-width:900px){
            .w-pax-pop{ right: 0; width: 100%; max-width: 100%; }
        }
        .w-btn {
            flex-shrink: 0; margin: 6px;
            padding: 16px 32px;
            background: #f0c97a; color: #0b1f3a;
            border: none; border-radius: 14px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px; font-weight: 700; letter-spacing: .02em;
            cursor: pointer; white-space: nowrap;
            display: flex; align-items: center; gap: 8px;
            transition: background .18s, transform .14s, box-shadow .18s;
            box-shadow: 0 4px 14px rgba(240,201,122,0.3);
        }
        .w-btn:hover { background: #f3d492; transform: scale(1.02); box-shadow: 0 6px 20px rgba(240,201,122,0.4); }
        .w-btn:active { transform: scale(.98); }
        .w-spinner {
            width: 16px; height: 16px;
            border: 2px solid rgba(255,255,255,.25);
            border-top-color: #fff; border-radius: 50%;
            animation: spin .7s linear infinite;
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* ── Destinations ── */
        .dest-grid {
            display: grid;
            grid-template-columns: repeat(4,1fr);
            gap: 20px;
        }
        @media(max-width:1100px){.dest-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.dest-grid{grid-template-columns:1fr}}

        .dest-card {
            background: #fff; border-radius: 20px; overflow: hidden;
            border: 1px solid rgba(11,31,58,.05);
            display: flex; flex-direction: column;
            transition: transform .35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow .35s cubic-bezier(0.4, 0, 0.2, 1);
            animation: cardIn .65s calc(var(--i,0)*.1s) ease both;
        }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .dest-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(11,31,58,.12); }
        .dest-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .dest-img-wrap img { width:100%; height:100%; object-fit:cover; transition: transform .55s; }
        .dest-card:hover .dest-img-wrap img { transform: scale(1.08); }
        .dest-scrim { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.28) 0%,transparent 55%); }
        .dest-pill {
            position:absolute; top:13px; left:13px;
            background:rgba(255,255,255,.9); color:#1c1a17;
            font-size:10.5px; font-weight:500; padding:3px 11px; border-radius:100px;
        }
        .dest-btn {
            display:flex; align-items:center; gap:6px;
            padding: 10px 18px;
            background: rgba(74,158,255,0.1); color: #0b1f3a; border:none; border-radius:100px;
            font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600;
            cursor:pointer; transition: background .2s, gap .2s, transform .14s, color .2s;
        }
        .dest-card:hover .dest-btn { gap:10px; background: #0b1f3a; color: #fff; }
        .dest-btn:active { transform: scale(.97); }

        /* ── Service Info Section ── */
        .service-section {
            padding: 40px 8vw 100px;
            display: flex; flex-direction: column; align-items: center;
            background: #fff;
        }
        .service-container {
            width: 100%;
            max-width: 1200px;
        }
        .service-title {
            font-size: 24px;
            font-weight: 700;
            color: #0b1f3a;
            margin-bottom: 24px;
        }
        .service-tabs {
            display: flex;
            border-bottom: 1px solid #e0e4eb;
            margin-bottom: 30px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .service-tabs::-webkit-scrollbar { display: none; }
        .service-tab {
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            color: #0194f3;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: border-bottom-color 0.2s;
            white-space: nowrap;
            margin-bottom: -1px;
        }
        .service-tab.active {
            border-bottom-color: #00ca45;
        }
        .service-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
        @media(max-width:900px){.service-cards{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.service-cards{grid-template-columns:1fr}}
        .service-card {
            background: #fff;
            border: 1px solid #e0e4eb;
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            transition: box-shadow 0.2s;
        }
        .service-card:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .service-card-title {
            font-size: 18px;
            font-weight: 700;
            color: #434343;
            margin-bottom: 16px;
        }
        .service-card-desc {
            font-size: 14px;
            color: #687176;
            line-height: 1.6;
            flex-grow: 1;
        }
        .service-card-action {
            margin-top: 24px;
            align-self: flex-start;
            padding: 8px 16px;
            background: #0194f3;
            color: #fff;
            border-radius: 18px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s;
        }
        .service-card-action:hover {
            background: #007bc4;
        }

        /* ── Payment partners ── */
        .pay-section {
            padding: 0 8vw 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .pay-heading {
            width: 100%;
            max-width: 1200px;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 26px;
        }
        @media(max-width:720px){.pay-heading{flex-direction:column;align-items:flex-start}}
        .pay-title {
            font-size: clamp(28px,4vw,44px);
            font-weight: 700;
            color: #0b1f3a;
            line-height: 1.12;
            margin: 0;
        }
        .pay-subtitle {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            color: #7a869a;
            line-height: 1.6;
            max-width: 520px;
        }
        .pay-grid {
            width: 100%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 14px;
        }
        @media(max-width:1100px){.pay-grid{grid-template-columns:repeat(4,1fr)}}
        @media(max-width:720px){.pay-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:420px){.pay-grid{grid-template-columns:repeat(2,1fr)}}
        .pay-card {
            background: rgba(255,255,255,0.9);
            border: 1px solid rgba(11,31,58,.06);
            border-radius: 16px;
            padding: 14px 16px;
            height: 76px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 24px rgba(11,31,58,0.03);
            transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .pay-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 34px rgba(11,31,58,0.07);
            border-color: rgba(11,31,58,.10);
        }
        .pay-logo {
            max-width: 100%;
            max-height: 42px;
            object-fit: contain;
            filter: grayscale(25%) contrast(1.05);
            opacity: .92;
            transition: filter .2s ease, opacity .2s ease, transform .2s ease;
        }
        .pay-card:hover .pay-logo {
            filter: grayscale(0%) contrast(1.08);
            opacity: 1;
            transform: scale(1.02);
        }
    `;

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fafafc', color: '#0b1f3a', minHeight: '100vh', letterSpacing: '-0.01em' }}>
            <style>{css}</style>

            <Navbar transparent={true} />

            {/* ── Hero ── */}
            <section className="hero">
                <img
                    className="hero-bg"
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-may-bay-tren-bau-troi-inkythuatso-1-07-11-33-06.jpg"
                    alt="Hình ảnh máy bay trên bầu trời xanh"
                />
                <div className="hero-vignette" />
                <div className="hero-content" style={{ paddingBottom: '80px', paddingTop: '40px' }}>
                    <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.42)', marginBottom: 16 }}>
                        ✈ Bay không giới hạn
                    </p>
                    <h1 style={{ fontSize: 'clamp(46px,7vw,88px)', fontWeight: 700, color: '#fff', lineHeight: 1.0, marginBottom: 18, letterSpacing: '-0.01em' }}>
                        Bay muôn nơi,<br />
                        <em style={{ fontStyle: 'italic', fontWeight: 600, color: '#f0c97a' }}>đón nắng mới</em>
                    </h1>
                    <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,.55)', maxWidth: 340, lineHeight: 1.65 }}>
                        Trải nghiệm hành trình tuyệt vời cùng sự mượt mà trong từng lần chạm.
                    </p>
                </div>
            </section>

            {/* ── Search Widget (below hero, overlaps slightly) ── */}
            <div className="search-band">
                <form className="widget" onSubmit={handleSearch}>
                    <div className="w-field">
                        <span className="w-icon">🛫</span>
                        <div style={{ minWidth: 0 }}>
                            <label className="w-label">Từ</label>
                            <input className="w-input" type="text" value={origin} onChange={e => setOrigin(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-sep" />
                    <div className="w-field">
                        <span className="w-icon">🛬</span>
                        <div style={{ minWidth: 0 }}>
                            <label className="w-label">Đến</label>
                            <input className="w-input" type="text" value={destination} onChange={e => setDestination(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-sep" />
                    <div className="w-field">
                        <span className="w-icon">📅</span>
                        <div style={{ minWidth: 0 }}>
                            <label className="w-label">Ngày đi</label>
                            <input className="w-input" type="date" />
                        </div>
                    </div>
                    <div className="w-sep" />
                    <div className="w-field">
                        <span className="w-icon">📅</span>
                        <div style={{ minWidth: 0 }}>
                            <label className="w-label">Ngày về</label>
                            <input className="w-input" type="date" />
                        </div>
                    </div>
                    <div className="w-sep" />
                    <div className="w-field" style={{ position: 'relative' }} ref={paxRef}>
                        <span className="w-icon">👥</span>
                        <div style={{ minWidth: 0 }}>
                            <label className="w-label">Hành khách</label>
                            <button
                                type="button"
                                className="w-pax-btn"
                                onClick={() => setPaxOpen((v) => !v)}
                                aria-haspopup="dialog"
                                aria-expanded={paxOpen}
                            >
                                <span className="w-input" style={{ width: '100%' }}>{paxLabel}</span>
                                <svg className="w-pax-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                        </div>

                        {paxOpen && (
                            <div className="w-pax-pop" role="dialog" aria-label="Chọn hành khách">
                                <div className="w-pax-head">
                                    <div className="w-pax-title">Yêu cầu trợ giúp đặc biệt</div>
                                    <button type="button" className="w-pax-close" onClick={() => setPaxOpen(false)} aria-label="Đóng">×</button>
                                </div>

                                {[
                                    { key: 'adult', name: 'Người lớn', desc: '12 tuổi trở lên', min: 1 },
                                    { key: 'child', name: 'Trẻ em', desc: '2–11 tuổi', min: 0 },
                                    { key: 'infant', name: 'Em bé', desc: 'Dưới 2 tuổi', min: 0 }
                                ].map((row) => {
                                    const value = pax[row.key];
                                    const canDec = value > row.min;
                                    const canIncTotal = totalPassengers < 20;
                                    const canIncInfant = row.key !== 'infant' || pax.infant < pax.adult;
                                    const canInc = canIncTotal && canIncInfant;

                                    return (
                                        <div className="w-pax-row" key={row.key}>
                                            <div className="w-pax-left">
                                                <div className="w-pax-name">{row.name}</div>
                                                <div className="w-pax-desc">{row.desc}</div>
                                            </div>
                                            <div className="w-pax-ctrl">
                                                <button
                                                    type="button"
                                                    className="w-step"
                                                    disabled={!canDec}
                                                    onClick={() => {
                                                        setPax((prev) => {
                                                            const next = { ...prev, [row.key]: prev[row.key] - 1 };
                                                            if (next.adult < 1) next.adult = 1;
                                                            if (next.infant > next.adult) next.infant = next.adult;
                                                            return next;
                                                        });
                                                    }}
                                                    aria-label={`Giảm ${row.name}`}
                                                >
                                                    −
                                                </button>
                                                <div className="w-pax-num">{value}</div>
                                                <button
                                                    type="button"
                                                    className="w-step"
                                                    disabled={!canInc}
                                                    onClick={() => setPax((prev) => ({ ...prev, [row.key]: prev[row.key] + 1 }))}
                                                    aria-label={`Tăng ${row.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="w-pax-foot">
                                    <div className="w-pax-note">
                                        Tối đa 20 hành khách. Em bé không vượt quá số người lớn.
                                    </div>
                                    <button type="button" className="w-pax-done" onClick={() => setPaxOpen(false)}>Xong</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="w-btn" disabled={loading}>
                        {loading
                            ? <div className="w-spinner" />
                            : <>Tìm chuyến bay <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                        }
                    </button>
                </form>
            </div>

            {/* ── Destinations ── */}
            <section style={{ padding: '90px 8vw 100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: 54 }}>
                    <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4a9eff', marginBottom: 16, padding: '6px 18px', background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.2)', borderRadius: '100px' }}>
                        Khám phá
                    </span>
                    <h2 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 700, color: '#0b1f3a', lineHeight: 1.15 }}>
                        Điểm đến nổi bật<br />tháng này
                    </h2>
                </div>
                <div className="dest-grid" style={{ width: '100%', maxWidth: 1200 }}>
                    {destinations.map((dest, i) => (
                        <div key={i} className="dest-card" style={{ '--i': i }}>
                            <div className="dest-img-wrap">
                                <img src={dest.img} alt={dest.name} loading="lazy" />
                                <div className="dest-scrim" />
                                <span className="dest-pill">{dest.tag}</span>
                            </div>
                            <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0b1f3a', marginBottom: 6 }}>{dest.name}</h3>
                                <p style={{ fontSize: 13, color: '#7a869a', letterSpacing: '0.02em', marginBottom: 20, flex: 1, fontWeight: 500 }}>Chuyến bay giá rẻ · Bay thẳng</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a0acbd', marginBottom: 2, fontWeight: 600 }}>Chỉ từ</p>
                                        <p style={{ fontSize: 19, fontWeight: 700, color: '#0b1f3a' }}>{dest.price}</p>
                                    </div>
                                    <button className="dest-btn">
                                        Đặt ngay
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Service Info Section ── */}
            <section className="service-section">
                <div className="service-container">
                    <h2 className="service-title">Dịch vụ chuyến bay tại FlyViet</h2>
                    <div className="service-tabs">
                        {serviceTabs.map(tab => (
                            <div
                                key={tab}
                                className={`service-tab ${activeServiceTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveServiceTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    <div className="service-cards">
                        {serviceData[activeServiceTab].map((item, index) => (
                            <div key={index} className="service-card">
                                <h3 className="service-card-title">{item.title}</h3>
                                <p className="service-card-desc">{item.desc}</p>
                                {item.action && (
                                    <a href={item.actionLink || '#'} className="service-card-action">
                                        {item.action}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Payment partners ── */}
            <section className="pay-section">
                <div className="pay-heading">
                    <h2 className="pay-title">Đối tác thanh toán</h2>
                    <p className="pay-subtitle">
                        Hỗ trợ đa dạng phương thức thanh toán: thẻ quốc tế, ví điện tử và chuyển khoản nhanh qua VietQR.
                    </p>
                </div>
                <div className="pay-grid" aria-label="Danh sách đối tác thanh toán">
                    {paymentPartners.map((p) => (
                        <div key={p.name} className="pay-card" title={p.name}>
                            <img className="pay-logo" src={p.src} alt={p.name} loading="lazy" />
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;

