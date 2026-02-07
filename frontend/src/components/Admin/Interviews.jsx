import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllInterviewsAdmin, getInterviewDetailsAdmin } from "../../services/operations/interviewAPI";
import {
    Calendar, Clock, Award, User, FileText, Search,
    Filter, Download, Eye, TrendingUp, Users, Target, PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const AdminInterviews = () => {
    const { token } = useSelector((state) => state.auth);
    const [interviews, setInterviews] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchInterviews();
    }, [token, page, statusFilter]);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;

            const data = await getAllInterviewsAdmin(token, page, filters);
            setInterviews(data.interviews || []);
            setAnalytics(data.analytics || {});
            setPagination(data.pagination || {});
        } catch (error) {
            console.error("Failed to fetch interviews");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (interviewId) => {
        try {
            const details = await getInterviewDetailsAdmin(interviewId, token);
            setSelectedInterview(details);
            setShowDetailsModal(true);
        } catch (error) {
            console.error("Failed to fetch details");
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

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-green-500/10 text-green-500",
            started: "bg-yellow-500/10 text-yellow-500",
            failed: "bg-red-500/10 text-red-500"
        };
        return styles[status] || "bg-gray-500/10 text-gray-500";
    };

    const filteredInterviews = interviews.filter(interview =>
        searchQuery === "" ||
        interview.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Interview Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor all mock interviews and performance data
                    </p>
                </div>

                {/* Analytics Cards */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Total Interviews
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {analytics.totalInterviews || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Completed
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {analytics.completedInterviews || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <Target className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Avg Score
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {analytics.averageScore?.toFixed(1) || "N/A"}/10
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Award className="text-purple-600 dark:text-purple-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Avg Duration
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {formatDuration(analytics.averageDuration)}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <Clock className="text-orange-600 dark:text-orange-400" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="started">Started</option>
                            <option value="failed">Failed</option>
                        </select>

                        <button
                            onClick={fetchInterviews}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Interviews Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading interviews...</p>
                        </div>
                    ) : filteredInterviews.length === 0 ? (
                        <div className="text-center py-20">
                            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                No Interviews Found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Job Description
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Duration
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredInterviews.map((interview) => (
                                            <tr
                                                key={interview._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {interview.user?.name || "Unknown"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {interview.user?.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-900 dark:text-white truncate max-w-xs">
                                                        {interview.jobDescription || "N/A"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(interview.status)}`}>
                                                        {interview.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {interview.score ? (
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {interview.score}/10
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {formatDuration(interview.duration)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                    {formatDate(interview.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleViewDetails(interview._id)}
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {pagination.page} of {pagination.pages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                            disabled={page === pagination.pages}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
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
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Interview Details
                                </h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedInterview.user?.name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {selectedInterview.user?.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Score</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedInterview.score || "N/A"}/10
                                        </p>
                                    </div>
                                </div>

                                {selectedInterview.jobDescription && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                            Job Description
                                        </h3>
                                        <p className="text-gray-900 dark:text-white">
                                            {selectedInterview.jobDescription}
                                        </p>
                                    </div>
                                )}

                                {selectedInterview.transcript && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                            Transcript
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-64 overflow-y-auto">
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm">
                                                {selectedInterview.transcript}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.feedback && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                            Feedback & Summary
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                {selectedInterview.feedback}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.recordingUrl && (
                                    <a
                                        href={selectedInterview.recordingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                                    >
                                        <PlayCircle size={20} />
                                        Play Recording
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminInterviews;
