const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    mark: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate results
resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
