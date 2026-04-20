import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
    return (
        <div className="bg-white pt-20">
            {/* Title Section */}
            <section className="relative h-[240px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80)' }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <h1 className="relative z-10 text-5xl font-black uppercase text-white tracking-widest">Contact</h1>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col lg:flex-row gap-24">
                    
                    {/* Send us a message */}
                    <div className="flex-1 p-12 border border-[#e6e6e6]">
                        <h2 className="text-3xl font-bold text-[#333] mb-12 text-center">Send Us A Message</h2>
                        <form className="space-y-12">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    className="w-full py-4 bg-transparent border-b border-[#e6e6e6] outline-none focus:border-[#717fe0] transition-colors text-[15px]" 
                                />
                            </div>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    className="w-full py-4 bg-transparent border-b border-[#e6e6e6] outline-none focus:border-[#717fe0] transition-colors text-[15px]" 
                                />
                            </div>
                            <div className="relative group">
                                <textarea 
                                    placeholder="How can we help?" 
                                    rows="4"
                                    className="w-full py-4 bg-transparent border-b border-[#e6e6e6] outline-none focus:border-[#717fe0] transition-colors text-[15px] resize-none"
                                ></textarea>
                            </div>
                            <button className="w-full bg-[#333] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#717fe0] transition-all duration-500 shadow-lg">
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 flex flex-col justify-center space-y-16 p-12">
                        <div className="flex gap-8">
                            <div className="mt-1 text-[#717fe0]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[#333] mb-4">Address</h4>
                                <p className="text-[#888] leading-7 max-w-[250px]">
                                    Cozastore Center 8th floor, 379 Hudson St, New York, NY 10018 US
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="mt-1 text-[#717fe0]">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[#333] mb-4">Lets Talk</h4>
                                <p className="text-[#717fe0] font-medium">+1 800 1236879</p>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="mt-1 text-[#717fe0]">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[#333] mb-4">Sale Support</h4>
                                <p className="text-[#717fe0] uppercase font-bold text-[13px]">contact@klyro.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Map Placeholder */}
            <section className="h-[450px] bg-[#f2f2f2] flex items-center justify-center border-t border-[#e6e6e6]">
                 <div className="text-center">
                    <MapPin size={48} className="text-[#888] mx-auto mb-4" />
                    <p className="text-[#888] uppercase tracking-widest text-sm font-bold">Map Placeholder</p>
                 </div>
            </section>
        </div>
    );
};

export default Contact;
