import React, { useState, useEffect } from 'react';
import { Header } from '@/components/custom/header';
import { AddResume } from './dashcomps/AddResume';
import { ResumeCardItems } from './dashcomps/ResumeCardItems';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
   const {user} = useUser();

    useEffect(() => {
        if (!user) return;

        const fetchResumes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/resumes?userId=${user.id}`);
                setResumes(response.data);
            } catch (error) {
                console.error("Error fetching resumes", error);
            }
        };
        fetchResumes();
    }, [user]);

    return (
        <div>
            <Header />
            <div className='p-10 md:px-20 lg:px-32 mt-20'>
                <h2 className='font-bold text-3xl'>My Resume</h2>
                <p>Start Creating AI resume to your next job role</p>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
                    <AddResume />
                    {resumes.length > 0 && resumes.map((resume, index) => (
                        <ResumeCardItems resume={resume} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
