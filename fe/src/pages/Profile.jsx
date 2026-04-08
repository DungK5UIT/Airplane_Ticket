import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [promoCards, setPromoCards] = useState([]);
    const [loadingPromos, setLoadingPromos] = useState(false);


    const showNotify = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };


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

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });


    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId && userId !== '???') {
                try {
                    const profileData = await authService.getUserProfile(userId);
                    if (profileData) {
                        setFormData({
                            fullName: profileData.hoTen || profileData.name || initialName,
                            email: profileData.email || initialEmail,
                            phone: profileData.sdt || '',
                            dob: profileData.ngaySinh || '',
                            gender: profileData.gioiTinh || 'Nam',
                            cccd: profileData.cccd || ''
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }
        };
        fetchUserProfile();
    }, [userId, initialName, initialEmail]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                setLoadingPromos(true);
                const data = await authService.getActivePromotions();
                const formattedPromos = data.map(promo => {
                    const expiryDate = new Date(promo.ngayKetThuc);
                    const formattedExpiry = expiryDate.toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                    });
                    return {
                        id: promo.maKhuyenMai,
                        title: promo.tenChuongTrinh,
                        description: promo.moTaTenChuongTrinh,
                        tag: promo.phanTramGiam > 0 ? `GIẢM ${promo.phanTramGiam}%` : "ƯU ĐÃI",
                        expiry: `Hết hạn: ${formattedExpiry}`,
                        code: promo.code,
                        remaining: promo.soLuongConLai
                    };
                });
                setPromoCards(formattedPromos);
                setLoadingPromos(false);
            } catch (err) {
                console.error("Error fetching promotions:", err);
                setLoadingPromos(false);
            }
        };

        fetchPromotions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updateData = {
                hoTen: formData.fullName,
                email: formData.email,
                sdt: formData.phone,
                ngaySinh: formData.dob,
                gioiTinh: formData.gender,
                cccd: formData.cccd
            };
            await authService.updateUserProfile(userId, updateData);
            
            // Also logically update current user in local storage to keep navbar in sync if needed
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const userObj = currentUser.user || currentUser;
                userObj.name = formData.fullName;
                userObj.hoTen = formData.fullName;
                localStorage.setItem('user', JSON.stringify(currentUser));
                window.dispatchEvent(new Event('storage'));
            }

            showNotify('Thông tin hồ sơ đã được cập nhật thành công!');
        } catch (error) {
            console.error("Failed to update profile", error);
            showNotify('Đã có lỗi xảy ra. Vui lòng kiểm tra lại kết nối hoặc quyền truy cập!', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotify('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'error');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            showNotify('Mật khẩu mới phải từ 8 ký tự trở lên!', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword(userId, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showNotify('Đổi mật khẩu thành công!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Failed to change password", error);
            const errorMsg = error.response?.data?.message || 'Mật khẩu hiện tại không chính xác hoặc có lỗi xảy ra!';
            showNotify(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };


    const confirmLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };


    return (
        <div className="min-h-screen flex flex-col font-sans relative" style={{ fontFamily: "'Nunito', sans-serif" }}>
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

            {/* Premium Toast Notification */}
            {notification.show && (
                <div className="fixed top-24 right-5 z-[100] animate-slide-up">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-4 min-w-[300px] ${
                        notification.type === 'success' 
                        ? 'bg-green-50/90 border-green-200 text-green-800' 
                        : 'bg-red-50/90 border-red-200 text-red-800'
                    }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {notification.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <div>

                            <p className="font-bold text-sm uppercase tracking-wider">{notification.type === 'success' ? 'Thành công' : 'Thất bại'}</p>
                            <p className="text-xs font-medium opacity-80">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}


            {/* Premium Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full relative z-10 animate-slide-up border border-white">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 text-center mb-2 font-sans">Đăng xuất?</h3>
                        <p className="text-sm font-medium text-slate-500 text-center mb-8 font-sans">Bạn có chắc chắn muốn rời khỏi phiên đăng nhập này?</p>
                        <div className="flex flex-col gap-3 font-sans">
                            <button 
                                onClick={confirmLogout}
                                className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95"
                            >
                                Đăng xuất ngay
                            </button>
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm transition-all"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Global Fixed Background (Unblurred, Beautiful Sky with Airplane) */}
            <div className="fixed inset-0 z-[-1] bg-sky-100">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920" alt="Sky Background" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-slate-900/20"></div>
            </div>

            <div className="mx-auto w-[min(1200px,98vw)] mt-[100px] mb-20 flex-grow grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 items-stretch relative z-10">

                {/* Left Sidebar */}
                <div className="flex flex-col gap-6 h-full">
                    {/* Navigation Menu */}
                    <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-sky-900/10 border border-white overflow-hidden flex flex-col h-full">
                        <nav className="flex flex-col text-base font-bold text-slate-700 flex-grow pb-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-4 px-8 py-6 text-left transition-all border-l-[6px] ${activeTab === 'profile' ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex items-center gap-4 px-8 py-6 text-left transition-all border-l-[6px] ${activeTab === 'account' ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Tài khoản của tôi
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex items-center gap-4 px-8 py-6 text-left transition-all border-l-[6px] ${activeTab === 'security' ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6.223a4.92 4.92 0 00-3.146 1.838 12.722 12.722 0 003.111 11.758 12.87 12.87 0 0011.037 4.164 12.87 12.87 0 0011.037-4.164 12.722 12.722 0 003.111-11.758 4.92 4.92 0 00-3.146-1.838A11.959 11.959 0 0112 2.714z" /></svg>
                                Bảo mật tài khoản
                            </button>
                            <button
                                onClick={() => setActiveTab('vouchers')}
                                className={`flex items-center gap-4 px-8 py-6 text-left transition-all border-l-[6px] ${activeTab === 'vouchers' ? 'border-amber-500 bg-amber-50/50 text-amber-700' : 'border-transparent hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                                Mã giảm giá ưu đãi
                            </button>

                            <button
                                onClick={() => navigate('/my-flights')}
                                className={`flex items-center gap-4 px-8 py-6 text-left transition-all border-l-[6px] border-transparent hover:bg-slate-50 hover:text-slate-800`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .415.139.797.373 1.1a2.25 2.25 0 00-.1.664c0 .415.139.797.373 1.1a2.25 2.25 0 00-.1.664c0 .415.139.797.373 1.1m-.373-3.3c0-.231.035-.454.1-.664a2.252 2.252 0 011.893-1.54 48.22 48.22 0 011.123-.08c1.131-.094 1.976.868 1.976 1.932V6.108a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192 1.131-.094 1.976.868 1.976 1.932v.007c0 .23-.035.454-.1.664M4.5 18H5.25a2.25 2.25 0 012.25 2.25V21H3.75a2.25 2.25 0 01-2.25-2.25v-10.5A2.25 2.25 0 013.75 6H5.25a2.25 2.25 0 012.25 2.25V11.25a2.25 2.25 0 01-2.25 2.25H4.5V18z" /></svg>
                                Theo dõi đơn hàng
                            </button>

                            <hr className="border-slate-50 my-1 mx-6" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 px-8 py-6 text-left transition-colors border-l-[6px] border-transparent hover:bg-red-50 text-red-500 hover:text-red-600 font-semibold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                                Đăng xuất
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-sky-900/10 border border-white p-10 min-h-[600px]">

                    {/* Tab 0: Account Summary (Dashboard) */}
                    {activeTab === 'account' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-semibold  tracking-widest mb-3">Tổng quan tài khoản</span>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">Trung tâm quản lý, {formData.fullName}</h1>
                                <p className="text-sm font-medium text-slate-400">Xem nhanh tình trạng tài khoản và các hoạt động gần đây của bạn.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-10">
                                {/* Compact User Card */}
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center group w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-20 h-20 mb-4 rounded-full bg-slate-50 flex items-center justify-center text-amber-600 font-semibold text-3xl border border-slate-50 shadow-inner relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-800 mb-1">{formData.fullName}</h2>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[10px] font-semibold text-slate-400 tracking-wide ">{role}</span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full mb-4 border border-slate-100">
                                        Mã khách hàng: <span className="text-amber-600">{userId}</span>
                                    </div>
                                </div>

                                {/* Compact Perk Card */}
                                <div className="bg-slate-900 rounded-3xl shadow-sm text-white relative overflow-hidden group w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Lounge" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="relative z-10 p-6 flex flex-col h-full bg-slate-900/40">
                                        <h3 className="font-semibold text-sm mb-1  tracking-wider text-amber-400">Đặc quyền hội viên</h3>
                                        <p className="text-[11px] text-slate-100 leading-relaxed mb-4 font-medium">Sử dụng điểm tích lũy để đổi vé miễn phí hoặc vào phòng chờ thương gia.</p>
                                        <div className="mt-auto">
                                            <button className="text-[10px] font-semibold py-2 px-4 bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors shadow-sm">XEM CHI TIẾT</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {[
                                    { label: 'Chuyến bay', value: '12', sub: 'Năm 2024', icon: '✈️', color: 'bg-amber-50 text-amber-600' },
                                    { label: 'Quãng đường', value: '8.5k', sub: 'Kilomet', icon: '🌍', color: 'bg-green-50 text-green-600' },
                                    { label: 'Điểm thưởng', value: '1,250', sub: 'Bamboo-point', icon: '🪙', color: 'bg-orange-50 text-orange-600' },
                                    { label: 'Hạng thẻ', value: 'Silver', sub: 'Priority', icon: '🥈', color: 'bg-slate-100 text-slate-600' }
                                ].map((stat, idx) => (
                                    <div key={idx} className={`${stat.color} p-4 rounded-3xl border border-white shadow-sm flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform cursor-default`}>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-semibold mb-0">{stat.value}</p>
                                            <p className="text-[10px] font-semibold  opacity-60 leading-tight">{stat.label}</p>
                                            <p className="text-[9px] font-medium opacity-40">{stat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 1: Profile Details */}
                    {activeTab === 'profile' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-semibold  tracking-widest mb-3">Tài khoản cá nhân</span>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">Hồ sơ cá nhân</h1>
                                <p className="text-sm font-medium text-slate-400">Điều chỉnh các thông tin cá nhân của bạn để quá trình đặt vé diễn ra mượt mà nhất.</p>
                            </div>


                            <form onSubmit={handleSave} className="flex flex-col gap-8">
                                <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                                    <div className="col-span-2">
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Họ và tên chính xác</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => handleChange(e)}
                                            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white px-5 text-base font-bold text-slate-800 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 "
                                            placeholder="NGUYỄN VĂN A"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Địa chỉ Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium text-slate-800 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white px-5 text-base font-bold text-slate-800 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                            placeholder="098xxxxxxxx"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Ngày tháng năm sinh</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            max={new Date().toISOString().split("T")[0]}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-semibold outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Giới tính</label>
                                        <div className="flex gap-4">
                                            {['Nam', 'Nữ'].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => handleChange({ target: { name: 'gender', value: g } })}
                                                    className={`flex-1 h-14 rounded-2xl border font-semibold text-sm transition-all ${formData.gender === g ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm' : 'border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="mb-2 block text-xs font-bold text-slate-500  tracking-wider">Số định danh (CCCD / Passport)</label>
                                        <input
                                            type="text"
                                            name="cccd"
                                            value={formData.cccd}
                                            onChange={handleChange}
                                            className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white px-5 text-base font-bold text-slate-800 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 tracking-[0.2em]"
                                            placeholder="012345678912"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end pt-8 border-t border-slate-50">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-14 min-w-[200px] rounded-2xl bg-slate-800 px-8 font-semibold text-sm text-white shadow-lg shadow-slate-300 transition-all hover:bg-slate-900 hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : 'Lưu thông tin thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 4: Vouchers */}
                    {activeTab === 'vouchers' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <h1 className="text-2xl font-bold text-slate-800 mb-2">Ưu đãi của bạn</h1>
                                <p className="text-sm font-medium text-slate-400">Các mã giảm giá dành cho bạn.</p>
                            </div>

                            {loadingPromos ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : promoCards.length === 0 ? (
                                <div className="bg-slate-100 rounded-3xl p-10 text-center text-slate-500 font-bold mb-6">
                                    Hiện chưa có ưu đãi nào phù hợp
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {promoCards.map((promo, idx) => {
                                        const gradients = [
                                            { bg: "from-orange-400 to-red-500", text: "text-orange-500" },
                                            { bg: "from-sky-500 to-indigo-600", text: "text-sky-600" },
                                            { bg: "from-green-400 to-emerald-600", text: "text-emerald-600" },
                                        ];
                                        const colors = gradients[idx % gradients.length];
                                        return (
                                            <div key={promo.id} className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-6 text-white relative overflow-hidden group`}>
                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className="bg-white/20 w-max px-3 py-1 rounded-lg text-[10px] font-semibold mb-4 uppercase">{promo.tag}</div>
                                                    <h3 className="text-2xl font-semibold mb-1">{promo.title}</h3>
                                                    <p className="text-xs text-white/90 font-semibold mb-6 flex-grow">{promo.description}</p>
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-semibold tracking-widest opacity-90">CODE: {promo.code}</span>
                                                            <span className="text-[10px] font-medium opacity-75">{promo.expiry}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => { navigator.clipboard.writeText(promo.code); alert('Đã sao chép: ' + promo.code); }}
                                                            className={`bg-white ${colors.text} px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform`}
                                                        >
                                                            Sao chép
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                                                <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Security */}
                    {activeTab === 'security' && (
                        <div className="animate-slide-up">
                            <div className="mb-10">
                                <h1 className="text-2xl font-bold text-slate-800 mb-2">Bảo mật tài khoản</h1>
                                <p className="text-sm font-medium text-slate-400">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.</p>
                            </div>

                            <form className="flex flex-col gap-8 max-w-lg" onSubmit={handlePasswordChange}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-400  tracking-wider">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-400  tracking-wider">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                            placeholder="Tối thiểu 8 ký tự"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold text-slate-400  tracking-wider">Xác nhận mật khẩu</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-5 text-base font-medium outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={isLoading} className="h-14 w-full rounded-2xl bg-slate-800 font-bold text-sm text-white shadow-lg active:scale-95 transition-all disabled:opacity-50">
                                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu mới'}
                                </button>
                            </form>


                            <div className="mt-12 p-6 bg-red-50 rounded-3xl border border-red-100">
                                <h4 className="text-red-700 font-semibold text-sm mb-2">Khu vực nguy hiểm</h4>
                                <p className="text-xs text-red-600/70 font-medium mb-4 leading-relaxed">Xóa tài khoản sẽ xóa vĩnh viễn tất cả lịch sử bay và điểm tích lũy của bạn. Hành động này không thể hoàn tác.</p>
                                <button className="text-xs font-semibold text-red-600 underline hover:text-red-800 transition-colors">XÓA TÀI KHOẢN NGAY</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
}
