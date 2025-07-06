const { Router } = require('express');
const Resume = require('../model/title');
const ResumeForm = require('../model/form_updation');
const EducationForm = require('../model/education');
const ExperienceForm = require('../model/experience');
const SummaryForm = require('../model/summary');
const SkillForm = require('../model/skill');
const { GoogleGenerativeAI } = require('@google/generative-ai')
const dotenv = require('dotenv');
const router = Router();

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

router.post('/resumes', async (req, res) => {
    try {
        const { userId, email, title } = req.body;
        if (!userId || !email || !title) return res.status(400).json({ message: "All fields are required" });
        console.log("Received Data:", req.body);

        const newResume = new Resume({ userId, email, title });
        await newResume.save();
        res.status(201).json(newResume);
    } catch (error) {
        console.error("MongoDB Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.get('/resumes', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const resumes = await Resume.find({ userId });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

router.post('/generate-summary', async (req, res) => {
    try {
        const { jobTitle } = req.body;
        if (!jobTitle) {
            return res.status(400).json({ message: "Job title is required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });

        const chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 250,
                responseMimeType: "text/plain",
            },
            history: [
                { role: "user", parts: [{ text: `Generate a 4-5 line resume summary for a ${jobTitle}` }] },
            ],
        });

        const result = await chatSession.sendMessage("Generate summary");
        res.json({ summary: result.response.text() });
    } catch (error) {
        console.error(`Error generating summary: ${error}`);
        res.status(500).json({ message: "Error generating summary" });
    }
});


router.post('/generate-experience', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "title is required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });

        const chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 250,
                responseMimeType: "text/plain",
            },
        });

        const result = await chatSession.sendMessage(`Generate 3-4 brief bullet points for my resume experience section Each point should be 1-2 lines max, 
            format with each bullet point on a new line for clarity based on the job title: '${title}'`);

        res.json({ experiencesummary: result.response.text() });
    } catch (error) {
        console.error(`Error generating summary: ${error}`);
        res.status(500).json({ message: "Error generating summary" });
    }
});

