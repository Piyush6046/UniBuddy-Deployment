import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Calculator as CalcIcon, Save } from "lucide-react";
import { addOrUpdateSemester } from "../../services/operations/academicAPI";

const gradeOptions = ["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF"];
const gradeToPoint = {
    AA: 10,
    AB: 9,
    BB: 8,
    BC: 7,
    CC: 6,
    CD: 5,
    DD: 4,
    FF: 0,
};

const Calculator = ({ isOpen, onClose, onSuccess, existingSemester = null }) => {
    const [mode, setMode] = useState("detailed"); // "detailed" or "direct"
    const [semesterNumber, setSemesterNumber] = useState(
        existingSemester?.semesterNumber || ""
    );
    const [subjects, setSubjects] = useState(
        existingSemester?.subjects || [{ subjectName: "", credit: "", grade: "AA" }]
    );
    const [directSGPA, setDirectSGPA] = useState("");
    const [directCredits, setDirectCredits] = useState("");
    const [calculatedSGPA, setCalculatedSGPA] = useState(null);

    useEffect(() => {
        if (existingSemester) {
            setSemesterNumber(existingSemester.semesterNumber || "");
            if (existingSemester.subjects && existingSemester.subjects.length > 0) {
                setMode("detailed");
                setSubjects(existingSemester.subjects);
                // We'll calculate SGPA after state updates
            } else {
                setMode("direct");
                setDirectSGPA(existingSemester.sgpa?.toString() || "");
                setDirectCredits(existingSemester.totalCredits?.toString() || "");
            }
        }
    }, [existingSemester]);

    useEffect(() => {
        if (mode === "detailed" && subjects.length > 0) {
            calculateSGPA(subjects);
        }
    }, [subjects, mode]);

    const calculateSGPA = (subjectsData) => {
        if (mode !== "detailed") return;
        let totalPoints = 0;
        let totalCredits = 0;

        if (!subjectsData || !Array.isArray(subjectsData)) {
            setCalculatedSGPA(null);
            return;
        }

        subjectsData.forEach((subject) => {
            if (subject.credit && subject.grade) {
                const credit = parseFloat(subject.credit);
                const gradePoint = gradeToPoint[subject.grade];
                totalPoints += credit * gradePoint;
                totalCredits += credit;
            }
        });

        if (totalCredits > 0) {
            const sgpa = (totalPoints / totalCredits).toFixed(2);
            setCalculatedSGPA(sgpa);
        } else {
            setCalculatedSGPA(null);
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][field] = value;
        setSubjects(updatedSubjects);
        calculateSGPA(updatedSubjects);
    };

    const addSubject = () => {
        setSubjects([...subjects, { subjectName: "", credit: "", grade: "AA" }]);
    };

    const removeSubject = (index) => {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(updatedSubjects);
        calculateSGPA(updatedSubjects);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!semesterNumber) {
            alert("Please enter semester number");
            return;
        }

        let payload = {
            semesterNumber: parseInt(semesterNumber),
        };

        if (mode === "detailed") {
            const validSubjects = subjects.filter(
                (s) => s.subjectName.trim() && s.credit
            );

            if (validSubjects.length === 0) {
                alert("Please add at least one valid subject");
                return;
            }

            payload.subjects = validSubjects.map((s) => ({
                subjectName: s.subjectName,
                credit: parseFloat(s.credit),
                grade: s.grade,
            }));
        } else {
            if (!directSGPA || !directCredits) {
                alert("Please entry both SGPA and Total Credits");
                return;
            }
            payload.sgpa = parseFloat(directSGPA);
            payload.totalCredits = parseFloat(directCredits);
        }

        try {
            await addOrUpdateSemester(payload);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error("Error saving semester:", error);
        }
    };

    const handleClose = () => {
        setSemesterNumber("");
        setSubjects([{ subjectName: "", credit: "", grade: "AA" }]);
        setDirectSGPA("");
        setDirectCredits("");
        setCalculatedSGPA(null);
        setMode("detailed");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-richblack-800 border border-richblack-700 rounded-2xl w-full max-w-3xl my-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-richblack-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
                                    <CalcIcon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {existingSemester ? "Edit" : "Add"} Semester
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Calculate and save your SGPA
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-richblack-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setMode("detailed")}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${mode === "detailed"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-richblack-700 text-gray-400 hover:bg-richblack-600"
                                        }`}
                                >
                                    Detailed Mode
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("direct")}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${mode === "direct"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-richblack-700 text-gray-400 hover:bg-richblack-600"
                                        }`}
                                >
                                    Direct Entry
                                </button>
                            </div>

                            {/* Semester Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Semester Number *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="8"
                                    value={semesterNumber}
                                    onChange={(e) => setSemesterNumber(e.target.value)}
                                    className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter semester number (1-8)"
                                    required
                                />
                            </div>

                            {mode === "detailed" ? (
                                /* Detailed Subjects Mode */
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Subjects *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSubject}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Subject
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                        {subjects.map((subject, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="grid grid-cols-12 gap-3 p-4 bg-richblack-700/50 border border-richblack-600 rounded-xl"
                                            >
                                                {/* Subject Name */}
                                                <div className="col-span-12 md:col-span-5">
                                                    <input
                                                        type="text"
                                                        value={subject.subjectName}
                                                        onChange={(e) =>
                                                            handleSubjectChange(index, "subjectName", e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Subject name"
                                                        required
                                                    />
                                                </div>

                                                {/* Credit */}
                                                <div className="col-span-5 md:col-span-3">
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        min="0"
                                                        value={subject.credit}
                                                        onChange={(e) =>
                                                            handleSubjectChange(index, "credit", e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Credit"
                                                        required
                                                    />
                                                </div>

                                                {/* Grade */}
                                                <div className="col-span-5 md:col-span-3">
                                                    <select
                                                        value={subject.grade}
                                                        onChange={(e) =>
                                                            handleSubjectChange(index, "grade", e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 bg-richblack-600 border border-richblack-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        {gradeOptions.map((grade) => (
                                                            <option key={grade} value={grade}>
                                                                {grade} ({gradeToPoint[grade]})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Delete Button */}
                                                <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                                                    {subjects.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSubject(index)}
                                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Direct Entry Mode */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            SGPA *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="10"
                                            value={directSGPA}
                                            onChange={(e) => setDirectSGPA(e.target.value)}
                                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter SGPA (e.g. 9.5)"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Total Credits *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={directCredits}
                                            onChange={(e) => setDirectCredits(e.target.value)}
                                            className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Total Credits"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Calculated SGPA */}
                            {mode === "detailed" && calculatedSGPA && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-300 mb-1">Calculated SGPA</p>
                                            <p className="text-4xl font-bold text-white">
                                                {calculatedSGPA}
                                            </p>
                                        </div>
                                        <CalcIcon className="w-12 h-12 text-blue-400 opacity-50" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-richblack-700 hover:bg-richblack-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Semester
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Calculator;
