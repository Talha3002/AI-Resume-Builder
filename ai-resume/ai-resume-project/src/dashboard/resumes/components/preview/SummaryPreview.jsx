import React, { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
export const SummaryPreview = () => {
   const { ResumeInfo } = useContext(ResumeInfoContext); // ✅ Ensure context is properly used
  return (
    <div>
        <p className='text-xs'>
        {ResumeInfo?.summary}
        </p>
    </div>
  )
}
