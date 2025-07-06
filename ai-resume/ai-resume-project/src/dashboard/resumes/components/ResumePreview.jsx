import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import { PersonaldetailPreview } from './preview/PersonaldetailPreview';
import { SummaryPreview } from './preview/SummaryPreview';
import { ProfessionalExperiencePreview } from './preview/ProfessionalExperiencePreview';
import { EducationPreview } from './preview/EducationPreview';
import { SkillsPreview } from './preview/SkillsPreview';

export const ResumePreview = () => {
  const { ResumeInfo } = useContext(ResumeInfoContext);

  console.log("ResumeInfo in ResumePreview:", ResumeInfo); // Debugging

  if (!ResumeInfo) {
    return <p className="text-center mt-10">Loading resume preview...</p>;
  }

  return (
    <div className='shadow-lg h-full p-14 border-t-[20px]'
      style={{
        borderColor: ResumeInfo.themeColor || "#ff6666" 
      }}>
      <PersonaldetailPreview ResumeInfo={ResumeInfo} />
      <SummaryPreview ResumeInfo={ResumeInfo} />
      <ProfessionalExperiencePreview ResumeInfo={ResumeInfo} />
      <EducationPreview ResumeInfo={ResumeInfo} />
      <SkillsPreview ResumeInfo={ResumeInfo} />
    </div>
  );
};
