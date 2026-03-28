import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Support = () => {
    const faqData = [
        { q: 'Làm thế nào để đặt vé máy bay?', a: 'Bạn chỉ cần tìm kiếm chuyến bay trên Trang chủ, chọn vé phù hợp và tiến hành điền thông tin khách hàng để thanh toán.' },
        { q: 'Tôi có thể đổi hoặc hoàn vé không?', a: 'Có, tùy thuộc vào hạng vé bạn đã chọn. Vui lòng liên hệ hotline 1900 1234 để được hỗ trợ cụ thể.' },
        { q: 'FlyViet hỗ trợ những phương thức thanh toán nào?', a: 'Chúng tôi hỗ trợ chuyển khoản ngân hàng, thẻ tín dụng (Visa/Mastercard) và các ví điện tử phổ biến.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-100">
            <Navbar transparent={false} />
            
            <main className="mx-auto max-w-5xl px-6 pt-32 pb-24">
                <header className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-amber-600">
                        Phòng hỗ trợ FlyViet
                    </span>
                    <h1 className="mb-6 text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                        Chúng tôi có thể <br />
                        <span className="text-amber-500 underline decoration-amber-200 underline-offset-8">giúp gì cho bạn?</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
                        Đội ngũ CSKH chuyên nghiệp của FlyViet luôn sẵn sàng giải đáp mọi thắc mắc 24/7 để hành trình của bạn thêm phần trọn vẹn.
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-1">
                            <h2 className="mb-8 text-2xl font-black text-slate-900">Thông tin liên hệ</h2>
                            <div className="space-y-8">
                                <ContactItem 
                                    icon="phone" 
                                    title="Đường dây nóng" 
                                    value="1900 1234" 
                                    sub="24/7 - Luôn sẵn sàng" 
                                />
                                <ContactItem 
                                    icon="mail" 
                                    title="Hỗ trợ qua thư" 
                                    value="support@flyviet.vn" 
                                    sub="Phản hồi trong 2 giờ" 
                                />
                                <ContactItem 
                                    icon="clock" 
                                    title="Giờ làm việc" 
                                    value="08:00 - 22:00" 
                                    sub="Thứ 2 - Chủ nhật" 
                                />
                            </div>
                        </section>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-6">
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
                            <h2 className="mb-8 text-2xl font-black text-slate-900">Câu hỏi thường gặp</h2>
                            <div className="divide-y divide-slate-100">
                                {faqData.map((faq, idx) => (
                                    <div key={idx} className="py-6 first:pt-0 last:pb-0">
                                        <h3 className="mb-3 text-lg font-bold text-slate-900">{faq.q}</h3>
                                        <p className="text-sm font-medium leading-relaxed text-slate-500">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-16 rounded-[2.5rem] bg-slate-900 p-12 text-center text-white shadow-2xl">
                    <h2 className="mb-4 text-3xl font-black">Chưa tìm thấy câu trả lời?</h2>
                    <p className="mb-8 text-white/60">Đừng ngần ngại chat trực tiếp với chúng tôi để nhận được sự tư vấn tận tâm nhất.</p>
                    <button className="rounded-2xl bg-amber-500 px-10 py-4 text-lg font-black text-white shadow-xl shadow-amber-500/20 transition-all hover:scale-105 hover:bg-amber-400">
                        Chat trực tuyến ngay
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const ContactItem = ({ icon, title, value, sub }) => {
    const icons = {
        phone: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
        mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
        clock: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    };

    return (
        <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icons[icon]}
                </svg>
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</p>
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-sm font-medium text-slate-500">{sub}</p>
            </div>
        </div>
    );
};

export default Support;
