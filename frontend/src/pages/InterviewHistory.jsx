import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInterviewHistory, getInterviewDetails } from "../services/operations/interviewAPI";
import {
    Calendar, Clock, Award, FileText, Download,
    TrendingUp, Play, MessageSquare, ChevronRight,
    BarChart2, Target, CheckCircle2, XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const InterviewHistory = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        if (token) {
            fetchHistory();
        }
    }, [token]);

    const fetchHistory = async () => {
        setLoading(true);
        const data = await getInterviewHistory(token);
        setInterviews(data.interviews || []);
        setStats(data.stats || {});
        setLoading(false);
    };

    const handleViewDetails = async (interviewId, status) => {
        // Show message for non-completed interviews
        if (status !== "completed") {
            toast.error("This interview hasn't been completed yet. Complete data will be available after the interview finishes.");
            return;
        }

        try {
            const details = await getInterviewDetails(interviewId, token);
            setSelectedInterview(details);
            setShowDetailsModal(true);
        } catch (error) {
            console.error("Failed to fetch details:", error);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "N/A";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "text-green-500";
            case "started": return "text-yellow-500";
            case "failed": return "text-red-500";
            default: return "text-gray-500";
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8) return "text-green-500";
        if (score >= 6) return "text-yellow-500";
        if (score >= 4) return "text-orange-500";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs uppercase tracking-[0.2em] mb-4">
                        <BarChart2 size={14} /> Interview Analytics
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
                        Performance History
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Track your mock interview progress and performance
                    </p>
                </div>

                {/* Stats Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <FileText className="text-blue-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Total Interviews</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                                        {stats.totalInterviews || 0}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <CheckCircle2 className="text-green-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Completed</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                                        {stats.completedInterviews || 0}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <Target className="text-purple-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Avg Score</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                                        {stats.averageScore || "N/A"}/10
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-500/10 rounded-xl">
                                    <Clock className="text-orange-500" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-[var(--text-secondary)]">Total Time</p>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">
                                        {formatDuration(stats.totalDuration)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Interview List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
                            <p className="mt-4 text-[var(--text-secondary)]">Loading history...</p>
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl">
                            <FileText className="mx-auto mb-4 text-[var(--text-tertiary)]" size={48} />
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                No Interviews Yet
                            </h3>
                            <p className="text-[var(--text-secondary)]">
                                Start your first mock interview to see your history here
                            </p>
                        </div>
                    ) : (
                        interviews.map((interview, index) => (
                            <motion.div
                                key={interview._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent)] transition-all group ${interview.status === 'completed' ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                                    }`}
                                onClick={() => handleViewDetails(interview._id, interview.status)}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                                {interview.jobDescription || "Mock Interview"}
                                            </h3>
                                            <span className={`text-sm font-medium ${getStatusColor(interview.status)}`}>
                                                {interview.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {formatDate(interview.createdAt)}
                                            </div>
                                            {interview.duration && (
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    {formatDuration(interview.duration)}
                                                </div>
                                            )}
                                            {interview.score && (
                                                <div className="flex items-center gap-2">
                                                    <Award size={16} className={getScoreColor(interview.score)} />
                                                    <span className={getScoreColor(interview.score)}>
                                                        Score: {interview.score}/10
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {interview.recordingUrl && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(interview.recordingUrl, '_blank');
                                                }}
                                                className="p-2 hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                                                title="Play Recording"
                                            >
                                                <Play size={20} className="text-[var(--accent)]" />
                                            </button>
                                        )}
                                        <ChevronRight
                                            size={20}
                                            className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors"
                                        />
                                    </div>
                                </div>

                                {interview.feedback && (
                                    <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                            {interview.feedback}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedInterview && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowDetailsModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                Interview Details
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                                        Job Description
                                    </h3>
                                    <p className="text-[var(--text-primary)]">
                                        {selectedInterview.jobDescription || "No description provided"}
                                    </p>
                                </div>

                                {selectedInterview.transcript && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                                            Transcript
                                        </h3>
                                        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 max-h-64 overflow-y-auto">
                                            <p className="text-[var(--text-primary)] whitespace-pre-wrap">
                                                {selectedInterview.transcript}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.feedback && (
                                    <div>
                                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                                            Feedback & Summary
                                        </h3>
                                        <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                                            <p className="text-[var(--text-primary)] whitespace-pre-wrap">
                                                {selectedInterview.feedback}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    {selectedInterview.recordingUrl && (
                                        <a
                                            href={selectedInterview.recordingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-[var(--accent)] text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity text-center"
                                        >
                                            <Play className="inline mr-2" size={18} />
                                            Play Recording
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] py-3 px-6 rounded-xl font-semibold hover:bg-[var(--bg-tertiary)] transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InterviewHistory;
