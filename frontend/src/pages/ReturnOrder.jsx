import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Package, Send, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import API from '../api/axios';

const ReturnOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data.order);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            alert('Please specify a reason for the return.');
            return;
        }
        setSubmitting(true);
        try {
            await API.post(`/orders/${id}/return`, { reason });
            setSuccess(true);
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

    if (success) return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center pt-24 pb-32 font-sans px-6">
            <div className="max-w-[500px] w-full text-center space-y-10 animate-reveal">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl">
                    <CheckCircle2 size={40} strokeWidth={1} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-light tracking-tight text-gray-800">Return <span className="font-semibold">Initiated</span></h1>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                        Your request for consignment #{id} has been logged. Our logistics team will review the dossier within 24-48 hours.
                    </p>
                </div>
                <button onClick={() => navigate('/orders')} className="w-full py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#BC612C] transition-all shadow-xl shadow-black/10">Return to Vault</button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-32 font-sans text-gray-900">
            <div className="max-w-[800px] mx-auto px-6">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-12 transition-colors">
                    <ChevronLeft size={14} /> Back to acquisitions
                </button>

                <div className="space-y-20">
                    <header className="space-y-4">
                        <h1 className="text-5xl font-light tracking-tight text-gray-800">Request <span className="font-semibold">Return</span></h1>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                            Initialize the de-acquisition protocol for consignment #{id}. <br /> All items in this batch will be reviewed for return eligibility.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        {/* LEFT: REASON */}
                        <div className="space-y-12">
                            <div className="space-y-8">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C]">Reason for Retrieval</label>
                                <div className="space-y-4">
                                    {[
                                        "Aesthetic Mismatch",
                                        "Dimensional Inaccuracy (Fit)",
                                        "Quality Protocol Violation",
                                        "Incorrect Consignment Sent",
                                        "No Longer Required"
                                    ].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setReason(r)}
                                            className={`w-full text-left p-5 border text-[10px] font-bold uppercase tracking-widest transition-all ${reason === r ? 'bg-gray-900 border-gray-900 text-white translate-x-2' : 'bg-transparent border-gray-100 text-gray-400 hover:border-gray-300'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#BC612C] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10"
                            >
                                {submitting ? 'Initializing...' : (
                                    <>Submit Request <Send size={14} /></>
                                )}
                            </button>
                        </div>

                        {/* RIGHT: BATCH PREVIEW & POLICY */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Returning Batch Content</h4>
                                <div className="space-y-4 max-h-64 overflow-y-auto pr-4 no-scrollbar">
                                    {order?.items?.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center p-4 bg-white border border-gray-50">
                                            <div className="w-12 h-12 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale" />
                                            </div>
                                            <p className="text-[9px] font-bold uppercase text-gray-800 line-clamp-1">{item.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 border border-gray-100 space-y-6">
                                <div className="flex items-center gap-3 text-gray-800">
                                    <ShieldAlert size={20} strokeWidth={1} />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Retrieval Protocol</h4>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Items must maintain original designer tags.",
                                        "Packaging must be in pristine condition.",
                                        "Authentication certificates must be included.",
                                        "Retrieval scheduled upon request approval."
                                    ].map((bullet, i) => (
                                        <li key={i} className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-loose flex items-start gap-2">
                                            <span className="text-[#BC612C] mt-1.5">•</span> {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ReturnOrder;
