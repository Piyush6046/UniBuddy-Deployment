import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ClipboardList, Upload, Mic, MicOff, PhoneOff, Award, Clock, Briefcase } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { startInterview } from "../services/operations/interviewAPI";
import { motion, AnimatePresence } from "framer-motion";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || "");

const MockInterview = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [callStatus, setCallStatus] = useState("idle"); // idle, connecting, active
    const [interviewStartedAt, setInterviewStartedAt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        vapi.on("call-start", () => {
            setCallStatus("active");
            setIsInterviewing(true);
            setInterviewStartedAt(Date.now());
            const duration = user?.isPremium ? 1800 : 300;
            setTimeLeft(duration);
        });

        vapi.on("call-end", () => {
            setCallStatus("idle");
            setIsInterviewing(false);
            setInterviewStartedAt(null);
            setTimeLeft(null);
            setTranscript("");
            toast.success("Interview completed!");
        });

        vapi.on("message", (message) => {
            if (message.type === "transcript") {
                setTranscript(message.transcript);
            }
        });

        vapi.on("error", (error) => {
            console.error("Vapi Error:", error);
            toast.error("An error occurred during the call.");
            setCallStatus("idle");
            setIsInterviewing(false);
        });

        return () => {
            vapi.stop();
        };
    }, [user]);

    useEffect(() => {
        let timer;
        if (isInterviewing && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            vapi.stop();
            toast.info("Interview time limit reached!");
        }
        return () => clearInterval(timer);
    }, [isInterviewing, timeLeft]);

    const handleStartInterview = async () => {
        if (!resume || !jobDescription) {
            toast.error("Please upload your resume and enter a job description.");
            return;
        }

        if (!import.meta.env.VITE_VAPI_PUBLIC_KEY) {
            toast.error("Vapi Public Key is missing. Please check your configuration.");
            return;
        }

        setCallStatus("connecting");
        const assistant = await startInterview(resume, jobDescription, token);

        if (assistant) {
            try {
                await vapi.start(assistant.id);
            } catch (err) {
                console.error("Vapi Start Error:", err);
                setCallStatus("idle");
            }
        } else {
            setCallStatus("idle");
        }
    };

    const handleStopInterview = () => {
        vapi.stop();
    };

    const toggleMute = () => {
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="page-wrapper bg-[#f8fafc] dark:bg-[#020617]">
            <div className="container py-12">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4"
                    >
                        <Award size={16} />
                        AI Mock Interview
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Sharpen Your Interview Skills
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Upload your resume, provide a job description, and practice with our AI-powered technical interviewer.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card shadow-xl border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
                    >
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <Upload size={18} className="text-blue-500" />
                                    Upload Resume (PDF)
                                </label>
                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all ${resume ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-slate-300 dark:border-slate-700 hover:border-blue-400"
                                        }`}
                                >
                                    <div className="space-y-1 text-center">
                                        <div className="mx-auto h-12 w-12 text-slate-400 flex items-center justify-center">
                                            <Briefcase size={32} />
                                        </div>
                                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span>{resume ? resume.name : "Upload a file"}</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".pdf"
                                                    onChange={(e) => setResume(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                        {!resume && <p className="text-xs text-slate-500">PDF up to 10MB</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                    <ClipboardList size={18} className="text-blue-500" />
                                    Job Description
                                </label>
                                <textarea
                                    rows={6}
                                    className="input resize-none"
                                    placeholder="Paste the job description here to tailor the interview..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-amber-600" size={20} />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                            {user?.isPremium ? "Premium Access: 30 Min Session" : "Free Trial: 5 Min Session"}
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400">
                                            {user?.isPremium ? "Practice deep technical rounds without time pressure." : "Upgrade to Premium for longer sessions."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartInterview}
                                disabled={callStatus !== "idle"}
                                className="btn btn-primary w-full py-4 text-lg font-bold shadow-blue-500/20"
                            >
                                {callStatus === "connecting" ? (
                                    <span className="flex items-center gap-2">
                                        <div className="loader w-5 h-5 border-2" /> Initializing...
                                    </span>
                                ) : (
                                    "Start Your Interview"
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Visualization / Call Status Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative h-full min-h-[500px]"
                    >
                        <AnimatePresence mode="wait">
                            {!isInterviewing ? (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card h-full flex flex-col items-center justify-center text-center p-12 bg-slate-100 dark:bg-slate-900/50 border-none"
                                >
                                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                        <Mic size={40} className="text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Voice Interview Active</h3>
                                    <p className="text-slate-500 max-w-xs">
                                        Your interview will be voice-based. Make sure you're in a quiet place and your microphone is ready.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card h-full flex flex-col items-center justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white overflow-hidden"
                                >
                                    {/* Pulse Effect */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-64 h-64 rounded-full bg-white/20"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
                                            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                                            className="w-96 h-96 rounded-full bg-white/10"
                                        />
                                    </div>

                                    <div className="relative z-10 w-full flex justify-between items-start">
                                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-sm font-bold tracking-wider">LIVE INTERVIEW</span>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                                            <Clock size={16} />
                                            <span className="text-sm font-bold font-mono">{formatTime(timeLeft)}</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-6 shadow-2xl">
                                            <div className="flex gap-1 items-end h-8">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [10, 32, 10] }}
                                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-2 bg-blue-600 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-center">AI Interviewer is listening...</h3>
                                        <p className="text-blue-100 mt-2 h-12 text-center overflow-hidden">
                                            {transcript || "Speak naturally"}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex gap-4">
                                        <button
                                            onClick={toggleMute}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/20 text-red-100 border-2 border-red-500" : "bg-white/20 text-white hover:bg-white/30"
                                                }`}
                                        >
                                            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                        </button>
                                        <button
                                            onClick={handleStopInterview}
                                            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                                        >
                                            <PhoneOff size={24} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MockInterview;
