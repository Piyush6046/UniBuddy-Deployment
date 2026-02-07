import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mic, MicOff, PhoneOff, User, Bot } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || "");

const InterviewRoom = () => {
    const { assistantId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);

    // Get duration from navigation state, fallback to 5 minutes (300 seconds)
    const INTERVIEW_DURATION = location.state?.duration || 300;

    const [showEnterModal, setShowEnterModal] = useState(true);
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION);
    const [startTime, setStartTime] = useState(null);
    const [currentCaption, setCurrentCaption] = useState("");
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);

    // Countdown Timer
    useEffect(() => {
        if (startTime && isInterviewing) {
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = Math.max(0, INTERVIEW_DURATION - elapsed);
                setTimeRemaining(remaining);

                if (remaining === 0) {
                    endCall();
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [startTime, isInterviewing]);

    useEffect(() => {
        if (!assistantId) {
            toast.error("No interview session found");
            navigate("/mock-interview");
            return;
        }

        vapi.on("call-start", () => {
            setIsInterviewing(true);
            setStartTime(Date.now());
            setCurrentCaption("Hello! I'm your AI interviewer. Let's begin with your introduction.");
        });

        vapi.on("call-end", () => {
            setIsInterviewing(false);
            toast.success("Interview completed!");
            setTimeout(() => navigate("/interview-history"), 2000);
        });

        vapi.on("speech-start", () => {
            setIsAiSpeaking(true);
        });

        vapi.on("speech-end", () => {
            setIsAiSpeaking(false);
        });

        vapi.on("message", (message) => {
            if (message.type === "transcript" && message.role === "assistant" && message.transcript) {
                setCurrentCaption(message.transcript);
            }
        });

        vapi.on("error", (error) => {
            console.error("Vapi Error:", error);
            toast.error("Interview error occurred");
        });

        return () => {
            vapi.removeAllListeners();
            if (isInterviewing) {
                vapi.stop();
            }
        };
    }, [assistantId, navigate]);

    const startCall = async () => {
        try {
            setShowEnterModal(false);
            await vapi.start(assistantId, {
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en"
                }
            });
        } catch (error) {
            console.error("Failed to start:", error);
            toast.error("Failed to start interview");
        }
    };

    const endCall = async () => {
        vapi.stop();

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/interview/manual-complete`,
                { assistantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Failed to mark complete:", error);
        }

        navigate("/interview-history");
    };

    const toggleMute = () => {
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
        toast.success(isMuted ? "Unmuted" : "Muted");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Enter Room Modal
    if (showEnterModal) {
        return (
            <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-10 max-w-md w-full shadow-2xl"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mic className="text-[var(--accent)]" size={36} />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                            Ready to Start?
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-2">
                            Duration: <span className="text-[var(--text-primary)] font-semibold">{INTERVIEW_DURATION / 60} minutes</span>
                        </p>
                        <p className="text-[var(--text-tertiary)] text-sm mb-8">
                            Click below to enter the interview room
                        </p>

                        <button
                            onClick={startCall}
                            className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-bold text-lg mb-3 transition-all"
                        >
                            Enter Interview Room
                        </button>
                        <button
                            onClick={() => navigate("/mock-interview")}
                            className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl font-medium transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Fullscreen Interview Room
    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] overflow-hidden">
            <div className="h-full w-full flex flex-col">
                {/* Top Bar - Timer */}
                <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">Recording</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[var(--text-secondary)]">Time Remaining</span>
                            <div className={`font-mono text-2xl font-bold ${timeRemaining < 300 ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex items-center justify-center gap-8 p-8">
                    {/* AI Interviewer - Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-80 h-[450px] bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg relative"
                    >
                        <div className={`absolute inset-0 rounded-2xl transition-all ${isAiSpeaking ? 'ring-2 ring-[var(--accent)]' : ''}`} />

                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                                <Bot className="text-[var(--accent)]" size={64} />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">AI Interviewer</h3>

                        <div className="flex items-center gap-2 text-sm">
                            {isAiSpeaking ? (
                                <>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-3 bg-[var(--accent)] rounded-full animate-pulse" />
                                        <div className="w-1 h-4 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                                        <div className="w-1 h-3 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    </div>
                                    <span className="text-[var(--accent)] font-medium">Speaking...</span>
                                </>
                            ) : (
                                <span className="text-[var(--text-secondary)]">Listening</span>
                            )}
                        </div>
                    </motion.div>

                    {/* Caption Box - Center */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 max-w-2xl"
                    >
                        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 min-h-[200px] flex items-center justify-center shadow-lg">
                            <AnimatePresence mode="wait">
                                {currentCaption ? (
                                    <motion.p
                                        key={currentCaption}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-[var(--text-primary)] text-center text-xl leading-relaxed"
                                    >
                                        {currentCaption}
                                    </motion.p>
                                ) : (
                                    <p className="text-[var(--text-tertiary)] text-center">
                                        Waiting for AI to speak...
                                    </p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Student - Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-80 h-[450px] bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg relative"
                    >
                        <div className={`absolute inset-0 rounded-2xl transition-all ${isMuted ? 'ring-2 ring-red-500' : ''}`} />

                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-[var(--accent)]/10 rounded-full flex items-center justify-center">
                                <User className="text-[var(--accent)]" size={64} />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">You</h3>

                        <div className="flex items-center gap-2 text-sm">
                            {isMuted ? (
                                <>
                                    <MicOff className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500 font-medium">Muted</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[var(--text-secondary)]">Active</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Controls */}
                <div className="bg-[var(--card-bg)] border-t border-[var(--border)] px-8 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all ${isMuted
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)]"
                                }`}
                        >
                            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            {isMuted ? "Unmute" : "Mute"}
                        </button>

                        <button
                            onClick={endCall}
                            className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center gap-3 transition-all"
                        >
                            <PhoneOff size={20} />
                            End Interview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;
