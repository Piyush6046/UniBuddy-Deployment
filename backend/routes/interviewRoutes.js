const express = require("express");
const router = express.Router();
const {
    startInterview,
    getInterviewHistory,
    getInterviewDetails,
    handleVapiWebhook,
    manualCompleteInterview,
    getAllInterviews,
    getAdminInterviewDetails
} = require("../controllers/interviewController");
const { auth, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Vapi-based routes (original)
router.post("/start", auth, upload.single("resume"), startInterview);
router.get("/history", auth, getInterviewHistory);
router.get("/details/:id", auth, getInterviewDetails);
router.post("/manual-complete", auth, manualCompleteInterview);

// Vapi Webhook (no auth required - comes from Vapi)
router.post("/webhook", handleVapiWebhook);



// Admin routes
router.get("/admin/all", auth, isAdmin, getAllInterviews);
router.get("/admin/details/:id", auth, isAdmin, getAdminInterviewDetails);

module.exports = router;
