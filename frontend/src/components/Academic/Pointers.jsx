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
    Sparkles,
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
        if (sgpa >= 9) return "text-green-500 border-green-500/30 bg-green-500/10";
        if (sgpa >= 8) return "text-blue-500 border-blue-500/30 bg-blue-500/10";
        if (sgpa >= 7) return "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
        if (sgpa >= 6) return "text-orange-500 border-orange-500/30 bg-orange-500/10";
        return "text-red-500 border-red-500/30 bg-red-500/10";
    };

    return (
        <div className="space-y-6">
            {/* Add Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">All Semesters</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Manage your semester-wise academic records
                    </p>
                </div>
                <button
                    onClick={onAddSemester}
                    className="btn btn-primary"
                >
                    <Plus className="w-5 h-5 mr-2" />
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
                                className="card p-0 overflow-hidden group hover:border-[var(--accent)] transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="bg-[var(--bg-tertiary)] p-6 border-b border-[var(--border)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[var(--accent)]/10 p-3 rounded-xl border border-[var(--accent)]/20">
                                                <GraduationCap className="w-6 h-6 text-[var(--accent)]" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-[var(--text-primary)]">
                                                    Semester {semester.semesterNumber}
                                                </h4>
                                                <p className="text-sm text-[var(--text-secondary)]">
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
                                                    className="p-2 bg-[var(--bg-primary)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-lg transition-colors border border-[var(--border)]"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(semester.semesterNumber)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
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
                                        <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                                            {semester.subjects && semester.subjects.length > 0
                                                ? `Subjects (${semester.subjects.length})`
                                                : "Direct SGPA Entry"}
                                        </span>
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                                        {semester.subjects && semester.subjects.length > 0 ? (
                                            semester.subjects.map((subject, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <h5 className="text-[var(--text-primary)] font-medium">
                                                            {subject.subjectName}
                                                        </h5>
                                                        <p className="text-xs text-[var(--text-muted)] mt-1">
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
                                                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                                                GP: {subject.gradePoint}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center bg-[var(--bg-tertiary)]/30 rounded-2xl border border-dashed border-[var(--border)]">
                                                <Sparkles className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-30" />
                                                <p className="text-sm text-[var(--text-secondary)]">No subject details provided for this semester.</p>
                                            </div>
                                        )}
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
                    className="card p-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-6 bg-[var(--bg-tertiary)] rounded-full mb-6">
                        <Award className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        No Semesters Added Yet
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                        Start tracking your academic performance by adding your first semester details.
                    </p>
                    <button
                        onClick={onAddSemester}
                        className="btn btn-primary btn-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Semester
                    </button>
                </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm !== null && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Delete Semester?
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-6">
                                Are you sure you want to delete Semester {deleteConfirm}? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="btn btn-ghost flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="btn btn-danger flex-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pointers;
