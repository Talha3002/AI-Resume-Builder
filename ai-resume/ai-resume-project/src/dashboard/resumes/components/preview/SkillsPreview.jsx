import React from 'react'

export const SkillsPreview = ({ ResumeInfo }) => {
    return (
        <div className='my-6'>
            <h2 className='font-bold text-sm mb-2 text-center' style={{
                color: ResumeInfo?.themeColor || "#ff6666" 
            }}>Skills</h2>

            <hr style={{
                borderColor: ResumeInfo?.themeColor || "#ff6666" 
            }} />


            <div className='grid grid-cols-2 gap-3 my-4'>
                {ResumeInfo?.skills?.length > 0 ? (
                    ResumeInfo.skills.map((skill, index) => (
                        <div key={index} className='flex items-center justify-between'>
                            <h2 className='text-xs'>{skill?.name}</h2>
                            <div className='h-2 bg-gray-200 w-[120px]'>
                                <div className='h-2'
                                    style={{
                                        backgroundColor: ResumeInfo?.themeColor || "#ff6666" ,
                                        width: skill?.rating * 20 + '%'
                                    }} >
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-center mt-2">No skills added yet.</p>
                )}
            </div>

        </div>
    )
}
