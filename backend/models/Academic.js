const mongoose = require("mongoose");

// Subject Schema for storing individual subject details
const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        trim: true,
    },
    credit: {
        type: Number,
        required: true,
        min: 0,
    },
    grade: {
        type: String,
        required: true,
        enum: ["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF"],
    },
    gradePoint: {
        type: Number,
        required: true,
    },
});

// Semester Schema for storing semester-wise data
const semesterSchema = new mongoose.Schema({
    semesterNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    subjects: [subjectSchema],
    sgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    totalCredits: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Main Academic Schema
const academicSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        semesters: [semesterSchema],
        cgpa: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        totalCreditsEarned: {
            type: Number,
            default: 0,
        },
        targetCGPA: {
            type: Number,
            default: null,
            min: 0,
            max: 10,
        },
    },
    { timestamps: true }
);

// Method to calculate CGPA
academicSchema.methods.calculateCGPA = function () {
    if (this.semesters.length === 0) {
        this.cgpa = 0;
        this.totalCreditsEarned = 0;
        return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    this.semesters.forEach((semester) => {
        totalPoints += semester.sgpa * semester.totalCredits;
        totalCredits += semester.totalCredits;
    });

    this.cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    this.totalCreditsEarned = totalCredits;
};

module.exports = mongoose.model("Academic", academicSchema);
