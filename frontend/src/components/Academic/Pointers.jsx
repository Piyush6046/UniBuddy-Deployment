import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Edit2,
    GraduationCap,
    BookOpen,
    Award,
    X,
    Check,
} from "lucide-react";
import { deleteSemester } from "../../services/operations/academicAPI";

const Pointers = ({ academicData, onRefresh, onAddSemester }) => {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = async (semesterNumber) => {
        try {
            await deleteSemester(semesterNumber);
            onRefresh();
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting semester:", error);
        }
    };

    const getGradeColor = (grade) => {
        const colors = {
            AA: "from-green-500 to-emerald-500",
            AB: "from-green-400 to-green-500",
            BB: "from-blue-400 to-blue-500",
            BC: "from-blue-300 to-blue-400",
            CC: "from-yellow-400 to-yellow-500",
            CD: "from-yellow-300 to-yellow-400",
            DD: "from-orange-400 to-orange-500",
            FF: "from-red-400 to-red-500",
        };
        return colors[grade] || "from-gray-400 to-gray-500";
    };

    const getSGPAColor = (sgpa) => {
        if (sgpa >= 9) return "text-green-400 border-green-500/30 bg-green-500/10";
        if (sgpa >= 8) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
        if (sgpa >= 7) return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
        if (sgpa >= 6) return "text-orange-400 border-orange-500/30 bg-orange-500/10";
        return "text-red-400 border-red-500/30 bg-red-500/10";
    };

    return (
        <div className="space-y-6">
            {/* Add Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-white">All Semesters</h3>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage your semester-wise academic records
                    </p>
                </div>
                <button
                    onClick={onAddSemester}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                    <Plus className="w-5 h-5" />
                    Add Semester
                </button>
            </div>

            {/* Semester Cards */}
            {academicData?.semesters.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {academicData.semesters.map((semester, index) => (
                            <motion.div
                                key={semester.semesterNumber}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-richblack-700 to-richblack-800 p-6 border-b border-richblack-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
                                                <GraduationCap className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-white">
                                                    Semester {semester.semesterNumber}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    {semester.totalCredits} Credits
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* SGPA Badge */}
                                            <div
                                                className={`px-4 py-2 rounded-xl font-bold text-sm border ${getSGPAColor(
                                                    semester.sgpa
                                                )}`}
                                            >
                                                SGPA: {semester.sgpa.toFixed(2)}
                                            </div>
                                            {/* Actions */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onAddSemester(semester)}
                                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(semester.semesterNumber)}
                                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subjects List */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-300">
                                            Subjects ({semester.subjects.length})
                                        </span>
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                                        {semester.subjects.map((subject, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-4 bg-richblack-700/50 rounded-xl border border-richblack-600 hover:border-richblack-500 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h5 className="text-white font-medium">
                                                        {subject.subjectName}
                                                    </h5>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {subject.credit} Credit{subject.credit > 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div
                                                            className={`inline-block px-3 py-1.5 rounded-lg font-bold text-sm text-white bg-gradient-to-r ${getGradeColor(
                                                                subject.grade
                                                            )}`}
                                                        >
                                                            {subject.grade}
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            GP: {subject.gradePoint}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-richblack-800 border border-richblack-700 rounded-2xl p-12"
                >
                    <div className="text-center">
                        <Award className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No Semesters Added Yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Start tracking your academic performance by adding your first semester
                        </p>
                        <button
                            onClick={onAddSemester}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Semester
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Delete Semester?
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete Semester {deleteConfirm}? This action
                                cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pointers;
