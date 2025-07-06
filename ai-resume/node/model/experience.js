const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    ResumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
    },
    userId: {
        type: String,
        ref: "Resume",
    },
    title: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: false,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    workSummary: {
        type: String,
        required: true,
    }

}, { timestamps: true });

const ExperienceForm = mongoose.model('ExperienceForm', FormSchema);
module.exports = ExperienceForm;
