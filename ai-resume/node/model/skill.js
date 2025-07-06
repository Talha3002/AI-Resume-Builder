const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    ResumeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }

}, { timestamps: true });

const SkillForm = mongoose.model('SkillForm', FormSchema);
module.exports = SkillForm;
