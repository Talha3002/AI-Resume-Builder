const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    ResumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    
}, { timestamps: true });

const ResumeForm = mongoose.model('ResumeForm', FormSchema);
module.exports = ResumeForm;
