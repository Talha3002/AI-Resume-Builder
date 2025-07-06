import React, { useState, useEffect } from 'react';
import { Header } from '@/components/custom/header';
import { Button } from '@/components/ui/button';
import { ResumePreview } from '@/dashboard/resumes/components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
import axios from 'axios';

export const ViewResume = () => {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState();
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

  const HandleDownload = () => {
    window.print();
  }
  return (
    <ResumeInfoContext.Provider value={{ ResumeInfo: resumeInfo, setResumeInfo }}>
      <div id='no-print'>
        <Header />
        <div className='mt-20 my-10 mx-10 md:mx-20 lg:mx-36'>
          <h2 className='text-center text-2xl font-medium'>Congrats! Your AI-Generated Resume is Ready</h2>
          <p className='text-center text-gray-400'>You can download it as well as share the link</p>

          <div className='flex justify-between px-44 my-10'>
            <Button onClick={HandleDownload}>Download</Button>

            <RWebShare
              data={{
                text: "Click on the URL to view my resume",
                url: import.meta.env.VITE_BASE_URL + '/my-resume/' + resumeId + '/view',
                title: resumeInfo?.firstName + " " + resumeInfo?.lastName + " Resume"
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button>Share</Button>
            </RWebShare>


          </div>
        </div>
      </div>

      <div className='mt-10 my-10 mx-10 md:mx-20 lg:mx-36'>
        <div id='print-area'>
          <ResumePreview key={resumeInfo} />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};
