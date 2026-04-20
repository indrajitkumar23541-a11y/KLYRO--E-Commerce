import React from 'react';

const About = () => {
    return (
        <div className="bg-white pt-20">
            {/* Title Section */}
            <section className="relative h-[240px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80)' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <h1 className="relative z-10 text-5xl font-black uppercase text-white tracking-widest">About</h1>
            </section>

            {/* Content Section 1 */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl font-bold text-[#333]">Our Story</h2>
                        <p className="text-[#888] leading-8 text-[15px]">
                            KLYRO was founded on the principle of bringing premium, boutique-quality fashion to the modern individual. We believe that style is a form of self-expression, and our curated collections are designed to empower and inspire.
                        </p>
                        <p className="text-[#888] leading-8 text-[15px]">
                            From our humble beginnings as a small boutique to becoming a global fashion destination, our commitment to quality, sustainability, and trend-setting design has never wavered. Every piece in our collection is hand-selected to ensure it meets our rigorous standards of excellence.
                        </p>
                        <div className="pt-4 border-l-4 border-[#717fe0] pl-6 italic text-[#555]">
                            "Fashion is not just about clothes, it's about the confidence they bring to your everyday life."
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative group overflow-hidden border border-[#e6e6e6]">
                            <img 
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
                                alt="Our Story" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section 2 (Inverted) */}
            <section className="bg-[#f9f9f9] py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl font-bold text-[#333]">Our Mission</h2>
                            <p className="text-[#888] leading-8 text-[15px]">
                                We aim to redefine the e-commerce experience by blending high-fidelity technology with a personal, boutique touch. At KLYRO, we don't just sell products; we create experiences.
                            </p>
                            <p className="text-[#888] leading-8 text-[15px]">
                                Our mission is to provide an inclusive platform where everyone can find pieces that resonate with their unique personality. We are dedicated to transparent sourcing and ethical practices across our entire supply chain.
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="relative group overflow-hidden border border-[#e6e6e6]">
                                <img 
                                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" 
                                    alt="Our Mission" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Team Mini Section */}
            <section className="py-24 max-w-7xl mx-auto px-6 text-center">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <h4 className="text-4xl font-black text-[#717fe0] mb-2">10k+</h4>
                        <p className="text-[#888] uppercase tracking-widest text-[11px] font-bold">Happy Clients</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black text-[#717fe0] mb-2">500+</h4>
                        <p className="text-[#888] uppercase tracking-widest text-[11px] font-bold">Designs</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black text-[#717fe0] mb-2">24/7</h4>
                        <p className="text-[#888] uppercase tracking-widest text-[11px] font-bold">Support</p>
                    </div>
                    <div>
                        <h4 className="text-4xl font-black text-[#717fe0] mb-2">Free</h4>
                        <p className="text-[#888] uppercase tracking-widest text-[11px] font-bold">Shipping</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
