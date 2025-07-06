import React, { useState } from 'react'
import { PlusSquare } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react' 
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

export const AddResume = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

 
    const handleCreateResume = async () => {
        if (!title) return alert("Title is required");

        try {
            const response = await axios.post('http://localhost:5000/api/resumes', {
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                title
            });
            console.log(response.data);
            setOpenDialog(false);
            navigate(`/resume/${response.data._id}/edit`);
        } catch (error) {
            console.error("Error creating resume", error);
        }
    };

    return (
        <div>
            <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed' onClick={() => setOpenDialog(true)}>
                <PlusSquare />
            </div>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your resume</p>
                            <Input className='my-2' placeholder='Ex. Full Stack Resume' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button variant='ghost' onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button onClick={handleCreateResume}>Create</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}
