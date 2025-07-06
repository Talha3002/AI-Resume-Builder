import React from 'react'

export const EducationPreview = ({ ResumeInfo }) => {
    return (
        <div className='my-6'>
            <h2 className='font-bold text-sm mb-2 text-center' style={{
                color: ResumeInfo?.themeColor || "#ff6666" 
            }}>Education</h2>

            <hr style={{
                borderColor: ResumeInfo?.themeColor || "#ff6666" 
            }} />

            {ResumeInfo?.education?.length > 0 ? (
                ResumeInfo.education.map((education, index) => (
                    <div key={index} className='my-5'>
                        <h2 className='text-sm font-bold' style={{
                            color: ResumeInfo?.themeColor || "#ff6666" 
                        }}>{education?.universityName}</h2>

                        <h2 className='text-xs flex justify-between' style={{
                            borderColor: ResumeInfo?.themeColor || "#ff6666" 
                        }}>
                            {education?.degree}, {education?.major}
                            <span> {education?.startDate} - {education?.endDate}</span>
                        </h2>

                        <p className='text-xs my-2'>
                            {education?.description}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-xs text-center mt-2">No education added yet.</p>
            )}

        </div>
    )
}
