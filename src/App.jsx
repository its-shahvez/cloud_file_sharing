
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import Transaction from "./pages/Transaction"
import Subscription from "./pages/Subscription";
import { RedirectToSignIn, SignedOut, SignedIn } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { UserCreditsProvider } from './context/UserCreditsContext';
import PublicFileView from './pages/PublicFileView';


const App = () => {
  return (
  <UserCreditsProvider>
     <BrowserRouter>
    <Toaster/>
    <Routes>

      <Route path ="/" element={<LandingPage/>}/>  
      <Route path ="/dashboard" element={
        <>
        <SignedIn> <Dashboard/></SignedIn>
        <SignedOut><RedirectToSignIn/></SignedOut>
        
        </>
      }/>
      <Route path ="/upload" element={
        <>
        <SignedIn><Upload/></SignedIn>
        <SignedOut><RedirectToSignIn/></SignedOut>
 
        </>
      }/>
      <Route path ="/my-files" element={
        <>
        <SignedIn><MyFiles/></SignedIn>
        <SignedOut><RedirectToSignIn/></SignedOut>
        </>
      }/>
      <Route path ="/transactions" element={
        <>
        <SignedIn><Transaction/></SignedIn>
        
          <SignedOut><RedirectToSignIn/></SignedOut>
        </>
      }/>
      <Route path ="/subscriptions" element={
        <>
        <SignedIn><Subscription/></SignedIn>
        <SignedOut><RedirectToSignIn/></SignedOut>
        </>
      }/>
      <Route path="file/:fileId" element={
        
        <>
        <PublicFileView/>
        </>

      }/>
      <Route path='/*' element={<RedirectToSignIn/>}/>

    </Routes>
    
    
    
    </BrowserRouter>
  </UserCreditsProvider>
  )
}

export default App