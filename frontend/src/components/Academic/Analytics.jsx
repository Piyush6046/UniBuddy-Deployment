import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Award,
    Target,
    BookOpen,
    Calendar,
    Sparkles,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = ({ academicData }) => {
    const [insights, setInsights] = useState([]);
    const { isDark } = useTheme();

    useEffect(() => {
        if (academicData && academicData.semesters.length > 0) {
            generateInsights();
        }
    }, [academicData]);

    const generateInsights = () => {
        const semesters = academicData.semesters;
        const newInsights = [];

        // Check for improvement
        if (semesters.length >= 2) {
            const latest = semesters[semesters.length - 1].sgpa;
            const previous = semesters[semesters.length - 2].sgpa;
            if (latest > previous) {
                newInsights.push({
                    icon: <TrendingUp className="w-5 h-5" />,
                    text: "Excellent improvement! Your SGPA has increased significantly in the latest semester.",
                    type: "success",
                });
            } else if (latest < previous) {
                newInsights.push({
                    icon: <Target className="w-5 h-5" />,
                    text: "Your SGPA decreased slightly. Focus on strengthening weak areas.",
                    type: "warning",
                });
            }
        }

        // Check performance level
        const currentCGPA = parseFloat(academicData.cgpa);
        if (currentCGPA >= 9.0) {
            newInsights.push({
                icon: <Award className="w-5 h-5" />,
                text: "Outstanding! You're performing exceptionally well academically.",
                type: "success",
            });
        } else if (currentCGPA >= 8.0) {
            newInsights.push({
                icon: <Sparkles className="w-5 h-5" />,
                text: "Great work! You're performing very well academically.",
                type: "success",
            });
        }

        setInsights(newInsights);
    };

    // Chart data
    const chartData = {
        labels: academicData?.semesters.map((sem) => `Sem ${sem.semesterNumber}`) || [],
        datasets: [
            {
                label: "SGPA",
                data: academicData?.semesters.map((sem) => sem.sgpa) || [],
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: "rgb(59, 130, 246)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
            {
                label: "CGPA",
                data: academicData?.semesters.map((_, index) => {
                    const semestersUpToNow = academicData.semesters.slice(0, index + 1);
                    let totalPoints = 0;
                    let totalCredits = 0;
                    semestersUpToNow.forEach((sem) => {
                        totalPoints += sem.sgpa * sem.totalCredits;
                        totalCredits += sem.totalCredits;
                    });
                    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
                }) || [],
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: "rgb(34, 197, 94)",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    // Chart Colors
    const textColor = isDark ? "#e5e7eb" : "#374151";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: textColor,
                    font: {
                        size: 12,
                        weight: "500",
                    },
                    padding: 15,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                titleColor: "#f9fafb",
                bodyColor: "#e5e7eb",
                borderColor: "rgba(59, 130, 246, 0.3)",
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 10,
                grid: {
                    color: gridColor,
                    drawBorder: false,
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        size: 11,
                    },
                    stepSize: 1,
                },
            },
            x: {
                grid: {
                    color: gridColor,
                    drawBorder: false,
                },
                ticks: {
                    color: "#9ca3af",
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Performance Insights */}
            {insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 border-[var(--border)]"
                >
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Performance Insights
                    </h3>
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 p-4 rounded-xl ${insight.type === "success"
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-yellow-500/10 border border-yellow-500/20"
                                    }`}
                            >
                                <div
                                    className={`${insight.type === "success" ? "text-green-500" : "text-yellow-500"
                                        }`}
                                >
                                    {insight.icon}
                                </div>
                                <p
                                    className={`text-sm ${insight.type === "success" ? "text-green-600 dark:text-green-100" : "text-yellow-600 dark:text-yellow-100"
                                        }`}
                                >
                                    {insight.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Graph Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 border-[var(--border)]"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        SGPA & CGPA Trends
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] font-normal">
                        Track your academic progress
                    </p>
                </div>
                {academicData?.semesters.length > 0 ? (
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                ) : (
                    <div className="h-80 flex items-center justify-center">
                        <div className="text-center">
                            <BookOpen className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                            <p className="text-[var(--text-muted)]">No semester data available yet</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-2">
                                Add your first semester to see analytics
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Grade Distribution */}
            {academicData?.semesters.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-500 mb-1">Total Semesters</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {academicData.semesters.length}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Completed</p>
                            </div>
                            <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-500 mb-1">Total Credits</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {academicData.totalCreditsEarned}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Earned</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-green-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-500 mb-1">Latest SGPA</p>
                                <p className="text-3xl font-bold text-[var(--text-primary)]">
                                    {academicData.semesters[academicData.semesters.length - 1]?.sgpa.toFixed(2)}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Current Semester</p>
                            </div>
                            <Award className="w-12 h-12 text-purple-500 opacity-20" />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Analytics;
