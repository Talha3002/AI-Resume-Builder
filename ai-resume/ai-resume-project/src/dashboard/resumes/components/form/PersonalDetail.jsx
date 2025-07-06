import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const PersonalDetail = () => {
    const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const { user } = useUser();
    const { resumeId } = useParams();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeInfo({
            ...ResumeInfo,
            [name]: value
        });
    };

    const onSave = async (e) => {
        e.preventDefault();

        const finalResumeId = resumeId || ResumeInfo.resumeId || null;

        try {
            const response = await axios.post('http://localhost:5000/api/formupdate', {
                ...ResumeInfo,
                userId: user.id,
                ResumeID: finalResumeId,  // Force correct ID
            });
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error updating:", error);
        }
    };
    
    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get started with basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input name="firstName" required onChange={handleChange} defaultValue={ResumeInfo?.firstName} />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input name="lastName" required onChange={handleChange} defaultValue={ResumeInfo?.lastName} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input name="jobTitle" required onChange={handleChange} defaultValue={ResumeInfo?.jobTitle} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input name="address" required onChange={handleChange} defaultValue={ResumeInfo?.address} />
                    </div>
                    <div>
                        <label className='text-sm'>Phone no.</label>
                        <Input name="phone" required onChange={handleChange} defaultValue={ResumeInfo?.phone} />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input name="email" required onChange={handleChange} defaultValue={ResumeInfo?.email} />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
};