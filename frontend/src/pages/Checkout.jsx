import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Checkout = () => {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState('visa');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleContinue = () => {
        setShowSuccess(true);
        setTimeout(() => {
            navigate('/home');
        }, 3000);
    };

    const payments = [
        { id: 'visa', name: '*********2109', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png' },
        { id: 'paypal', name: '*********2109', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
        { id: 'maestro', name: '*********2109', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { id: 'apple', name: '*********2109', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-24 relative">
            {/* ── HEADER ── */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center -ml-2">
                    <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-[16px] font-black text-gray-900">Checkout</h1>
                <div className="w-8"></div>
            </div>

            <div className="px-5 mt-6 space-y-6">
                
                {/* ── ORDER SUMMARY ── */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-gray-600">Order</span>
                        <span className="text-[14px] font-black text-gray-900">₹ 7,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-gray-600">Shipping</span>
                        <span className="text-[14px] font-black text-gray-900">₹ 30</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                        <span className="text-[14px] font-bold text-gray-600">Total</span>
                        <span className="text-[15px] font-black text-gray-900">₹ 7,030</span>
                    </div>
                </div>

                {/* ── PAYMENT METHODS ── */}
                <div>
                    <h2 className="text-[14px] font-black text-gray-900 mb-4">Payment</h2>
                    <div className="space-y-4">
                        {payments.map(method => (
                            <div 
                                key={method.id} 
                                onClick={() => setSelectedPayment(method.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border ${selectedPayment === method.id ? 'border-[#F83758] bg-red-50/30' : 'border-gray-100 bg-white'} transition-all cursor-pointer`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-6 flex items-center justify-center bg-gray-50 rounded px-1">
                                        <img src={method.icon} alt={method.id} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-900">{method.name}</span>
                                </div>
                                {/* Custom Radio Button */}
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-[#F83758]' : 'border-gray-300'}`}>
                                    {selectedPayment === method.id && <div className="w-2 h-2 rounded-full bg-[#F83758]" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM BUTTON ── */}
                <div className="pt-4">
                    <button 
                        onClick={handleContinue}
                        className="w-full bg-[#F83758] text-white py-4 rounded-xl font-black text-[14px] shadow-lg shadow-red-200 active:scale-95 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>

            {/* ── SUCCESS MODAL OVERLAY ── */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-slide-up relative overflow-hidden">
                        
                        {/* Decorative checkmark circle */}
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#F83758]/50 flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#F83758] flex items-center justify-center shadow-lg shadow-red-200">
                                <Check size={32} className="text-white" strokeWidth={3} />
                            </div>
                        </div>

                        <h2 className="text-[18px] font-black text-gray-900 leading-tight">
                            Payment done successfully.
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
