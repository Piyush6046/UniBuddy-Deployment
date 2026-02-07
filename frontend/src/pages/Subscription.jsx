import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Award, CheckCircle, Zap, Clock, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buyPremium } from "../services/operations/paymentAPI";

const Subscription = () => {
    const { token, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuy = () => {
        buyPremium(token, user, navigate, dispatch);
    };

    const features = [
        {
            icon: <Zap size={24} className="text-blue-500" />,
            title: "Unlimited Sessions",
            desc: "Conduct as many mock interviews as you need. No more credits."
        },
        {
            icon: <Clock size={24} className="text-orange-500" />,
            title: "30-Minute Rounds",
            desc: "Go deep into technical topics with extended interview sessions."
        },
        {
            icon: <Sparkles size={24} className="text-purple-500" />,
            title: "Elite AI Roadmap",
            desc: "Get advanced AI analysis and a customized improvement plan."
        },
        {
            icon: <ShieldCheck size={24} className="text-green-500" />,
            title: "Priority Access",
            desc: "Faster connection times and access to the latest AI models."
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm uppercase tracking-widest">Go Back</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4">
                                <Award size={14} /> Premium Access
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
                                Unlock Your <br />
                                <span className="text-[var(--accent)]">Dream Career</span>
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-4 text-lg leading-relaxed">
                                Join hundreds of students who used our AI to land jobs at top tech companies. Get lifetime access today.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">{f.title}</h4>
                                        <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Pricing Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--bg-card)] border-2 border-[var(--accent)] p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <span className="bg-[var(--accent)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                Lifetime
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Premium Member</h3>
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-2xl font-bold text-[var(--text-secondary)]">₹</span>
                                <span className="text-6xl font-black text-[var(--text-primary)] tracking-tighter">50</span>
                            </div>
                            <p className="text-[var(--text-muted)] text-sm mt-2 font-bold uppercase tracking-widest">One-time payment</p>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Unlimited AI Interviews",
                                "30 Min Session Duration",
                                "Advanced Tech Feedback",
                                "No Monthly Fees",
                                "Lifetime Updates"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
                                    <CheckCircle size={18} className="text-[var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleBuy}
                            className="btn btn-primary w-full py-5 text-xl font-black shadow-xl shadow-[var(--accent)]/20 active:scale-95 transition-all"
                        >
                            GET ACCESS NOW
                        </button>

                        <p className="text-center text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
                            <ShieldCheck size={14} /> Secure Razorpay Payment
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
