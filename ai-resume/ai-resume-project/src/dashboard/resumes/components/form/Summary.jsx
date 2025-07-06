import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Brain } from 'lucide-react'
import { useParams } from 'react-router-dom';

export const Summary = () => {
    const { ResumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState(ResumeInfo.summary || '');
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!resumeId || ResumeInfo.summary) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/getSummary/${resumeId}`);
                if (response.data.summary) {
                    setSummary(response.data.summary);
                    setResumeInfo((prev) => ({ ...prev, summary: response.data.summary }));
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        fetchSummary();
    }, [resumeId]);

    // Generate AI Summary
    const generateSummary = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/generate-summary', {
                jobTitle: ResumeInfo.jobTitle,
            });
            setSummary(response.data.summary);
            setResumeInfo((prev) => ({ ...prev, summary: response.data.summary }));
        } catch (error) {
            console.error("Error generating summary:", error.response?.data || error);
        }
        setLoading(false);
    };

    const onSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/summary', {
                ResumeID: resumeId || ResumeInfo.ResumeID || "",
                summary,
            });
        } catch (error) {
            console.error("Error updating:", error.response?.data || error);
        }
    };

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summary</h2>
                <p>Add Summary for your job title</p>

                <form className='mt-7' onSubmit={onSave}>
                    <div className='flex justify-between items-end'>
                        <label>Add Summary</label>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-primary border-primary flex gap-2"
                            onClick={generateSummary}
                            disabled={loading}
                        >
                            <Brain className='h-4 w-4' />
                            {loading ? "Generating..." : "Generate from AI"}
                        </Button>
                    </div>
                    <Textarea 
                        className="mt-5" 
                        value={summary}
                        required 
                        onChange={(e) => setSummary(e.target.value)}
                    />
                    <div className='mt-2 flex justify-end'>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
