import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('KLYRO Runtime Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full space-y-8 animate-reveal">
                        <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 shadow-xl shadow-rose-500/10">
                            <AlertCircle size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Glitch</h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Our intelligence core encountered an unexpected deviation. <br />
                                Don't worry, your data is safe in the vault.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all"
                            >
                                <RefreshCcw size={14} /> Restart Core
                            </button>
                            <a 
                                href="/"
                                className="flex-1 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                <Home size={14} /> Return Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
