
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    TrendingUp,
    GraduationCap,
    Target,
    Award,
    BookOpen,
    Calculator as CalcIcon,
} from "lucide-react";
import Analytics from "../components/Academic/Analytics";
import Pointers from "../components/Academic/Pointers";
import Predictor from "../components/Academic/Predictor";
import Calculator from "../components/Academic/Calculator";
import { getAcademicData } from "../services/operations/academicAPI";

const PointerHelper = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const [activeTab, setActiveTab] = useState("analytics");
    const [academicData, setAcademicData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState(null);

    const tabs = [
        {
            id: "analytics",
            name: "Analytics",
            icon: <TrendingUp className="w-5 h-5" />,
        },
        {
            id: "pointers",
            name: "Pointers",
            icon: <GraduationCap className="w-5 h-5" />,
        },
        {
            id: "predictor",
            name: "Predictor",
            icon: <Target className="w-5 h-5" />,
        },
    ];

    useEffect(() => {
        if (token) {
            fetchAcademicData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchAcademicData = async () => {
        try {
            setLoading(true);
            const response = await getAcademicData();
            setAcademicData(response.data);
        } catch (error) {
            console.error("Error fetching academic data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSemester = (semester = null) => {
        setEditingSemester(semester);
        setIsCalculatorOpen(true);
    };

    const handleCalculatorClose = () => {
        setIsCalculatorOpen(false);
        setEditingSemester(null);
    };

    const handleCalculatorSuccess = () => {
        fetchAcademicData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-[80vh] bg-[var(--bg-primary)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalcIcon className="w-10 h-10 text-[var(--accent)]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Log in to track performance</h2>
                    <p className="text-[var(--text-secondary)] mb-8">
                        The Pointer Helper requires an account to securely save and track your academic data over time.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="btn btn-primary w-full h-12 text-lg font-bold shadow-lg"
                        >
                            Log In to Continue
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="btn btn-ghost w-full h-11"
                        >
                            Create an Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-inter">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-r from-[var(--accent)] to-purple-500 p-3 rounded-2xl shadow-lg">
                            <Award className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Pointer Helper</h1>
                            <p className="text-[var(--text-secondary)] mt-1">
                                Track, analyze, and predict your academic performance
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                label: "CGPA",
                                value: academicData?.cgpa || "0.00",
                                sub: academicData?.cgpa >= 9 ? "Excellent" : academicData?.cgpa >= 8 ? "Very Good" : academicData?.cgpa >= 7 ? "Good" : "Keep Going",
                                icon: Award,
                                color: "border-green-500/20 bg-green-500/5 text-green-500"
                            },
                            {
                                label: "Semesters",
                                value: `${academicData?.semesters.length || 0}/8`,
                                sub: "Completed",
                                icon: BookOpen,
                                color: "border-blue-500/20 bg-blue-500/5 text-blue-500"
                            },
                            {
                                label: "Total Credits",
                                value: academicData?.totalCreditsEarned || 0,
                                sub: "Earned",
                                icon: GraduationCap,
                                color: "border-purple-500/20 bg-purple-500/5 text-purple-500"
                            },
                            {
                                label: "Latest SGPA",
                                value: academicData?.semesters.length > 0 ? academicData.semesters[academicData.semesters.length - 1].sgpa.toFixed(2) : "N/A",
                                sub: "Current Semester",
                                icon: CalcIcon,
                                color: "border-orange-500/20 bg-orange-500/5 text-orange-500"
                            }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className={`card p-6 border ${stat.color} flex items-center justify-between group hover:scale-[1.02] transition-transform`}
                            >
                                <div>
                                    <p className="text-sm font-medium mb-1 opacity-80">{stat.label}</p>
                                    <p className="text-3xl font-bold text-[var(--text-primary)]">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs opacity-60 mt-1">{stat.sub}</p>
                                </div>
                                <stat.icon className={`w-12 h-12 opacity-30 group-hover:opacity-100 transition-opacity`} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tabs Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-2 mb-6 overflow-x-auto bg-[var(--bg-card)] border-[var(--border)]"
                >
                    <div className="flex gap-2 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[var(--accent)] to-yellow-500 text-black shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                                    }`}
                            >
                                {tab.icon}
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                >
                    {activeTab === "analytics" && <Analytics academicData={academicData} />}
                    {activeTab === "pointers" && (
                        <Pointers
                            academicData={academicData}
                            onRefresh={fetchAcademicData}
                            onAddSemester={handleAddSemester}
                        />
                    )}
                    {activeTab === "predictor" && (
                        <Predictor academicData={academicData} onRefresh={fetchAcademicData} />
                    )}
                </motion.div>
            </div>

            {/* Calculator Modal */}
            <Calculator
                isOpen={isCalculatorOpen}
                onClose={handleCalculatorClose}
                onSuccess={handleCalculatorSuccess}
                existingSemester={editingSemester}
            />
        </div>
    );
};

export default PointerHelper;
