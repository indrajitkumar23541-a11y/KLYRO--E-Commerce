import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';

import AdminTopbar from './AdminTopbar';

const AdminRoute = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex w-full h-screen overflow-hidden bg-[#e9e6df] font-sans relative">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-[#f4f3ef] w-full">
                <AdminTopbar setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scroll">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminRoute;
