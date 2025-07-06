import React, { memo, useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

export const PersonaldetailPreview = memo(() => {
    const { ResumeInfo } = useContext(ResumeInfoContext);
    
    return (
        <div>
            <h2 className='font-bold text-xl text-center' style={{ color: ResumeInfo?.themeColor  || "#ff6666"  }}>
                {ResumeInfo?.firstName || 'John'} {ResumeInfo?.lastName || 'Doe'}
            </h2>

            <h2 className='font-medium text-xm text-center'>
                {ResumeInfo?.jobTitle || 'Software Engineer'}
            </h2>
            
            <h2 className='font-normal text-xs text-center' style={{ color: ResumeInfo?.themeColor || "#ff6666"  }}>
                {ResumeInfo?.address || '123 Main St, City, Country'}
            </h2>
            
            <div className='flex justify-between'>
                <h2 className='font-normal text-xs' style={{ color: ResumeInfo?.themeColor || "#ff6666"  }}>
                    {ResumeInfo?.phone || '123-456-7890'}
                </h2>
                <h2 className='font-normal text-xs' style={{ color: ResumeInfo?.themeColor || "#ff6666"  }}>
                    {ResumeInfo?.email || 'email@example.com'}
                </h2>
            </div>

            <hr className='border-[2px] my-2' style={{ borderColor: ResumeInfo?.themeColor || "#ff6666"  }} />
        </div>
    );
});
