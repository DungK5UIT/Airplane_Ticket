import React from 'react';
import Navbar from '../components/Navbar';

export default function Support() {
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <Navbar transparent={false} />
            <div className="mx-auto w-[min(900px,92vw)] pt-[100px] pb-14">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h1 className="mb-3 text-3xl font-black text-slate-900">Hỗ trợ khách hàng</h1>
                    <p className="mb-5 text-sm font-medium text-slate-500">Liên hệ đội ngũ FlyViet khi cần hỗ trợ.</p>
                    <div className="grid gap-2 text-sm">
                        <div><strong>Hotline:</strong> 1900 1234</div>
                        <div><strong>Email:</strong> support@flyviet.vn</div>
                        <div><strong>Giờ làm việc:</strong> 08:00 - 22:00 (Thứ 2 - Chủ nhật)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
