const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    ResumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
    },
    summary: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const SummaryForm = mongoose.model('SummaryForm', FormSchema);
module.exports = SummaryForm;
