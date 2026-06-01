const fs = require("fs");
const axios = require("axios");
const { AffindaAPI, AffindaCredential } = require("@affinda/affinda");
const User = require("../models/User");
const Interview = require("../models/Interview");

// Hardcoded Credentials
const AFFINDA_API_KEY = process.env.AFFINDA_API_KEY;
const WORKSPACE_ID = process.env.AFFINDA_WORKSPACE_ID;
const DOCUMENT_TYPE_ID = process.env.AFFINDA_DOCUMENT_TYPE_ID;

exports.startInterview = async (req, res) => {
    try {
        const { jobDescription, duration } = req.body;
        const { id: userId } = req.user;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a resume" });
        }

        console.log("----------------------------------------");
        console.log("Step 1: Resume Processing (Affinda)");
        console.log("----------------------------------------");

        let fullResumeJson = null;

        try {
            const credential = new AffindaCredential(AFFINDA_API_KEY);
            const client = new AffindaAPI(credential);

            console.log("Uploading Document to Workspace:", WORKSPACE_ID);
            const readStream = fs.createReadStream(req.file.path);

            const docResult = await client.createDocument({
                file: readStream,
                workspace: WORKSPACE_ID,
                documentType: DOCUMENT_TYPE_ID,
                wait: "true",
            });

            let doc = docResult.data;
            let identifier = doc.meta?.identifier || doc.identifier;

            if (identifier) {
                let attempts = 0;
                while ((!doc.meta || !doc.meta.ready) && attempts < 15) {
                    attempts++;
                    console.log(`Polling Affinda... (Attempt ${attempts})`);
                    await new Promise(r => setTimeout(r, 2000));
                    const pollRes = await client.getDocument(identifier);
                    doc = pollRes.data;
                }
            }

            const extraction = doc.data || doc;
            if (!extraction) throw new Error("Parsing failed.");

            console.log("Resume Parsed Successfully!");

           fullResumeJson = {
    name: extraction.candidateName?.parsed?.raw?.parsed
          || extraction.candidateName?.raw
          || "Candidate",
    skills: Array.isArray(extraction.skill)
          ? extraction.skill.map(s => s.parsed?.name || s.raw).filter(Boolean)
          : [],
    workExperience: extraction.workExperience || [],
    education: extraction.education || [],
    summary: extraction.summary?.parsed || extraction.summary?.raw || "",
};

            console.log("Candidate Name:", fullResumeJson.name);
        } catch (affindaError) {
            console.error("Affinda Error:", affindaError.message);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(500).json({
                success: false,
                message: "Resume parsing failed.",
                error: affindaError.message,
            });
        }

        const user = await User.findById(userId);

        // Validate duration based on user subscription
        const requestedDuration = parseInt(duration) || 300;
        const maxDuration = user?.isPremium ? 1800 : 300;
        const finalDuration = Math.min(requestedDuration, maxDuration);

        console.log("----------------------------------------");
        console.log("Step 2: Creating Vapi Assistant");
        console.log("----------------------------------------");

        const systemPrompt = `You are a professional technical interviewer conducting a mock interview for the role: ${jobDescription || "Software Engineer"}.

CANDIDATE RESUME:
${JSON.stringify(fullResumeJson, null, 2)}

INSTRUCTIONS:
1. Start with a warm greeting mentioning their name
2. Ask about 1 specific project or experience from their resume
3. Ask targeted technical questions based on their skills
4. Keep questions clear and wait for complete answers
5. Provide encouraging feedback
6. Ask 1 question at a time
7. Keep the conversation professional and supportive`;

        const vapiPayload = {
            name: `UniBuddy - ${fullResumeJson.name}`,
            firstMessage: `Hello ${fullResumeJson.name.split(" ")[0]}! I'm excited to interview you today. I've reviewed your background and I'm impressed. Let's start - could you tell me a bit about yourself and why you're interested in this role?`,
            model: {
                provider: "openai",
                model: "gpt-4o-mini",
                temperature: 0.7,
                messages: [{ role: "system", content: systemPrompt }],
            },
            voice: {
                provider: "azure",
                voiceId: "andrew",
            },
            // Add analysis plan for automatic summary/scoring
            analysisPlan: {
                summaryPrompt: "Analyze this interview and provide a comprehensive summary covering: 1) Candidate strengths, 2) Technical knowledge, 3) Communication skills, 4) Areas for improvement, 5) Overall recommendation",
                structuredDataPrompt: "Extract: overall score (1-10), technical skills (1-10), communication (1-10), strengths (list), improvements (list), recommendation",
                structuredDataSchema: {
                    type: "object",
                    properties: {
                        overallScore: { type: "number" },
                        technicalScore: { type: "number" },
                        communicationScore: { type: "number" },
                        strengths: { type: "array", items: { type: "string" } },
                        improvements: { type: "array", items: { type: "string" } },
                        recommendation: { type: "string" }
                    }
                },
                successEvaluationPrompt: "Based on the interview, is the candidate suitable for this role?",
                successEvaluationRubric: "NumericScale"
            },
            endCallMessage: "Thank you! You'll receive detailed feedback soon. Best of luck with your job search!",
            maxDurationSeconds: finalDuration,
        };

        try {
            const vapiResponse = await axios.post(
                "https://api.vapi.ai/assistant",
                vapiPayload,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Assistant Created, ID:", vapiResponse.data.id);

            // Create interview record
            await Interview.create({
                user: userId,
                callId: vapiResponse.data.id,
                jobDescription: jobDescription,
                resumePath: req.file.path,
                status: "started"
            });

            // Clean up file
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            // Increment interview count
            user.interviewCount += 1;
            await user.save();

            return res.status(200).json({
                success: true,
                assistant: vapiResponse.data,
                duration: finalDuration,
                interviewCount: user.interviewCount
            });
        } catch (vapiError) {
            console.error("Vapi Error:", vapiError.response?.data || vapiError.message);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(500).json({
                success: false,
                message: "Failed to create assistant",
                error: vapiError.response?.data || vapiError.message
            });
        }
    } catch (error) {
        console.error("Critical Error:", error.message);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Vapi Webhook Handler - Fetch analysis from Vapi API
exports.handleVapiWebhook = async (req, res) => {
    try {
        const { message } = req.body;

        console.log("📞 Vapi Webhook Received:");
        console.log("   Type:", message?.type);

        // Handle end-of-call-report event
        if (message?.type === "end-of-call-report") {
            const { call, artifact } = message;

            console.log("✅ End of Call Report");
            console.log("   Call ID:", call?.id);
            console.log("   Assistant ID:", call?.assistantId);
            console.log("   Duration:", call?.duration, "seconds");

            // Find interview by assistant ID
            let interview = await Interview.findOne({
                callId: call?.assistantId
            }).sort({ createdAt: -1 });

            if (!interview) {
                console.log("⚠️ No interview found for assistant:", call?.assistantId);
                return res.status(200).json({
                    success: true,
                    message: "No interview found"
                });
            }

            // Extract basic data from webhook
            const transcript = artifact?.transcript || "";
            const recordingUrl = artifact?.recording?.url || "";

            // Fetch full call details with analysis from Vapi API
            let analysisData = null;
            try {
                const callDetailsResponse = await axios.get(
                    `https://api.vapi.ai/call/${call.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`
                        }
                    }
                );

                const callData = callDetailsResponse.data;
                analysisData = callData.analysis;

                console.log("📊 Analysis Retrieved:");
                console.log("   Summary:", analysisData?.summary ? "Present" : "None");
                console.log("   Structured Data:", analysisData?.structuredData ? "Present" : "None");
                console.log("   Success Evaluation:", analysisData?.successEvaluation);

            } catch (apiError) {
                console.error("Failed to fetch call analysis from Vapi:", apiError.message);
            }

            // Extract summary and score from analysis
            let summary = analysisData?.summary || "Interview completed successfully. Detailed analysis pending.";
            let score = null;
            let feedback = "";

            // Extract score from structured data if available
            if (analysisData?.structuredData) {
                const data = analysisData.structuredData;
                score = data.overallScore || data.technicalScore || null;

                // Build comprehensive feedback
                const parts = [];
                if (data.strengths && data.strengths.length > 0) {
                    parts.push("Strengths: " + data.strengths.join(", "));
                }
                if (data.improvements && data.improvements.length > 0) {
                    parts.push("Areas to improve: " + data.improvements.join(", "));
                }
                if (data.recommendation) {
                    parts.push("Recommendation: " + data.recommendation);
                }
                feedback = parts.join(". ");
            }

            // Fallback: extract score from summary text
            if (!score && summary) {
                const scoreMatch = summary.match(/(\d+)(\/10|out of 10)/i) ||
                    summary.match(/score[:\s]+(\d+)/i);
                if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                }
            }

            // Update interview record
            interview.status = "completed";
            interview.duration = call?.duration || 0;
            interview.recordingUrl = recordingUrl;
            interview.transcript = transcript || "Transcript not available";
            interview.summary = summary;
            interview.score = score;
            interview.feedback = feedback || summary;
            interview.vapiCallId = call?.id;

            await interview.save();

            console.log("✅ Interview updated with analysis:");
            console.log("   Interview ID:", interview._id);
            console.log("   Score:", score);
            console.log("   Summary length:", summary.length);

            return res.status(200).json({
                success: true,
                message: "Analysis processed successfully",
                interviewId: interview._id
            });
        }

        // Handle other webhook types
        console.log("   Webhook type not processed:", message?.type);
        return res.status(200).json({
            success: true,
            message: "Webhook received"
        });

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Webhook processing failed"
        });
    }
};

