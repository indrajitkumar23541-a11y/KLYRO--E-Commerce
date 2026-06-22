import React, { useState } from 'react';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since we don't have a real password reset endpoint in our current backend yet,
        // we'll just mock a success message.
        setStatus('success');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pt-16 px-6 pb-6">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2 mb-6">
                <ArrowLeft size={24} className="text-gray-900" />
            </button>

            <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
                <h1 className="text-[32px] font-black text-gray-900 mb-8 leading-tight">
                    Forgot<br/>password?
                </h1>

                {status === 'success' && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-[13px] font-bold border border-green-100">
                        Check your email for password reset instructions!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="w-full bg-[#F3F4F6] text-gray-900 text-[15px] font-medium rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#F83758]/50 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <p className="text-[12px] text-gray-500 font-medium">
                        <span className="text-[#F83758]">*</span> We will send you a message to set or reset your new password
                    </p>

                    <button 
                        type="submit" 
                        className="w-full bg-[#F83758] text-white py-4 rounded-full font-black text-[16px] shadow-lg shadow-red-200 active:scale-95 transition-all mt-8"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
