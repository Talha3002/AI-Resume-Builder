import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Header } from '@/components/custom/header';
import { FormSection } from '../../components/FormSection';
import { ResumePreview } from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import dummy from '@/data/dummy';

export const Edit = () => {
    const { resumeId } = useParams();
    const [ResumeInfo, setResumeInfo] = useState(dummy);

    useEffect(() => {
        const fetchResumeData = async () => {
            if (!resumeId) {
                setResumeInfo(dummy);
                return;
            }

            try {
                const resumeResponse = await axios.get(`http://localhost:5000/api/getResume/${resumeId}`);
                const summaryResponse = await axios.get(`http://localhost:5000/api/getSummary/${resumeId}`);
                const experienceResponse = await axios.get(`http://localhost:5000/api/experience/${resumeId}`);
                const educationResponse = await axios.get(`http://localhost:5000/api/getEducation/${resumeId}`);
                const skillResponse = await axios.get(`http://localhost:5000/api/getSkill/${resumeId}`);
                setResumeInfo((prev) => ({
                    ...resumeResponse.data,
                    summary: summaryResponse.data.summary || prev.summary,
                    experience: experienceResponse.data.experience || prev?.experience,
                    education: educationResponse.data.education || prev?.education,
                    skills: skillResponse.data.skills || prev?.skills,
                }));
            } catch (error) {
                console.error("Error fetching resume data:", error);
            }
        };

        fetchResumeData();
    }, [resumeId]);

    return (
        <ResumeInfoContext.Provider value={{ ResumeInfo, setResumeInfo }}>
            <div>
                <Header />
                <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10 mt-20'>
                    <FormSection />
                    <ResumePreview />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
};
