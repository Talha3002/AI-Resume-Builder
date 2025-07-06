import React, { useState, useContext, useEffect } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '../RichTextEditor';
import { Brain } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummary: '',
};

export const Experience = () => {
    const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const { resumeId } = useParams();
    const [experienceList, setExperienceList] = useState([]); // Initially empty

    useEffect(() => {
        const fetchExperience = async () => {
            if (!resumeId) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/experience/${resumeId}`);
                const data = response.data.experience || []; // Ensure it's an array

                const formattedData = data.map(exp => ({
                    ...exp,
                    startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
                    endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
                }));

                setExperienceList(formattedData);
                setResumeInfo(prev => ({ ...prev, experience: formattedData }));
            } catch (error) {
                console.error("Error fetching experience:", error);
            }
        };

        fetchExperience();
    }, [resumeId]);



    // Generate AI Summary for a specific experience
    const generateExpSummary = async (index) => {
        const title = experienceList[index]?.title;
        if (!title) return alert("Please enter a job title first!");

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/generate-experience', {
                title: title,
            });

            const generatedSummary = response.data.experiencesummary;

            // Update the specific experience in the list
            setExperienceList((prev) =>
                prev.map((exp, idx) =>
                    idx === index ? { ...exp, workSummary: generatedSummary } : exp
                )
            );
        } catch (error) {
            console.error("Error generating summary:", error.response?.data || error);
        }
        setLoading(false);
    };


    const handleChange = (index, event) => {
        const newEntries = [...experienceList];
        newEntries[index][event.target.name] = event.target.value;
        setExperienceList(newEntries);
    };

    const handleRichTextEditor = (content, name, index) => {
        setExperienceList((prev) =>
            prev.map((exp, idx) =>
                idx === index ? { ...exp, [name]: content } : exp
            )
        );
    };

    const addExperience = () => {
        setExperienceList([...experienceList, { ...formField, isNew: true }]);
    };

    const removeExperience = async (index) => {
        const entry = experienceList[index];
        setExperienceList(prev => prev.filter((_, i) => i !== index));
        if (entry._id) await axios.delete(`http://localhost:5000/api/experience/${entry._id}`);
    };

    const onSave = async (index) => {
        try {
            const entry = experienceList[index];
            const payload = {
                ...entry,
                userId: user.id,
                ResumeID: resumeId || null,
            };

            // Only include _id if it's an update
            if (entry._id) {
                payload._id = entry._id;
            }

            const response = await axios.post('http://localhost:5000/api/experience', payload);

            console.log("Saved Successfully:", response.data);

            setExperienceList(prev =>
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
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add your Previous Job experience</p>
                <div>
                    {experienceList.map((item, index) => (
                        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                            <div>
                                <label className='text-xs'>Position Title</label>
                                <Input name="title" value={item.title} onChange={(event) => handleChange(index, event)} defaultValue={ResumeInfo?.title} />
                            </div>
                            <div>
                                <label className='text-xs'>Company Name</label>
                                <Input name="companyName" value={item.companyName} onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className='text-xs'>City</label>
                                <Input name="city" value={item.city} onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className='text-xs'>State</label>
                                <Input name="state" value={item.state} onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className='text-xs'>Start Date</label>
                                <Input type="date" name="startDate" value={item.startDate} onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className='text-xs'>End Date</label>
                                <Input type="date" name="endDate" value={item.endDate} onChange={(event) => handleChange(index, event)} />
                            </div>

                            <div className='flex justify-between'>
                                <label className='text-sm'>Experience Summary</label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-primary border-primary flex gap-2"
                                    onClick={() => generateExpSummary(index)}
                                    disabled={loading}
                                >
                                    <Brain className='h-4 w-4' />
                                    {loading ? "Generating..." : "Generate from AI"}
                                </Button>
                            </div>

                            <div className='col-span-2'>
                                <RichTextEditor
                                    onRichTextEditor={(event) => handleRichTextEditor(event, 'workSummary', index)}
                                    name="workSummary" value={item.workSummary}
                                />
                            </div>

                            <div className='flex justify-between'>
                                <div className='flex gap-2'>
                                    <Button variant='outline' onClick={() => removeExperience(index)} className="text-primary">
                                        - Remove
                                    </Button>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <Button type="button" onClick={() => onSave(index)}>Save</Button>
                            </div>
                        </div>
                    ))}

                    <Button variant='outline' onClick={addExperience} className="text-primary">
                        + Add More Experience
                    </Button>
                </div>
            </div>
        </div>
    );
};
