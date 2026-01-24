const express = require("express");
const router = express.Router();
const { startInterview } = require("../controllers/interviewController");
const { auth } = require("../middlewares/auth"); // Assuming there is an auth middleware
const upload = require("../middlewares/upload");

router.post("/start", auth, upload.single("resume"), startInterview);

module.exports = router;
