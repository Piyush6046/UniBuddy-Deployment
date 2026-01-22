import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        fetchAcademicData();
    }, []);

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
            <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-richblack-900">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Pointer Helper</h1>
                            <p className="text-gray-400 mt-1">
                                Track, analyze, and predict your academic performance
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-300 mb-1">CGPA</p>
                                    <p className="text-3xl font-bold text-white">
                                        {academicData?.cgpa || "0.00"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {academicData?.cgpa >= 9
                                            ? "Excellent"
                                            : academicData?.cgpa >= 8
                                                ? "Very Good"
                                                : academicData?.cgpa >= 7
                                                    ? "Good"
                                                    : "Keep Going"}
                                    </p>
                                </div>
                                <Award className="w-12 h-12 text-green-400 opacity-50" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 }}
                            className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-300 mb-1">Semesters</p>
                                    <p className="text-3xl font-bold text-white">
                                        {academicData?.semesters.length || 0}/8
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Completed</p>
                                </div>
                                <BookOpen className="w-12 h-12 text-blue-400 opacity-50" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-300 mb-1">Total Credits</p>
                                    <p className="text-3xl font-bold text-white">
                                        {academicData?.totalCreditsEarned || 0}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Earned</p>
                                </div>
                                <GraduationCap className="w-12 h-12 text-purple-400 opacity-50" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 }}
                            className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-300 mb-1">Latest SGPA</p>
                                    <p className="text-3xl font-bold text-white">
                                        {academicData?.semesters.length > 0
                                            ? academicData.semesters[
                                                academicData.semesters.length - 1
                                            ].sgpa.toFixed(2)
                                            : "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Current Semester</p>
                                </div>
                                <CalcIcon className="w-12 h-12 text-orange-400 opacity-50" />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Tabs Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-richblack-800 border border-richblack-700 rounded-2xl p-2 mb-6 overflow-x-auto"
                >
                    <div className="flex gap-2 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-gray-400 hover:text-white hover:bg-richblack-700"
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
