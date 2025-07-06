import React from 'react'
import { Notebook } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ResumeCardItems = ({ resume }) => {
    return (
        <Link to={'/resume/' + resume._id + '/edit'}>
            <div>
                <div className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200
                 flex items-center justify-center h-[280px] border border-primary rounded-lg
    hover:scale-105 transition-all hover:shadow-md shadow-primary cursor-pointer'
                    style={{
                        borderColor: resume?.themeColor 
                    }}>
                    < Notebook />
                    <img src="/cv.png" width={80} height={80} />
                </div>
                <h2 className='text-center my-1'>{resume.title}</h2>
            </div>
        </Link>
    )
}
