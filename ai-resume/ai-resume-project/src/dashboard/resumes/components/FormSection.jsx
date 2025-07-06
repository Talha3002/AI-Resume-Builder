import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LayoutGrid, ArrowRight, ArrowLeft } from 'lucide-react'
import { PersonalDetail } from './form/PersonalDetail'
import { Summary } from './form/Summary'
import { Experience } from './form/Experience'
import { Education } from './form/Education'
import { Skill } from './form/Skill'
import { ThemeColor } from './ThemeColor'
import { Navigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { ViewResume } from '@/my-resume/[resumeId]/view/ViewResume'

export const FormSection = () => {
  const [activeForm, setactiveForm] = useState(1);
  const [enabledNext, setenabledNext] = useState(false);
 const { resumeId } = useParams();

  return (
    <div>
      <div className='flex justify-between items-center'>
       <ThemeColor />
        <div className='flex gap-2'>
          {activeForm > 1 && <Button size='sm' onClick={() => setactiveForm(activeForm - 1)}><ArrowLeft /> </Button>}
          <Button className='flex gap-2' size='sm' onClick={() => setactiveForm(activeForm + 1)}>Next <ArrowRight /></Button>
        </div>
      </div>
      {activeForm == 1 ? <PersonalDetail enabledNext={(v)=>setenabledNext(v)} /> : null}
      {activeForm == 2 ? < Summary /> : null}
      {activeForm == 3 ? < Experience /> : null}
      {activeForm == 4 ? < Education /> : null}
      {activeForm == 5 ? < Skill /> : null}
      {activeForm == 6 ? <Navigate to={`/my-resume/${resumeId}/view`} replace /> : null}
    </div>
  )
} 