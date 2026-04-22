import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, Send, ShieldCheck, Info, Package } from 'lucide-react';
import API from '../api/axios';

const WriteReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data.product);
            } catch (err) {
                setError('Could not load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        setSubmitting(true);
        try {
            await API.post(`/products/${id}/reviews`, { rating, comment });
            alert('Thank you! Your acquisition review has been secured.');
            navigate('/orders');
        } catch (err) {
            alert(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#BC612C] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-32 font-sans text-gray-900">
            <div className="max-w-[800px] mx-auto px-6">
                
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-12 transition-colors">
                    <ChevronLeft size={14} /> Back to acquisitions
                </button>

                <div className="flex flex-col md:flex-row gap-16 items-start">
                    {/* PRODUCT PREVIEW */}
                    <div className="w-full md:w-64 space-y-6">
                        <div className="bg-white border border-gray-100 p-6 rounded-sm">
                            <img src={product?.image} alt={product?.name} className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">{product?.name}</h2>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Acquisition verified</p>
                        </div>
                    </div>

                    {/* REVIEW FORM */}
                    <div className="flex-1 space-y-12">
                        <header className="space-y-4">
                            <h1 className="text-4xl font-light tracking-tight text-gray-800">Write an <span className="font-semibold">Acquisition Review</span></h1>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                Share your strategic feedback on the quality and <br /> delivery experience of this luxury consignment.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* RATING */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C]">Overall Valuation</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="transition-transform active:scale-95 duration-200"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <Star 
                                                size={32} 
                                                strokeWidth={1.5}
                                                className={`transition-colors ${
                                                    star <= (hover || rating) 
                                                    ? 'fill-[#BC612C] text-[#BC612C]' 
                                                    : 'text-gray-100'
                                                }`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* COMMENT */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C]">Detailed Dossier</label>
                                <textarea 
                                    rows="6"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Describe the texture, fit, and overall aesthetic impact..."
                                    className="w-full bg-transparent border border-gray-100 p-6 text-sm font-medium focus:border-gray-900 outline-none transition-all placeholder:text-gray-200 resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full md:w-auto px-16 py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#BC612C] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10"
                            >
                                {submitting ? 'Transmitting...' : (
                                    <>Secure Submission <Send size={14} /></>
                                )}
                            </button>
                        </form>

                        <div className="pt-20 border-t border-gray-50 flex items-start gap-6">
                            <ShieldCheck size={24} className="text-gray-200" strokeWidth={1} />
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Authenticity Protocol</h4>
                                <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                                    All reviews are processed through KLYRO's integrity <br /> verification system to ensure verified member feedback.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteReview;
