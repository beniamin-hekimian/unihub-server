const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // professorId is optional
        // because when professor is deleted => subject remain with professorId null
        professorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professor",
            default: null,
        },
        year: {
            type: Number,
            required: true,
            min: 1,
        },
        department: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
