import { useState } from 'react'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import  Signin  from './auth/signin/signin'
import Signup from './auth/signup/signup'
import  Home  from './Home/home'
import Dashboard from './dashboard/dashboard'
import { Edit } from './dashboard/resumes/[userId]/edit/edit'
import { ViewResume } from './my-resume/[resumeId]/view/ViewResume'
function App() {
  
  return (
    <Routes>
    <Route path='/' element = {<Home />} />
    <Route path='/dashboard' element = {<Dashboard />} />
    <Route path='/auth/signin' element = {<Signin />} />
    <Route path='/auth/signup' element = {<Signup />} />
    <Route path='/resume/:resumeId/edit' element = {<Edit />} />
    <Route path='/my-resume/:resumeId/view' element = {<ViewResume />} />
  </Routes>
  )
}

export default App
