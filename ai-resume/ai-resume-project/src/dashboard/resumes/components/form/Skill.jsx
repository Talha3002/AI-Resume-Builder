import React, { useState, useContext, useEffect } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Input } from '@/components/ui/input';
import { Rating } from '@smastrom/react-rating';
import { Button } from '@/components/ui/button';
import '@smastrom/react-rating/style.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const formField = {
    name: '',
    rating: 0,
};

export const Skill = () => {
    const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const { resumeId } = useParams();
    const [skillList, setSkillList] = useState(ResumeInfo?.skills?.length ? ResumeInfo.skills : [{ ...formField, isNew: true }]);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!resumeId) return;
    
            try {
                const response = await axios.get(`http://localhost:5000/api/getSkill/${resumeId}`);
                const data = response.data.skills || []; // Ensure it's an array
    
                const formattedData = data.map(skl => ({
                    ...skl,
                }));
    
                setSkillList(formattedData);
                setResumeInfo(prev => ({ ...prev, skills: formattedData })); // ✅ Update education, not experience
            } catch (error) {
                console.error("Error fetching education:", error);
            }
        };
    
        fetchSkills();
    }, [resumeId]);
    

    const handleChange = (index, name, value) => {
        const newEntries = [...skillList];
        newEntries[index] = { ...newEntries[index], [name]: value };
        setSkillList(newEntries);
    };

    const AddSkills = () => {
        setSkillList([...skillList, { ...formField, isNew: true }]);
    };

    const RemoveSkills = async (index) => {
        try {
            const skillToDelete = skillList[index];
            if (!skillToDelete || !skillToDelete._id) {
                console.error("Skill ID is missing, cannot delete.");
                return;
            }
    
            await axios.delete(`http://localhost:5000/api/deleteskill/${skillToDelete._id}`);
            
            setSkillList(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting skill:", error.response?.data || error.message);
        }
    };
    
    const onSave = async (index) => {
        try {
            const entry = skillList[index];
    
            if (!entry || !entry.name) {
                console.error("Invalid Data: Name and Rating are required");
                return;
            }
    
            const response = await axios.post('http://localhost:5000/api/skill', {
                ...entry,
                ResumeID: resumeId || null,
            });
    
            console.log("Saved Successfully:", response.data);
    
            // Ensure the skill list updates with the newly assigned _id
            setSkillList((prev) => {
                const newSkills = [...prev];
                newSkills[index] = { ...entry, _id: response.data._id }; // Store the returned _id
                return newSkills;
            });
    
        } catch (error) {
            console.error("Error saving:", error.response?.data || error.message);
        }
    };
    

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Skills</h2>
                <p>Add your top professional key skills</p>

                <div>
                    {skillList.map((item, index) => (
                        <div key={index} className='flex justify-between mb-2 border rounded-lg p-3'>
                            <div>
                                <label className='text-xs'>Name</label>
                                <Input className='w-full' value={item.name || ''} onChange={(e) => handleChange(index, 'name', e.target.value)} />
                            </div>
                            <Rating style={{ maxWidth: 120 }} value={item.rating || 0} onChange={(v) => handleChange(index, 'rating', v)} />
                            <Button variant='outline' onClick={() => RemoveSkills(index)}> - Remove</Button>
                        </div>
                    ))}
                </div>
                <div className='flex justify-end'>
                    <Button type="submit" onClick={() => skillList.forEach((_, index) => onSave(index))}>Save</Button>
                </div>

                <Button variant='outline' onClick={AddSkills} className="text-primary"> + Add More Skills</Button>
            </div>
        </div>
    );
};
