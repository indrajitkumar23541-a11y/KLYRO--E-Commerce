import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        sessionStorage.setItem('klyro_splash_seen', '1');
        navigate('/home');
    };

    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#0d1f2d' }}>

            {/* ── FULL-SCREEN HERO IMAGE ─────────────────── */}
            <div className="absolute inset-0">
                <img
                    src="/assets/fashion_hero_bg.png"
                    alt="Fashion"
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.75)' }}
                />
                {/* Gradient overlay — dark at bottom for text readability */}
                <div className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.82) 100%)'
                    }}
                />
            </div>

            {/* ── CONTENT ──────────────────────────────────── */}
            <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-14">

                {/* Headline */}
                <h1 className="text-white font-black leading-tight mb-3"
                    style={{ fontSize: 'clamp(28px, 8vw, 40px)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                    You want Authentic,<br />here you go!
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 text-[14px] font-medium mb-8"
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                    Find it here, buy it now!
                </p>

                {/* Get Started Button */}
                <button
                    onClick={handleGetStarted}
                    className="w-full py-4 rounded-full font-black text-[16px] text-white tracking-wide active:scale-[0.97] transition-all"
                    style={{
                        background: 'linear-gradient(135deg, #FF4B5C 0%, #FF2D4B 100%)',
                        boxShadow: '0 8px 30px rgba(255,75,92,0.5)',
                    }}
                >
                    Get Started
                </button>
            </div>


        </div>
    );
};

export default GetStarted;
