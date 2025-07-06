const mongoose = require ('mongoose');

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
}, { timestamps: true }); 

const Resume = mongoose.model('Resume', ResumeSchema);
module.exports = Resume;
