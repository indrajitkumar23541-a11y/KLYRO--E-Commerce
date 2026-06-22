import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await API.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            login(userData, token);
            navigate(userData.role === 'admin' ? '/admin' : userData.role === 'seller' ? '/seller' : '/get-started');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-6 pb-6">
            <div className="w-full max-w-md flex-1 flex flex-col">
                <h1 className="text-[32px] font-black text-gray-900 mb-8 leading-tight">
                    Welcome<br/>Back!
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-[13px] font-bold flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                    {/* Username or Email Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Username or Email"
                            required
                            className="w-full bg-[#F3F4F6] text-gray-900 text-[15px] font-medium rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#F83758]/50 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full bg-[#F3F4F6] text-gray-900 text-[15px] font-medium rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F83758]/50 transition-all placeholder:text-gray-400"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-[#F83758] text-[13px] font-bold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#F83758] text-white py-4 rounded-full font-black text-[16px] shadow-lg shadow-red-200 active:scale-95 transition-all mt-4"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-12">
                    <p className="text-center text-[13px] font-bold text-gray-400 mb-6">
                        - OR Continue with -
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </button>
                        <button className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.05 2.78.72 3.63 1.93-3.05 1.77-2.58 5.7.46 6.84-1.01 2.5-2.02 3.73-2.74 4.24M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/>
                            </svg>
                        </button>
                        <button className="w-14 h-14 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/>
                            </svg>
                        </button>
                    </div>

                    <p className="text-center mt-10 mb-4 text-[13px] font-bold text-gray-500">
                        Create An Account <Link to="/register" className="text-[#F83758] hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
