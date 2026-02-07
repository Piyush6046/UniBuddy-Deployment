const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        callId: {
            type: String,
            required: true,
            unique: true,
        },
        vapiCallId: {
            type: String,
        },
        jobDescription: {
            type: String,
        },
        resumePath: {
            type: String, 
        },
        status: {
            type: String,
            enum: ["started", "completed", "failed"],
            default: "started",
        },
        recordingUrl: {
            type: String,
        },
        transcript: {
            type: String,
        },
        summary: {
            type: String,
        },
        score: {
            type: Number,
        },
        feedback: {
            type: String,
        },
        duration: {
            type: Number, // in seconds
        },
        context: {
            type: Object, // For Web Speech: stores resume data, conversation history, etc.
        },
        cloudinaryRecordingUrl: {
            type: String,
        },
        cloudinaryTranscriptUrl: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
