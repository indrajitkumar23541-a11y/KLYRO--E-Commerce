import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Login: Submitting...', { email });
        try {
            const response = await API.post('/auth/login', { email, password });
            console.log('Login: Response received', response.data);
            const { token, ...userData } = response.data;
            login(userData, token);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'seller') {
                navigate('/seller');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login: Error', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white page-transition">

            {/* Left Side: Image (Desktop only) */}
            <div className="hidden md:block md:w-1/2 lg:w-3/5 h-screen relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=100&w=2560&auto=format&fit=crop"
                    alt="Premium Boutique"
                    className="w-full h-full object-cover animate-reveal"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-20">
                    <div className="text-white space-y-6 max-w-lg text-center md:text-left">
                        <p className="font-bold uppercase tracking-[0.6em] text-xs opacity-80">Welcome Back</p>
                        <h2 className="text-6xl font-black uppercase tracking-tight leading-none">The Luxury <br /> Experience</h2>
                        <div className="h-1 w-20 bg-white mx-auto md:mx-0"></div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 min-h-screen flex items-center justify-center p-8 md:p-16 lg:p-24 relative order-1 md:order-2">

                {/* Mobile Background Decoration */}
                <div className="md:hidden absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#717fe0]/5 to-transparent"></div>

                <div className="w-full max-w-md relative z-10 animate-slide-up">
                    <div className="mb-14">
                        <p className="text-[#888] font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Member Access</p>
                        <h1 className="text-4xl font-black text-[#333] uppercase tracking-tighter italic">Login<span className="text-[#717fe0]">.</span></h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-sm mb-10 border-l-4 border-red-500 text-[11px] font-bold uppercase tracking-widest animate-fade-in flex items-center gap-3">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-2 relative group">
                            <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-0 bottom-4 text-[#ccc] group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-transparent border-b border-[#e6e6e6] py-3 pl-8 text-sm font-medium text-[#333] focus:border-[#717fe0] outline-none transition-all placeholder:text-[#ccc]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 relative group">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-[#888] uppercase tracking-widest">Password</label>
                                <button type="button" className="text-[10px] font-bold text-[#717fe0] uppercase hover:underline">Forgot Key?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-0 bottom-4 text-[#ccc] group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-transparent border-b border-[#e6e6e6] py-3 pl-8 text-sm font-medium text-[#333] focus:border-[#717fe0] outline-none transition-all placeholder:text-[#ccc]"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#333] text-white py-4 font-bold uppercase tracking-widest text-[12px] hover:bg-[#717fe0] transition-all duration-500 shadow-xl hover:shadow-[#717fe0]/20 flex items-center justify-center gap-3 group">
                            Login <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-[#f0f0f0] text-center">
                        <p className="text-[11px] font-medium text-[#888] uppercase tracking-widest">
                            New Collector? <Link to="/register" className="text-[#333] font-black hover:text-[#717fe0] transition hover:underline underline-offset-4">Register Hub</Link>
                        </p>
                    </div>
                </div>

                {/* Back Link */}
                <Link to="/" className="absolute top-10 right-10 md:top-12 md:right-12 text-[#333] hover:text-[#717fe0] transition-colors opacity-50 hover:opacity-100 hidden sm:block">
                    <LogIn size={24} className="rotate-180" />
                </Link>
            </div>
        </div>
    );
};

export default Login;
