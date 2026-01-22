const express = require("express");
const router = express.Router();
const {
    getAcademicData,
    addOrUpdateSemester,
    deleteSemester,
    setTargetCGPA,
    predictTargetCGPA,
} = require("../controllers/academicController");
const { auth } = require("../middlewares/auth");

// All routes require authentication
router.get("/", auth, getAcademicData);
router.post("/semester", auth, addOrUpdateSemester);
router.delete("/semester/:semesterNumber", auth, deleteSemester);
router.put("/target", auth, setTargetCGPA);
router.post("/predict", auth, predictTargetCGPA);

module.exports = router;
