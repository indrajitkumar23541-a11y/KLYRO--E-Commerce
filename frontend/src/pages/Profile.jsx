import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-10">
            {/* ── HEADER ── */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center -ml-2">
                    <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-[16px] font-black text-gray-900">Checkout</h1>
                <div className="w-8"></div>
            </div>

            <div className="px-5 mt-6">
                {/* ── PROFILE PIC ── */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-sm">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-white rounded-full">
                            <BadgeCheck size={24} className="text-[#4392F9]" fill="white" />
                        </div>
                    </div>
                </div>

                {/* ── PERSONAL DETAILS ── */}
                <div className="mb-8">
                    <h2 className="text-[15px] font-black text-gray-900 mb-4">Personal Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue={user?.email || 'aashifa@gmail.com'}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[#4392F9]"
                            />
                        </div>
                        
                        <div className="relative">
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Password</label>
                            <input 
                                type="password" 
                                defaultValue="***********"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[#4392F9]"
                            />
                            <div className="absolute right-0 top-0 mt-[1px]">
                                <button className="text-[11px] font-bold text-[#F83758] hover:underline">Change Password</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BUSINESS ADDRESS DETAILS ── */}
                <div className="mb-8">
                    <h2 className="text-[15px] font-black text-gray-900 mb-4">Business Address Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Pincode</label>
                            <input 
                                type="text" 
                                defaultValue="450116"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Address</label>
                            <input 
                                type="text" 
                                defaultValue="216 St Paul's Rd,"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">City</label>
                            <input 
                                type="text" 
                                defaultValue="London"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">State</label>
                            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none appearance-none bg-transparent">
                                <option>N1 2LL,</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Country</label>
                            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none appearance-none bg-transparent">
                                <option>United Kingdom</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── BANK ACCOUNT DETAILS ── */}
                <div className="mb-8">
                    <h2 className="text-[15px] font-black text-gray-900 mb-4">Bank Account Details</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Bank Account Number</label>
                            <input 
                                type="text" 
                                defaultValue="204356XXXXXXX"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">Account Holder's Name</label>
                            <input 
                                type="text" 
                                defaultValue="Abhiraj Sisodiya"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold text-gray-800 mb-1.5 block">IFSC Code</label>
                            <input 
                                type="text" 
                                defaultValue="SBIN00428"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ── SAVE BUTTON ── */}
                <button className="w-full bg-[#F83758] text-white py-4 rounded-xl font-black text-[14px] shadow-lg shadow-red-200 active:scale-95 transition-all">
                    Save
                </button>

            </div>
        </div>
    );
};

export default Profile;
