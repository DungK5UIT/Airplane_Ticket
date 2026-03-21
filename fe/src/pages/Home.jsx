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
    const [departureDate, setDepartureDate] = useState('');
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
        navigate('/flight', {
            state: {
                origin: origin.trim(),
                destination: destination.trim(),
                date: departureDate,
                pax,
            },
        });
        setLoading(false);
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
                desc: 'Với vé Smart Combo của FlyViet, bạn có thể đặt vé máy bay hạng sang với giá rẻ hơn tới 40%. Tận hưởng chuyến bay với giá cả phải chăng hơn. Trải nghiệm các chuyến bay với Air France, Cathay Pacific, Etihad, KLM, Lufthansa và Singapore Airlines với giá cả phải chăng hơn. Thật dễ dàng: tìm các chuyến bay được đánh dấu Smart Combo, sau đó chọn chuyến bay phù hợp với nhu cầu của bạn.'
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar transparent={true} />

            <section className="relative flex min-h-[420px] items-center overflow-hidden sm:min-h-[520px]">
                <img
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-may-bay-tren-bau-troi-inkythuatso-1-07-11-33-06.jpg"
                    alt="Hình ảnh máy bay trên bầu trời xanh"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 to-slate-900/20" />
                <div className="relative z-10 px-[8vw] py-12">
                    <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white/60">✈ Bay không giới hạn</p>
                    <h1 className="mb-4 text-5xl font-black leading-tight text-white sm:text-7xl">
                        Bay muôn nơi,<br />
                        <em className="font-semibold text-amber-300">đón nắng mới</em>
                    </h1>
                    <p className="max-w-sm text-sm font-medium leading-7 text-white/80">
                        Trải nghiệm hành trình tuyệt vời cùng sự mượt mà trong từng lần chạm.
                    </p>
                </div>
            </section>

            <div className="relative z-20 -mt-8 px-[5vw]">
                <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="min-w-[150px] flex-1 rounded-xl px-4 py-3 hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Từ</label>
                        <input className="w-full bg-transparent text-sm font-semibold outline-none" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                    </div>
                    <div className="min-w-[150px] flex-1 rounded-xl px-4 py-3 hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Đến</label>
                        <input className="w-full bg-transparent text-sm font-semibold outline-none" value={destination} onChange={(e) => setDestination(e.target.value)} />
                    </div>
                    <div className="min-w-[140px] flex-1 rounded-xl px-4 py-3 hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Ngày đi</label>
                        <input className="w-full bg-transparent text-sm font-semibold outline-none" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                    </div>
                    <div className="relative min-w-[210px] flex-1 rounded-xl px-4 py-3 hover:bg-slate-50" ref={paxRef}>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Hành khách</label>
                        <button type="button" className="flex w-full items-center justify-between text-left text-sm font-semibold" onClick={() => setPaxOpen((v) => !v)}>
                            <span>{paxLabel}</span>
                            <span className="opacity-60">▾</span>
                        </button>
                        {paxOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-black text-slate-700">Yêu cầu trợ giúp đặc biệt</span>
                                    <button type="button" className="h-7 w-7 rounded-full border border-slate-200" onClick={() => setPaxOpen(false)}>×</button>
                                </div>
                                {[
                                    { key: 'adult', name: 'Người lớn', desc: '12 tuổi trở lên', min: 1 },
                                    { key: 'child', name: 'Trẻ em', desc: '2-11 tuổi', min: 0 },
                                    { key: 'infant', name: 'Em bé', desc: 'Dưới 2 tuổi', min: 0 },
                                ].map((row) => {
                                    const value = pax[row.key];
                                    const canDec = value > row.min;
                                    const canIncTotal = totalPassengers < 20;
                                    const canIncInfant = row.key !== 'infant' || pax.infant < pax.adult;
                                    const canInc = canIncTotal && canIncInfant;
                                    return (
                                        <div key={row.key} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{row.name}</p>
                                                <p className="text-xs font-semibold text-slate-400">{row.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button type="button" disabled={!canDec} onClick={() => {
                                                    setPax((prev) => {
                                                        const next = { ...prev, [row.key]: prev[row.key] - 1 };
                                                        if (next.adult < 1) next.adult = 1;
                                                        if (next.infant > next.adult) next.infant = next.adult;
                                                        return next;
                                                    });
                                                }} className="h-8 w-8 rounded-full border border-slate-200 font-bold disabled:opacity-40">-</button>
                                                <span className="w-6 text-center text-sm font-black text-slate-900">{value}</span>
                                                <button type="button" disabled={!canInc} onClick={() => setPax((prev) => ({ ...prev, [row.key]: prev[row.key] + 1 }))} className="h-8 w-8 rounded-full border border-slate-200 font-bold disabled:opacity-40">+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button type="button" className="mt-2 h-9 w-full rounded-xl bg-slate-900 text-sm font-bold text-white" onClick={() => setPaxOpen(false)}>Xong</button>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="m-1 inline-flex h-12 items-center gap-2 rounded-xl bg-amber-300 px-5 text-sm font-black text-slate-900 shadow hover:bg-amber-200" disabled={loading}>
                        {loading ? 'Đang tải...' : 'Tìm chuyến bay'}
                    </button>
                </form>
            </div>

            <section className="px-[8vw] pb-24 pt-20">
                <div className="mb-10 text-center">
                    <span className="mb-4 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600">Khám phá</span>
                    <h2 className="text-4xl font-black text-slate-900 sm:text-5xl">Điểm đến nổi bật<br />tháng này</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {destinations.map((dest) => (
                        <div key={dest.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="relative h-48 overflow-hidden">
                                <img src={dest.img} alt={dest.name} loading="lazy" className="h-full w-full object-cover" />
                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold">{dest.tag}</span>
                            </div>
                            <div className="p-5">
                                <h3 className="text-2xl font-black text-slate-900">{dest.name}</h3>
                                <p className="mb-4 mt-1 text-sm font-semibold text-slate-400">Chuyến bay giá rẻ · Bay thẳng</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Chỉ từ</p>
                                        <p className="text-lg font-black text-slate-900">{dest.price}</p>
                                    </div>
                                    <button className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white">Đặt ngay</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white px-[8vw] py-16">
                <div className="mx-auto max-w-[1200px]">
                    <h2 className="mb-6 text-2xl font-black text-slate-900">Dịch vụ chuyến bay tại FlyViet</h2>
                    <div className="mb-6 flex overflow-x-auto border-b border-slate-200">
                        {serviceTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveServiceTab(tab)}
                                className={`-mb-px whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold ${activeServiceTab === tab ? 'border-green-500 text-slate-900' : 'border-transparent text-blue-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {serviceData[activeServiceTab].map((item, index) => (
                            <div key={index} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6">
                                <h3 className="mb-3 text-lg font-black text-slate-800">{item.title}</h3>
                                <p className="flex-1 text-sm leading-6 text-slate-500">{item.desc}</p>
                                {item.action && <a href={item.actionLink || '#'} className="mt-5 inline-block rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white">{item.action}</a>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-[8vw] pb-24 pt-14">
                <div className="mx-auto mb-6 flex max-w-[1200px] flex-wrap items-end justify-between gap-3">
                    <h2 className="text-4xl font-black text-slate-900">Đối tác thanh toán</h2>
                    <p className="max-w-[520px] text-sm font-medium text-slate-500">
                        Hỗ trợ đa dạng phương thức thanh toán: thẻ quốc tế, ví điện tử và chuyển khoản nhanh qua VietQR.
                    </p>
                </div>
                <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {paymentPartners.map((p) => (
                        <div key={p.name} className="flex h-[76px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:-translate-y-0.5 hover:shadow">
                            <img src={p.src} alt={p.name} loading="lazy" className="max-h-10 w-full object-contain" />
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;