// Get user's interview history
exports.getInterviewHistory = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const interviews = await Interview.find({ user: userId })
            .sort({ createdAt: -1 })
            .select('-resumePath');

        const stats = {
            totalInterviews: interviews.length,
            completedInterviews: interviews.filter(i => i.status === "completed").length,
            averageScore: interviews.filter(i => i.score).length > 0
                ? (interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.filter(i => i.score).length).toFixed(1)
                : null,
            totalDuration: interviews.reduce((sum, i) => sum + (i.duration || 0), 0)
        };

        return res.status(200).json({
            success: true,
            interviews,
            stats
        });
    } catch (error) {
        console.error("Error fetching history:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching interview history",
            error: error.message
        });
    }
};

// Get single interview details
exports.getInterviewDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        const interview = await Interview.findOne({
            _id: id,
            user: userId
        });

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching interview details",
            error: error.message
        });
    }
};

// Manual complete interview (for when webhook is not configured)
exports.manualCompleteInterview = async (req, res) => {
    try {
        const { assistantId } = req.body;
        const { id: userId } = req.user;

        console.log("🔄 Manual Complete Request");
        console.log("   Assistant ID:", assistantId);
        console.log("   User ID:", userId);

        const interview = await Interview.findOne({
            callId: assistantId,
            user: userId,
            status: "started"
        });

        if (!interview) {
            console.log("⚠️ Interview not found or already completed");
            return res.status(404).json({
                success: false,
                message: "Interview not found or already completed"
            });
        }

        interview.status = "completed";
        interview.summary = interview.summary || "Interview ended by user";
        interview.feedback = interview.feedback || "Interview completed. Detailed feedback will be available when recording is processed.";

        await interview.save();

        console.log("✅ Interview manually marked as completed");
        console.log("   Interview ID:", interview._id);

        return res.status(200).json({
            success: true,
            message: "Interview marked as completed",
            interview
        });
    } catch (error) {
        console.error("❌ Manual complete error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to complete interview",
            error: error.message
        });
    }
};

// Admin: Get all interviews with analytics
exports.getAllInterviews = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;

        const query = {};
        if (status) query.status = status;
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
            if (dateTo) query.createdAt.$lte = new Date(dateTo);
        }

        const interviews = await Interview.find(query)
            .populate('user', 'name email isPremium')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-resumePath -transcript');

        const total = await Interview.countDocuments(query);

        // Calculate analytics
        const analytics = await Interview.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalInterviews: { $sum: 1 },
                    completedInterviews: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    averageScore: { $avg: "$score" },
                    totalDuration: { $sum: "$duration" },
                    averageDuration: { $avg: "$duration" }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            interviews,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            analytics: analytics[0] || {
                totalInterviews: 0,
                completedInterviews: 0,
                averageScore: null,
                totalDuration: 0,
                averageDuration: 0
            }
        });
    } catch (error) {
        console.error("Admin interview fetch error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching interviews",
            error: error.message
        });
    }
};

// Admin: Get interview details (full access)
exports.getAdminInterviewDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id)
            .populate('user', 'name email isPremium phoneNumber');

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            });
        }

        return res.status(200).json({
            success: true,
            interview
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching interview details",
            error: error.message
        });
    }
};
