import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    
    // User data state
    const currentUser = authService.getCurrentUser();
    const role = currentUser?.role || currentUser?.user?.role || 'USER';
    const userId = currentUser?.maNguoiDung || currentUser?.user?.maNguoiDung || '???';
    const initialName = currentUser?.name || currentUser?.user?.name || currentUser?.hoTen || currentUser?.user?.hoTen || 'Hành khách';
    const initialEmail = currentUser?.email || currentUser?.user?.email || 'email@example.com';

    const [formData, setFormData] = useState({
        fullName: initialName,
        email: initialEmail,
        phone: '',
        dob: '',
        gender: 'Nam',
        cccd: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Cập nhật thông tin thành công!');
        }, 800);
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            authService.logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] flex flex-col font-sans" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-up {
                        animation: slideUp 0.4s ease-out forwards;
                    }
                `}
            </style>
            <Navbar transparent={false} />

            {/* Premium Cover Header */}
            <div className="relative pt-[70px]">
                <div className="h-72 w-full bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0 L100 100 M0 100 L100 0 M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.1" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-[min(1100px,96vw)] -mt-32 mb-20 flex-grow grid lg:grid-cols-[280px_1fr] gap-8 items-start relative z-10">
                
                {/* Left Sidebar */}
                <div className="flex flex-col gap-6 sticky top-[100px]">
                    {/* User Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-6 flex flex-col items-center text-center overflow-hidden group">
                        <div className="relative mb-4">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-100 to-sky-50 flex items-center justify-center text-sky-600 font-black text-4xl border-4 border-white shadow-lg relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                {formData.fullName.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-slate-100 text-sky-600 hover:text-sky-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                            </button>
                        </div>

                        <h2 className="text-xl font-black text-slate-800 mb-1">{formData.fullName}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">{role}</span>
                        </div>
                        
                        <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-50 pt-4 mt-2">
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hội viên</p>
                                <p className="text-sm font-black text-sky-600">Bạc (Silver)</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Điểm tích lũy</p>
                                <p className="text-sm font-black text-orange-500">1,250</p>
                            </div>
                        </div>
                    </div>

                    {/* Member Perk Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 shadow-xl text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm group-hover:rotate-12 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-orange-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.3 8.38 8.38 0 013.8.9l2.7-2.7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                            </div>
                            <h3 className="font-black text-sm mb-1 uppercase tracking-wider">Đặc quyền hội viên</h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">Sử dụng điểm tích lũy để đổi lấy vé máy bay hoặc nâng hạng ghế miễn phí.</p>
                            <button className="text-[11px] font-black py-2 px-4 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">KHÁM PHÁ NGAY</button>
                        </div>
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <nav className="flex flex-col text-sm font-bold text-slate-600">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-3 px-6 py-4.5 text-left transition-all border-l-4 ${activeTab === 'profile' ? 'border-sky-500 bg-sky-50/50 text-sky-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab('flights')}
                                className={`flex items-center gap-3 px-6 py-4.5 text-left transition-all border-l-4 ${activeTab === 'flights' ? 'border-sky-500 bg-sky-50/50 text-sky-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                Chuyến bay của tôi
                            </button>
                            <button
                                onClick={() => setActiveTab('vouchers')}
                                className={`flex items-center gap-3 px-6 py-4.5 text-left transition-all border-l-4 ${activeTab === 'vouchers' ? 'border-sky-500 bg-sky-50/50 text-sky-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                                Mã giảm giá ưu đãi
                                <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex items-center gap-3 px-6 py-4.5 text-left transition-all border-l-4 ${activeTab === 'security' ? 'border-sky-500 bg-sky-50/50 text-sky-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.223a4.92 4.92 0 00-3.146 1.838 12.722 12.722 0 003.111 11.758 12.87 12.87 0 0011.037 4.164 12.87 12.87 0 0011.037-4.164 12.722 12.722 0 003.111-11.758 4.92 4.92 0 00-3.146-1.838A11.959 11.959 0 0112 2.714z" /></svg>
                                Bảo mật tài khoản
                            </button>
                            
                            <hr className="border-slate-50 my-1 mx-6" />
                            
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-6 py-4.5 text-left transition-colors border-l-4 border-transparent hover:bg-red-50 text-red-500 hover:text-red-600 font-black mb-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                Đăng xuất
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-10 min-h-[600px]">
                    
                    {/* Tab 1: Profile Details */}
                    {activeTab === 'profile' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3">Tài khoản cá nhân</span>
                                <h1 className="text-3xl font-black text-slate-800 mb-2">Xin chào, {formData.fullName}!</h1>
                                <p className="text-sm font-medium text-slate-400">Điều chỉnh các thông tin cá nhân của bạn để quá trình đặt vé diễn ra mượt mà nhất.</p>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {[
                                    {label: 'Chuyến bay', value: '12', sub: 'Năm 2024', icon: '✈️', color: 'bg-sky-50 text-sky-600'},
                                    {label: 'Quãng đường', value: '8.5k', sub: 'Kilomet', icon: '🌍', color: 'bg-green-50 text-green-600'},
                                    {label: 'Điểm thưởng', value: '1,250', sub: 'Bamboo-point', icon: '🪙', color: 'bg-orange-50 text-orange-600'},
                                    {label: 'Hạng thẻ', value: 'Silver', sub: 'Priority', icon: '🥈', color: 'bg-slate-100 text-slate-600'}
                                ].map((stat, idx) => (
                                    <div key={idx} className={`${stat.color} p-4 rounded-3xl border border-white shadow-sm flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform cursor-default`}>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black mb-0">{stat.value}</p>
                                            <p className="text-[10px] font-black uppercase opacity-60 leading-tight">{stat.label}</p>
                                            <p className="text-[9px] font-bold opacity-40">{stat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSave} className="flex flex-col gap-8">
                                <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                                    <div className="col-span-2">
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Họ và tên chính xác</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => handleChange({target: {name: 'fullName', value: e.target.value.toUpperCase()}})}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-black text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 uppercase"
                                            placeholder="NGUYỄN VĂN A"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Địa chỉ Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly 
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-100/50 px-5 text-base font-bold text-slate-400 outline-none cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-bold text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                            placeholder="098xxxxxxxx"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Ngày tháng năm sinh</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-bold text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Giới tính</label>
                                        <div className="flex gap-4">
                                            {['Nam', 'Nữ'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => handleChange({target: {name: 'gender', value: g}})}
                                                    className={`flex-1 h-14 rounded-2xl border font-black text-sm transition-all ${formData.gender === g ? 'border-sky-500 bg-sky-50 text-sky-600 shadow-sm' : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Số định danh (CCCD / Passport)</label>
                                        <input
                                            type="text"
                                            name="cccd"
                                            value={formData.cccd}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-black text-slate-800 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 tracking-[0.2em]"
                                            placeholder="012345678912"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end pt-8 border-t border-slate-50">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="h-14 min-w-[200px] rounded-2xl bg-slate-800 px-8 font-black text-sm text-white shadow-lg shadow-slate-300 transition-all hover:bg-slate-900 hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : 'LƯU THÔNG TIN THAY ĐỔI'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 2: Flight History */}
                    {activeTab === 'flights' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <h1 className="text-2xl font-black text-slate-800 mb-2">Hành trình đã bay</h1>
                                <p className="text-sm font-medium text-slate-400">Danh sách các chuyến bay bạn đã thực hiện trong 12 tháng qua.</p>
                            </div>
                            
                            <div className="grid gap-4">
                                {/* Mock Ticket Item */}
                                <div className="border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-sky-200 transition-colors">
                                    <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-sky-600 uppercase mb-1">Mã đặt chỗ: #BAMBOO-99128</p>
                                        <h4 className="text-lg font-black text-slate-800">SGN (TP. HCM) → HAN (Hà Nội)</h4>
                                        <p className="text-xs font-bold text-slate-400">Khởi hành: 12:45, 15/05/2024 • Bamboo Airways</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black">HOÀN TẤT</span>
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-sky-600 transition-colors tracking-widest uppercase underline">Xem chi tiết vé</button>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                    <p className="text-sm font-bold text-slate-400">Không còn chuyến bay nào khác trong lịch sử.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Vouchers */}
                    {activeTab === 'vouchers' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <h1 className="text-2xl font-black text-slate-800 mb-2">Ưu đãi của bạn</h1>
                                <p className="text-sm font-medium text-slate-400">Các mã giảm giá dành riêng cho khách hàng thân thiết.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Voucher 1 */}
                                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 text-white relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="bg-white/20 w-max px-3 py-1 rounded-lg text-[10px] font-black mb-4">MỚI NHẤT</div>
                                        <h3 className="text-2xl font-black mb-1">GIẢM 20%</h3>
                                        <p className="text-xs text-orange-50 font-bold mb-6">Áp dụng cho các tuyến bay nội địa Bamboo Airways</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-[10px] font-black tracking-widest uppercase opacity-70">CODE: BAMBOO20</span>
                                            <button className="bg-white text-orange-500 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform">DÙNG NGAY</button>
                                        </div>
                                    </div>
                                    <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </div>

                                {/* Voucher 2 */}
                                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="bg-white/20 w-max px-3 py-1 rounded-lg text-[10px] font-black mb-4">GIFT VOUCHER</div>
                                        <h3 className="text-2xl font-black mb-1">FREE BAGGAGE</h3>
                                        <p className="text-xs text-sky-50 font-bold mb-6">Tặng 20kg ký gửi miễn phí cho chuyến bay tiếp theo</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-[10px] font-black tracking-widest uppercase opacity-70">CON HẠN 5 NGÀY</span>
                                            <button className="bg-white text-sky-600 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform">KIỂM TRA</button>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Security */}
                    {activeTab === 'security' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <h1 className="text-2xl font-black text-slate-800 mb-2">Bảo mật tài khoản</h1>
                                <p className="text-sm font-medium text-slate-400">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.</p>
                            </div>

                            <form className="flex flex-col gap-8 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert('Cập nhật mật khẩu thành công!')}}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                            placeholder="Tối thiểu 8 ký tự"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-black text-slate-400 uppercase tracking-wider">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="h-14 w-full rounded-2xl bg-slate-800 font-black text-sm text-white shadow-lg active:scale-95 transition-all">
                                    CẬP NHẬT MẬT KHẨU MỚI
                                </button>
                            </form>

                            <div className="mt-12 p-6 bg-red-50 rounded-3xl border border-red-100">
                                <h4 className="text-red-700 font-black text-sm mb-2">Khu vực nguy hiểm</h4>
                                <p className="text-xs text-red-600/70 font-bold mb-4 leading-relaxed">Xóa tài khoản sẽ xóa vĩnh viễn tất cả lịch sử bay và điểm tích lũy của bạn. Hành động này không thể hoàn tác.</p>
                                <button className="text-xs font-black text-red-600 underline hover:text-red-800 transition-colors">XÓA TÀI KHOẢN NGAY</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
}
