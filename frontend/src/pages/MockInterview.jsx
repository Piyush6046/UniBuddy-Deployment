import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Briefcase, Upload, Mic, FileText, Sparkles, Clock, Award } from "lucide-react";
import { startInterview } from "../services/operations/interviewAPI";
import { motion } from "framer-motion";

const MockInterview = () => {
    const { token, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [duration, setDuration] = useState(300); // 5 mins default
    const [loading, setLoading] = useState(false);

    const durationOptions = [
        { value: 300, label: "5 Minutes", premium: false },
        { value: 600, label: "10 Minutes", premium: true },
        { value: 900, label: "15 Minutes", premium: true },
        { value: 1800, label: "30 Minutes", premium: true },
    ];

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setResume(file);
            toast.success("Resume uploaded!");
        } else {
            toast.error("Please upload a PDF file");
        }
    };

    const startCall = async () => {
        if (!resume) {
            toast.error("Please upload your resume first");
            return;
        }

        if (!jobDescription.trim()) {
            toast.error("Please enter a job description");
            return;
        }

        setLoading(true);

        try {
            const response = await startInterview(resume, jobDescription, token, duration);

            if (response?.assistant) {
                console.log("✅ Interview session created:", response.assistant.id);
                navigate(`/interview-room/${response.assistant.id}`, {
                    state: { duration }
                });
            } else {
                throw new Error("No assistant configuration received");
            }
        } catch (error) {
            console.error("Failed to start interview:", error);
            toast.error(error.response?.data?.message || "Failed to start interview");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-bold uppercase tracking-wider mb-4"
                    >
                        <Sparkles size={16} />
                        AI-Powered Mock Interview
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
                    >
                        Practice & Perfect Your Interview Skills
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
                    >
                        Upload your resume, describe the role, and practice with our AI interviewer for real-time feedback
                    </motion.p>
                </div>

                {/* Setup Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <Briefcase className="text-[var(--accent)]" size={24} />
                        Interview Setup
                    </h2>

                    <div className="space-y-6">
                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <Upload size={18} className="text-[var(--accent)]" />
                                Upload Resume (PDF)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResumeChange}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${resume
                                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                                        : "border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
                                        }`}
                                >
                                    {resume ? (
                                        <div className="text-center">
                                            <FileText className="mx-auto mb-2 text-[var(--accent)]" size={32} />
                                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                                {resume.name}
                                            </p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                Click to change
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto mb-2 text-[var(--text-tertiary)]" size={32} />
                                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                                Click to upload
                                            </p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                PDF up to 10MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <Briefcase size={18} className="text-[var(--accent)]" />
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here to tailor the interview questions..."
                                className="w-full h-32 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                            />
                        </div>

                        {/* Duration Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <Clock size={18} className="text-[var(--accent)]" />
                                Interview Duration
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {durationOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            if (option.premium && !user?.isPremium) {
                                                toast.error("Upgrade to Premium for longer sessions");
                                                return;
                                            }
                                            setDuration(option.value);
                                        }}
                                        disabled={option.premium && !user?.isPremium}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${duration === option.value
                                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                                            : "border-[var(--border)] hover:border-[var(--accent)]/50"
                                            } ${option.premium && !user?.isPremium
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
                                            }`}
                                    >
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-[var(--text-primary)]">
                                                {option.value / 60}
                                            </p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                minutes
                                            </p>
                                        </div>
                                        {option.premium && (
                                            <div className="absolute top-1 right-1">
                                                <Award className="text-yellow-500" size={14} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {!user?.isPremium && (
                                <p className="text-xs text-[var(--text-secondary)] mt-2 flex items-center gap-1">
                                    <Award size={12} className="text-yellow-500" />
                                    Premium users get access to longer interview sessions
                                </p>
                            )}
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={startCall}
                            disabled={loading || !resume || !jobDescription.trim()}
                            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Preparing Interview...
                                </>
                            ) : (
                                <>
                                    <Mic size={20} />
                                    Start Your Interview
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MockInterview;
