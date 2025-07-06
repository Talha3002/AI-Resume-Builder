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
    universityName: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    major: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
   
}, { timestamps: true });

const EducationForm = mongoose.model('EducationForm', FormSchema);
module.exports = EducationForm;
