const mongoose = require("mongoose");

const enrolmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    passed: {
        type: Boolean,
        default: false,
    }
});
const Enrolment = mongoose.model("Enrolment", enrolmentSchema);
module.exports = Enrolment;
