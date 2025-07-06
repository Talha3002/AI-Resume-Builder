import React from 'react'

export const ProfessionalExperiencePreview = ({ ResumeInfo }) => {
    return (
        <div className='my-6'>
            <h2 className='font-bold text-sm mb-2 text-center' style={{
                color: ResumeInfo?.themeColor || "#ff6666" 
            }}>Professional Experience</h2>

            <hr style={{
                borderColor: ResumeInfo?.themeColor || "#ff6666" 
            }} />

            {ResumeInfo?.experience?.length > 0 ? (
                ResumeInfo.experience.map((experiences, index) => (
                    <div key={index} className='my-5'>
                        <h2 className='text-sm font-bold' style={{
                            color: ResumeInfo?.themeColor || "#ff6666" 
                        }}>{experiences?.title}</h2>
                        <h2 className='text-xs flex justify-between'>
                            {experiences?.companyName}, {experiences?.city}, {experiences?.state},
                            <span> {experiences?.startDate} TO {experiences?.currentlyWorking ? 'Working' : experiences?.endDate}</span>
                        </h2>
                        <div dangerouslySetInnerHTML={{ __html: experiences.workSummary }} />
                    </div>
                ))
            ) : (
                <p className="text-xs text-center mt-2">No experience added yet.</p>
            )}
        </div>
    )
}
