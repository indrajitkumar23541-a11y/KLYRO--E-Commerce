import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SellerSidebar from './SellerSidebar';
import SellerTopbar from './SellerTopbar';

const SellerRoute = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden bg-[#f1f5f9] font-sans relative">
            <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
                <SellerTopbar setSidebarOpen={setSidebarOpen} />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scroll bg-[#f8fafc]">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SellerRoute;
