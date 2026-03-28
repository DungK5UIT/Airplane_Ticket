import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authService } from '../services/api';

export default function Profile() {
    const currentUser = authService.getCurrentUser();
    const profile = currentUser?.user || currentUser || {};

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar transparent={false} />
            <div className="mx-auto w-[min(900px,92vw)] pt-[100px] pb-14">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h1 className="mb-3 text-3xl font-black text-slate-900">Hồ sơ của tôi</h1>
                    <p className="mb-6 text-sm font-medium text-slate-500">Thông tin tài khoản đang đăng nhập.</p>
                    <div className="grid grid-cols-[170px_1fr] gap-3 text-sm">
                        <strong>Họ và tên:</strong>
                        <span>{profile.name || 'Chưa cập nhật'}</span>
                        <strong>Email:</strong>
                        <span>{profile.email || 'Chưa cập nhật'}</span>
                        <strong>Vai trò:</strong>
                        <span>{profile.role || currentUser?.role || 'USER'}</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
