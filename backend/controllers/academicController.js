const Academic = require("../models/Academic");

// Grade to Grade Point mapping
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

// Helper function to calculate SGPA
const calculateSGPA = (subjects) => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
        const gradePoint = gradeToPoint[subject.grade];
        totalPoints += gradePoint * subject.credit;
        totalCredits += subject.credit;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

// @desc    Get academic data for logged-in user
// @route   GET /api/academic
// @access  Private
exports.getAcademicData = async (req, res) => {
    try {
        const userId = req.user.id;

        let academic = await Academic.findOne({ user: userId });

        if (!academic) {
            // Create new academic record if doesn't exist
            academic = await Academic.create({
                user: userId,
                semesters: [],
                cgpa: 0,
                totalCreditsEarned: 0,
            });
        }

        res.status(200).json({
            success: true,
            data: academic,
        });
    } catch (error) {
        console.error("Error fetching academic data:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Add or Update semester data
// @route   POST /api/academic/semester
// @access  Private
exports.addOrUpdateSemester = async (req, res) => {
    try {
        const userId = req.user.id;
        let { semesterNumber, subjects, sgpa, totalCredits } = req.body;

        // Validation
        if (!semesterNumber) {
            return res.status(400).json({
                success: false,
                message: "Semester number is required",
            });
        }

        let semesterData = {
            semesterNumber,
            subjects: [],
            sgpa: 0,
            totalCredits: 0
        };

        // If subjects are provided, calculate SGPA
        if (subjects && Array.isArray(subjects) && subjects.length > 0) {
            const subjectsWithPoints = subjects.map((subject) => ({
                ...subject,
                gradePoint: gradeToPoint[subject.grade],
            }));

            semesterData.subjects = subjectsWithPoints;
            semesterData.sgpa = parseFloat(calculateSGPA(subjectsWithPoints));
            semesterData.totalCredits = subjectsWithPoints.reduce((sum, sub) => sum + sub.credit, 0);
        }
        // Else if direct SGPA is provided
        else if (sgpa !== undefined && totalCredits !== undefined) {
            semesterData.sgpa = parseFloat(sgpa);
            semesterData.totalCredits = parseFloat(totalCredits);
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Either subjects or direct SGPA/Credits must be provided",
            });
        }

        let academic = await Academic.findOne({ user: userId });

        if (!academic) {
            academic = new Academic({
                user: userId,
                semesters: [],
            });
        }

        // Check if semester already exists
        const existingSemesterIndex = academic.semesters.findIndex(
            (sem) => sem.semesterNumber === semesterNumber
        );

        if (existingSemesterIndex !== -1) {
            // Update existing semester
            academic.semesters[existingSemesterIndex] = {
                ...semesterData,
                createdAt: academic.semesters[existingSemesterIndex].createdAt,
            };
        } else {
            // Add new semester
            academic.semesters.push(semesterData);
        }

        // Sort semesters
        academic.semesters.sort((a, b) => a.semesterNumber - b.semesterNumber);

        // Recalculate CGPA
        academic.calculateCGPA();

        await academic.save();

        res.status(200).json({
            success: true,
            message: "Semester data saved successfully",
            data: academic,
        });
    } catch (error) {
        console.error("Error adding/updating semester:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Delete semester
// @route   DELETE /api/academic/semester/:semesterNumber
// @access  Private
exports.deleteSemester = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterNumber } = req.params;

        const academic = await Academic.findOne({ user: userId });

        if (!academic) {
            return res.status(404).json({
                success: false,
                message: "Academic data not found",
            });
        }

        academic.semesters = academic.semesters.filter(
            (sem) => sem.semesterNumber !== parseInt(semesterNumber)
        );

        academic.calculateCGPA();
        await academic.save();

        res.status(200).json({
            success: true,
            message: "Semester deleted successfully",
            data: academic,
        });
    } catch (error) {
        console.error("Error deleting semester:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Set target CGPA
// @route   PUT /api/academic/target
// @access  Private
exports.setTargetCGPA = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetCGPA } = req.body;

        if (!targetCGPA || targetCGPA < 0 || targetCGPA > 10) {
            return res.status(400).json({
                success: false,
                message: "Valid target CGPA is required (0-10)",
            });
        }

        let academic = await Academic.findOne({ user: userId });

        if (!academic) {
            academic = new Academic({
                user: userId,
                targetCGPA,
            });
        } else {
            academic.targetCGPA = targetCGPA;
        }

        await academic.save();

        res.status(200).json({
            success: true,
            message: "Target CGPA set successfully",
            data: academic,
        });
    } catch (error) {
        console.error("Error setting target CGPA:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Get prediction for target CGPA
// @route   POST /api/academic/predict
// @access  Private
exports.predictTargetCGPA = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetCGPA, remainingSemesters, creditsPerSemester } = req.body;

        const academic = await Academic.findOne({ user: userId });

        if (!academic || academic.semesters.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add at least one semester data first",
            });
        }

        const currentCGPA = parseFloat(academic.cgpa);
        const currentCredits = academic.totalCreditsEarned;

        // Calculate required SGPA for remaining semesters
        const totalCreditsNeeded = currentCredits + remainingSemesters * creditsPerSemester;
        const totalPointsNeeded = targetCGPA * totalCreditsNeeded;
        const currentPoints = currentCGPA * currentCredits;
        const remainingPointsNeeded = totalPointsNeeded - currentPoints;
        const requiredSGPA = remainingPointsNeeded / (remainingSemesters * creditsPerSemester);

        let message = "";
        let achievable = true;

        if (requiredSGPA > 10) {
            achievable = false;
            message = `Target CGPA of ${targetCGPA} is not achievable. Even with perfect 10 SGPA in all remaining semesters, maximum achievable CGPA is ${(
                (currentPoints + remainingSemesters * creditsPerSemester * 10) /
                totalCreditsNeeded
            ).toFixed(2)}`;
        } else if (requiredSGPA < 0) {
            message = `Congratulations! You've already exceeded your target CGPA of ${targetCGPA}. Your current CGPA is ${currentCGPA}.`;
        } else {
            message = `To achieve target CGPA of ${targetCGPA}, you need to maintain an average SGPA of ${requiredSGPA.toFixed(
                2
            )} in the remaining ${remainingSemesters} semester(s).`;
        }

        res.status(200).json({
            success: true,
            data: {
                currentCGPA,
                targetCGPA,
                requiredSGPA: requiredSGPA.toFixed(2),
                achievable,
                message,
                remainingSemesters,
                creditsPerSemester,
            },
        });
    } catch (error) {
        console.error("Error predicting target CGPA:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
