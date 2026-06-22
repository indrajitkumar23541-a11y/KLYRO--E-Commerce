import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
    {
        title: "Choose Products",
        desc: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        img: "/assets/onboarding_1.png"
    },
    {
        title: "Make Payment",
        desc: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        img: "/assets/onboarding_2.png"
    },
    {
        title: "Get Your Order",
        desc: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        img: "/assets/onboarding_3.png"
    }
];

const Onboarding = () => {
    const [step, setStep] = useState(-1); // -1 is the initial logo splash
    const navigate = useNavigate();

    useEffect(() => {
        // Show logo splash for 2 seconds then move to onboarding
        if (step === -1) {
            const timer = setTimeout(() => setStep(0), 2000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const nextStep = () => {
        if (step < 2) setStep(step + 1);
        else navigate('/login');
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    if (step === -1) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-12 h-12">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#F83758]" fill="currentColor">
                            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
                            <path d="M50 30c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" className="text-[#4392F9]" fill="currentColor"/>
                        </svg>
                    </div>
                    <span className="text-3xl font-black tracking-tight text-[#F83758]">KLYRO</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pb-safe">
            {/* ── STATUS BAR SPACER & HEADER ── */}
            <div className="flex items-center justify-between px-6 pt-12 pb-4">
                <span className="text-[15px] font-bold text-gray-900">{step + 1}/3</span>
                <button onClick={() => navigate('/login')} className="text-[15px] font-bold text-gray-900">
                    Skip
                </button>
            </div>

            {/* ── IMAGE ── */}
            <div className="flex-1 flex items-center justify-center p-8">
                <img src={slides[step].img} alt={slides[step].title} className="w-full max-w-[300px] object-contain transition-opacity duration-300" />
            </div>

            {/* ── CONTENT ── */}
            <div className="px-6 text-center">
                <h1 className="text-[24px] font-black text-gray-900 mb-4">{slides[step].title}</h1>
                <p className="text-[14px] font-medium text-[#A8A8A9] leading-relaxed mb-12 px-2">
                    {slides[step].desc}
                </p>
            </div>

            {/* ── BOTTOM NAVIGATION ── */}
            <div className="px-6 pb-12 flex items-center justify-between">
                <button 
                    onClick={prevStep}
                    className={`text-[15px] font-bold ${step === 0 ? 'text-transparent pointer-events-none' : 'text-[#A8A8A9]'}`}
                >
                    Prev
                </button>

                {/* DOTS */}
                <div className="flex items-center gap-2">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#1A56DB]' : 'w-2 bg-gray-200'}`} />
                    ))}
                </div>

                <button 
                    onClick={nextStep}
                    className="text-[15px] font-bold text-[#F83758]"
                >
                    {step === 2 ? 'Get Started' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