router.post('/formupdate', async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const ResumeID = req.body.resumeId || req.body.ResumeID;
        const { firstName, lastName, jobTitle, address, phone, email } = req.body;

        if (!ResumeID || !firstName || !lastName || !jobTitle || !address || !phone || !email ) {
            console.log("Missing fields in request");
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingResume = await ResumeForm.findOne({ ResumeID });

        if (existingResume) {
            const updatedResume = await ResumeForm.findOneAndUpdate(
                { ResumeID },
                { firstName, lastName, jobTitle, address, phone, email, updatedAt: new Date() },
                { new: true }
            );
            console.log("Resume updated successfully");
            return res.status(200).json({ updatedResume });
        } else {
            const newResume = new ResumeForm({
                ResumeID,
                firstName,
                lastName,
                jobTitle,
                address,
                phone,
                email,
            });

            await newResume.save();
            console.log("New resume created successfully");
            return res.status(201).json({ newResume });
        }
    } catch (error) {
        console.error(`Server Error: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/summary',async(req,res)=>{
    try{
        console.log("Received Data:", req.body);
        const ResumeID = req.body.resumeId || req.body.ResumeID;
        const {summary} = req.body;
        
        if(!summary){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingResume = await SummaryForm.findOne({ ResumeID });
        if(existingResume){
            const updatedResume = await SummaryForm.findOneAndUpdate(
                { ResumeID },
                { summary, updatedAt: new Date() },
                { new: true }
            )
            return res.status(201).json(updatedResume);
        }
        else{
            const newSummary = new SummaryForm({
                ResumeID,
                summary
            })
            await newSummary.save();
            console.log("New resume created successfully");
            return res.status(201).json({ newSummary });
        }
    }
    catch(error){
        console.error(`Server Error: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
})
router.delete('/deleteskill', async (req, res) => {
    try {
        const { ResumeID, skillName } = req.body; // Extract required fields from request

        if (!ResumeID || !skillName) {
            return res.status(400).json({ message: 'ResumeID and skillName are required' });
        }

        const updatedResume = await ResumeForm.findOneAndUpdate(
            { ResumeID },
            { $pull: { skillList: { name: skillName } } }, // Remove only the specific skill
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Skill removed successfully', updatedResume });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/experience', async (req, res) => {
    try {
        console.log("Received data", req.body);
        const { ResumeID, userId, title, companyName, city, state, startDate, endDate, workSummary, _id } = req.body;

        // Ensure required fields are present (excluding _id for new entries)
        if (!ResumeID || !userId || !title || !companyName || !city || !state || !startDate || !endDate || !workSummary) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (_id) {
            // Updating an existing entry
            const updatedExperience = await ExperienceForm.findByIdAndUpdate(
                _id,
                { title, companyName, city, state, startDate, endDate, workSummary, updatedAt: new Date() },
                { new: true }
            );

            if (!updatedExperience) {
                return res.status(404).json({ message: "Experience not found" });
            }

            console.log('Experience Updated:', updatedExperience);
            return res.status(200).json(updatedExperience);
        } else {
            // Creating a new entry (no _id)
            const newExperience = new ExperienceForm({
                ResumeID, userId, title, companyName, city, state, startDate, endDate, workSummary,
            });

            const savedExperience = await newExperience.save();
            console.log("New Experience Created:", savedExperience);

            return res.status(201).json(savedExperience);
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/experience/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExperience = await ExperienceForm.findByIdAndDelete(id);
        
        if (!deletedExperience) {
            return res.status(404).json({ message: "Experience not found" });
        }

        return res.status(200).json({ message: "Experience deleted successfully" });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/education', async (req, res) => {
    try {
        const ResumeID = req.body.resumeId || req.body.ResumeID;
        const { userId, universityName, degree, major, startDate, endDate, description } = req.body;

        console.log("Received Data:", req.body);

        if (!ResumeID || !userId || !universityName || !degree || !major || !startDate || !endDate || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEducation = new EducationForm({ ResumeID, userId, universityName, degree, major, startDate, endDate, description });
        await newEducation.save();
        console.log("New education entry added successfully");
        return res.status(201).json(newEducation);

    } catch (error) {
        console.error("MongoDB Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete('/deleteeducation', async (req, res) => {
    await EducationForm.deleteOne({});
});


router.post('/skill', async (req, res) => {
    try {
        const ResumeID = req.body.resumeId || req.body.ResumeID;
        const { name, rating } = req.body;

        console.log("Received Data:", req.body);

        if (!ResumeID ||  !name || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newSkill = new SkillForm({ ResumeID, name, rating });
        await newSkill.save();
        console.log("New education entry added successfully");
        return res.status(201).json(newSkill);

    } catch (error) {
        console.error("MongoDB Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});

router.delete('/deleteskill/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received Data:", req.params);
        if (!id) {
            return res.status(400).json({ message: "Skill ID is required" });
        }
        
        const deletedSkill = await SkillForm.findByIdAndDelete(id);
        if (!deletedSkill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        res.json({ message: "Skill deleted successfully", deletedSkill });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.get('/getResume/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await ResumeForm.findOne({ ResumeID: resumeId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/getSummary/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await SummaryForm.findOne({ ResumeID: resumeId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/experience/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const experiences = await ExperienceForm.find({ ResumeID: resumeId });

        if (!experiences || experiences.length === 0) {
            return res.status(200).json({ experience: [] });
        }

        // Format the dates before sending the response
        const formattedExperiences = experiences.map(exp => ({
            ...exp._doc,
            startDate: exp.startDate ? exp.startDate.toISOString().split('T')[0] : '',
            endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : '',
        }));

        res.status(200).json({ experience: formattedExperiences });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getEducation/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const education = await EducationForm.find({ ResumeID: resumeId });

        if (!education || education.length === 0) {
            return res.status(200).json({ education: [] }); // ✅ Correct key
        }

        // Format the dates before sending the response
        const formattedEducation = education.map(edu => ({
            ...edu._doc,
            startDate: edu.startDate ? edu.startDate.toISOString().split('T')[0] : '',
            endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : '',
        }));

        res.status(200).json({ education: formattedEducation }); // ✅ Correct key
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/getSkill/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const skills = await SkillForm.find({ ResumeID: resumeId });

        if (!skills || skills.length === 0) {
            return res.status(200).json({ skills: [] }); // ✅ Correct key
        }

        // Format the dates before sending the response
        const formattedSkills = skills.map(skl => ({
            ...skl._doc
        }));

        res.status(200).json({ skills: formattedSkills }); // ✅ Correct key
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/resumes/:resumeId', async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findById(resumeId);
    
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;