import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { predictTargetCGPA, setTargetCGPA } from "../../services/operations/academicAPI";

const Predictor = ({ academicData, onRefresh }) => {
    const [targetCGPA, setTargetCGPALocal] = useState(
        academicData?.targetCGPA || ""
    );
    const [remainingSemesters, setRemainingSemesters] = useState("");
    const [creditsPerSemester, setCreditsPerSemester] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSetTarget = async () => {
        if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
            alert("Please enter a valid target CGPA (0-10)");
            return;
        }

        try {
            await setTargetCGPA(parseFloat(targetCGPA));
            onRefresh();
        } catch (error) {
            console.error("Error setting target CGPA:", error);
        }
    };

    const handlePredict = async () => {
        if (!targetCGPA || !remainingSemesters || !creditsPerSemester) {
            alert("Please fill all fields");
            return;
        }

        if (academicData?.semesters.length === 0) {
            alert("Please add at least one semester data first");
            return;
        }

        setLoading(true);
        try {
            const result = await predictTargetCGPA({
                targetCGPA: parseFloat(targetCGPA),
                remainingSemesters: parseInt(remainingSemesters),
                creditsPerSemester: parseFloat(creditsPerSemester),
            });
            setPrediction(result.data);
        } catch (error) {
            console.error("Error predicting:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSuggestions = () => {
        if (!prediction) return [];

        const requiredSGPA = parseFloat(prediction.requiredSGPA);
        const suggestions = [];

        if (requiredSGPA >= 9) {
            suggestions.push({
                title: "Aim for Excellence",
                text: "Focus on achieving AA and AB grades in all subjects",
                icon: <Sparkles className="w-5 h-5" />,
                color: "blue",
            });
        } else if (requiredSGPA >= 8) {
            suggestions.push({
                title: "Maintain Strong Performance",
                text: "Target AB and BB grades consistently",
                icon: <TrendingUp className="w-5 h-5" />,
                color: "green",
            });
        } else if (requiredSGPA >= 7) {
            suggestions.push({
                title: "Steady Improvement",
                text: "BB and BC grades will help you reach your target",
                icon: <CheckCircle2 className="w-5 h-5" />,
                color: "yellow",
            });
        }

        suggestions.push({
            title: "Strategic Planning",
            text: "Prioritize subjects with higher credits for maximum impact",
            icon: <Target className="w-5 h-5" />,
            color: "purple",
        });

        return suggestions;
    };

    return (
        <div className="space-y-6">
            {/* Current Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                    <p className="text-sm text-blue-300 mb-2">Current CGPA</p>
                    <p className="text-3xl font-bold text-white">
                        {academicData?.cgpa || "0.00"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Your overall performance</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                    <p className="text-sm text-green-300 mb-2">Semesters Completed</p>
                    <p className="text-3xl font-bold text-white">
                        {academicData?.semesters.length || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Total semesters done</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                    <p className="text-sm text-purple-300 mb-2">Target CGPA</p>
                    <p className="text-3xl font-bold text-white">
                        {academicData?.targetCGPA || "--"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Your goal</p>
                </div>
            </motion.div>

            {/* Prediction Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    CGPA Target Predictor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Target CGPA *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={targetCGPA}
                            onChange={(e) => setTargetCGPALocal(e.target.value)}
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 8.5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Remaining Semesters *
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={remainingSemesters}
                            onChange={(e) => setRemainingSemesters(e.target.value)}
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 4"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Credits per Semester *
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={creditsPerSemester}
                            onChange={(e) => setCreditsPerSemester(e.target.value)}
                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 24"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSetTarget}
                        className="px-6 py-3 bg-richblack-700 hover:bg-richblack-600 text-white rounded-xl font-medium transition-colors"
                        disabled={!targetCGPA}
                    >
                        Save Target
                    </button>
                    <button
                        onClick={handlePredict}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !targetCGPA || !remainingSemesters || !creditsPerSemester}
                    >
                        {loading ? "Calculating..." : "Predict"}
                    </button>
                </div>
            </motion.div>

            {/* Prediction Result */}
            {prediction && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    {/* Main Result */}
                    <div
                        className={`p-6 rounded-2xl border ${prediction.achievable
                                ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
                                : "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`p-3 rounded-xl ${prediction.achievable
                                        ? "bg-green-500/20 border border-green-500/30"
                                        : "bg-red-500/20 border border-red-500/30"
                                    }`}
                            >
                                {prediction.achievable ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4
                                    className={`text-lg font-semibold mb-2 ${prediction.achievable ? "text-green-100" : "text-red-100"
                                        }`}
                                >
                                    {prediction.achievable
                                        ? "Target is Achievable!"
                                        : "Target May Be Difficult"}
                                </h4>
                                <p
                                    className={`text-sm ${prediction.achievable ? "text-green-200" : "text-red-200"
                                        }`}
                                >
                                    {prediction.message}
                                </p>
                                {prediction.achievable && parseFloat(prediction.requiredSGPA) >= 0 && (
                                    <div className="mt-4 p-4 bg-richblack-800/50 rounded-xl border border-richblack-700">
                                        <p className="text-sm text-gray-300">
                                            Required Average SGPA:{" "}
                                            <span className="text-2xl font-bold text-white ml-2">
                                                {prediction.requiredSGPA}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {prediction.achievable && getSuggestions().length > 0 && (
                        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                How to Achieve Your Target
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getSuggestions().map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-xl border bg-${suggestion.color}-500/5 border-${suggestion.color}-500/20`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`text-${suggestion.color}-400 mt-1`}>
                                                {suggestion.icon}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-white mb-1">
                                                    {suggestion.title}
                                                </h5>
                                                <p className="text-sm text-gray-300">{suggestion.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Predictor;
