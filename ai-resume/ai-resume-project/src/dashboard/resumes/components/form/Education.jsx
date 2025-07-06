import React, { useState, useContext, useEffect } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const formField = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
};

export const Education = () => {
    const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const { user } = useUser();
    const { resumeId } = useParams();

    // Load education list from context OR initialize with default value
    const [educationList, setEducationList] = useState(ResumeInfo?.education?.length ? ResumeInfo.education : [{ ...formField, isNew: true }]);

    useEffect(() => {
        const fetchEducation = async () => {
            if (!resumeId) return;
    
            try {
                const response = await axios.get(`http://localhost:5000/api/getEducation/${resumeId}`);
                const data = response.data.education || []; // Ensure it's an array
    
                const formattedData = data.map(edu => ({
                    ...edu,
                    startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
                    endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
                }));
    
                setEducationList(formattedData);
                setResumeInfo(prev => ({ ...prev, education: formattedData })); // ✅ Update education, not experience
            } catch (error) {
                console.error("Error fetching education:", error);
            }
        };
    
        fetchEducation();
    }, [resumeId]);
    

    const handleChange = (index, event) => {
        const newEntries = [...educationList];
        newEntries[index][event.target.name] = event.target.value;
        setEducationList(newEntries);
    };

    const AddEducation = () => {
        setEducationList([...educationList, { ...formField, isNew: true }]);
    };

    const removeEducation = async (index) => {
        setEducationList(prev => prev.filter((_, i) => i !== index));
        await axios.delete('http://localhost:5000/api/deleteeducation');
    };

    const onSave = async (index) => {
        try {
            const entry = educationList[index];
            const payload = {
                ...entry,
                userId: user.id,
                ResumeID: resumeId || null,
            };

            if (entry._id) {
                payload._id = entry._id;
            }

            const response = await axios.post('http://localhost:5000/api/education', payload);

            console.log("Saved Successfully:", response.data);

            setEducationList(prev =>
                prev.map((exp, idx) =>
                    idx === index ? { ...exp, _id: response.data._id } : exp
                )
            );
        } catch (error) {
            console.error("Error saving:", error.response?.data || error.message);
        }
    };
    
    
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Education</h2>
                <p>Add your Educational Details</p>

                {educationList.map((item, index) => (
                    <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                        <div className='col-span-2'>
                            <label className='text-xs'>University Name</label>
                            <Input name="universityName" value={item.universityName || ''} onChange={(event) => handleChange(index, event)} />
                        </div>
                        <div>
                            <label className='text-xs'>Degree</label>
                            <Input name="degree" value={item.degree || ''} onChange={(event) => handleChange(index, event)} />
                        </div>
                        <div>
                            <label className='text-xs'>Major</label>
                            <Input name="major" value={item.major || ''} onChange={(event) => handleChange(index, event)} />
                        </div>
                        <div>
                            <label className='text-xs'>Start Date</label>
                            <Input type="date" name="startDate" value={item.startDate || ''} onChange={(event) => handleChange(index, event)} />
                        </div>
                        <div>
                            <label className='text-xs'>End Date</label>
                            <Input type="date" name="endDate" value={item.endDate || ''} onChange={(event) => handleChange(index, event)} />
                        </div>
                        <div className='col-span-2'>
                            <label className='text-xs'>Description</label>
                            <Textarea className="mt-2" name="description" value={item.description || ''} onChange={(event) => handleChange(index, event)} />
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2'>
                                <Button variant='outline' onClick={() => removeEducation(index)} className="text-primary">
                                    - Remove
                                </Button>
                            </div>
                        </div>

                        <div className='flex justify-end'>
                            {(
                                <Button type="button" onClick={() => onSave(index)}>Save</Button>
                            )}
                        </div>
                    </div>
                ))}

                <Button variant='outline' onClick={AddEducation} className="text-primary mt-4">
                    + Add More Education
                </Button>
            </div>
        </div>
    );
};
