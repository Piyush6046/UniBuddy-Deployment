const fs = require("fs");
const axios = require("axios");
const { AffindaAPI, AffindaCredential } = require("@affinda/affinda");
const User = require("../models/User");

// Hardcoded Credentials as requested
const AFFINDA_API_KEY = "aff_d6ac57ae570b36e2c5818f84a9b5119837bab36c";
const WORKSPACE_ID = "ddtXDLEG";
const DOCUMENT_TYPE_ID = "LJcgoNSG"; // User supplied Document Type ID for Resume Parser

exports.startInterview = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const { id: userId } = req.user;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a resume" });
        }

        console.log("----------------------------------------");
        console.log("Step 1: Resume Processing (Affinda Direct)");
        console.log("----------------------------------------");

        let fullResumeJson = null;

        try {
            const credential = new AffindaCredential(AFFINDA_API_KEY);
            const client = new AffindaAPI(credential);

            console.log("Uploading Document to Workspace:", WORKSPACE_ID);
            console.log("Using Document Type:", DOCUMENT_TYPE_ID);

            const readStream = fs.createReadStream(req.file.path);
            readStream.on('error', (err) =>
                console.log("Stream Read Error (Safe Ignored):", err.message)
            );

            const docResult = await client.createDocument({
                file: readStream,
                workspace: WORKSPACE_ID,
                documentType: DOCUMENT_TYPE_ID,
                wait: "true",
            });

            console.log("Affinda Upload Status:", docResult._response?.status);
            let doc = docResult.data;

            let identifier = doc.meta?.identifier || doc.identifier;

            if (!identifier) {
                console.log(
                    "Document created but identifier not found in:",
                    Object.keys(doc)
                );
            } else {
                console.log("Document Created. Identifier:", identifier);
            }

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

            if (doc.meta && !doc.meta.ready) {
                throw new Error("Resume parsing timed out or failed to complete.");
            }

            const extraction = doc.data || doc;

            if (!extraction) throw new Error("Parsing completed but no data returned.");

            console.log("Resume Parsed Successfully!");

            fullResumeJson = {
                name: extraction.name?.raw || "Candidate",
                totalYearsExperience: extraction.totalYearsExperience,
                profession: extraction.profession,

                skills: extraction.skills ? extraction.skills.map(s => s.name) : [],
                workExperience: extraction.workExperience
                    ? extraction.workExperience.map(w => ({
                        jobTitle: w.jobTitle,
                        organization: w.organization,
                        dates: w.dates,
                        jobDescription: w.jobDescription,
                    }))
                    : [],
                education: extraction.education
                    ? extraction.education.map(e => ({
                        degree: e.degree,
                        organization: e.organization,
                        dates: e.dates,
                    }))
                    : [],

                summary: extraction.summary,
                rawText: extraction.rawText
                    ? extraction.rawText.substring(0, 2000)
                    : "",
            };

            console.log("\n--- PARSED RESUME DATA (JSON) ---");
            console.log(
                JSON.stringify(fullResumeJson, null, 2).substring(0, 1000) +
                "... (truncated for logs)"
            );
            console.log("---------------------------------\n");
        } catch (affindaError) {
            console.error("Affinda Critical Failure:", affindaError.message);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            return res.status(500).json({
                success: false,
                message: "Resume parsing failed.",
                error: affindaError.message,
            });
        }

        const user = await User.findById(userId);

        console.log("----------------------------------------");
        console.log("Step 2: Starting Interview (Injecting JSON)");
        console.log("----------------------------------------");

        const systemPrompt = `
            You are a technical interviewer at a top tech company. 
            Objective: Conduct a mock technical interview for the role: ${jobDescription || "Software Engineer"}.
            
            CANDIDATE RESUME (STRUCTURED JSON format):
            ---
            ${JSON.stringify(fullResumeJson)}
            ---
            
            INSTRUCTIONS:
            1. You have the raw structured data of the candidate's resume above.
            2. Analyze the 'skills', 'workExperience', and 'jobDescription' fields to deeply understand their background.
            3. Start by greeting the candidate and explicitly mentioning a specific project or role from the JSON data to prove you've read it.
            4. Ask exactly 1 technical question at a time.
            5. Keep the tone professional but encouraging.
        `;

        const vapiPayload = {
            name: `Interview - ${user?.name || "User"}`,
            firstMessage: `Hi ${user?.name?.split(" ")[0] || "there"
                }, I'm your AI interviewer. I've analyzed the JSON data from your resume. Ready to begin?`,
            model: {
                provider: "openai",
                model: "gpt-4o",
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                ],
            },
            voice: {
                provider: "azure",
                voiceId: "andrew",
            },
            maxDurationSeconds: user?.isPremium ? 1800 : 300,
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

            console.log("Assistant ready. ID:", vapiResponse.data.id);

            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            return res.status(200).json({
                success: true,
                assistant: vapiResponse.data,
            });
        } catch (vapiError) {
            console.error(
                "Vapi Error:",
                vapiError.response?.data || vapiError.message
            );
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            throw vapiError;
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
