import React, { useContext, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useAuth } from '@clerk/clerk-react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';
import { apiEndoints } from '../util/apiEndpoint';
import UploadBox from "../components/Landing/UploadBox";

const Upload = () => {
  const [files,setFiles] = useState([]);

  const [uploading,setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMesaageType] = useState("");

  const {getToken} =  useAuth();

  const {credits, setCredits} = useContext(UserCreditsContext);

  const MAX_FILE =5;

  
  const handleFileChange= (e) =>{
     const selectedFiles = Array.from(e.target.files);

     if(files.length + selectedFiles.length > MAX_FILE) {
               setMessage(`you can only upload a maximum of ${MAX_FILE} files at once`);
               setMesaageType("error");
               return;
     }

     //add the new files into existing files

     setFiles((prevFiles) =>[...prevFiles,...selectedFiles]);
     setMessage("");
     setMesaageType("");

  }

  const handleRemoveFile = (index) =>{

    setFiles((prevFiles) => prevFiles.filter((_, i)  => i !== index));
    setMesaageType("");
    setMessage("");


  }

  const handleUpload = async ()  =>{
    if(files.length === 0){
      setMesaageType("error");
      setMessage("Please select one file to upload.");
      return;
    }

    if(files.length > MAX_FILE){
      setMessage(`You can only upload a maximum of ${MAX_FILE} files once.`)
      setMesaageType("");
    }

    setUploading(true);
    setMessage("uploading files...");
    setMesaageType("info");

    const  formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    
    try {
      const token = await getToken();
     const response = await  axios.post(apiEndoints.UPLOAD_FILE, formData, {headers:{"Content-Type":"multipart/form-data", Authorization:`Bearer ${token}`}});
       
     if(response.data &&  response.data.remainingCredits !== undefined){
      setCredits(response.data.remainingCredits);
     }

     setMessage("Files uploaded successfully");
     setMesaageType("success");
     setFiles([]);

    } catch (error) {
      console.error("Error uploading files ", error);
      
      setMessage(error.response?.data?.message || "Error uploading files. Please try again.");
      setMesaageType("error");
    } finally{
      setUploading(false);
    }



  }

  const isUploadDisable = files.length === 0 || files.length > MAX_FILE || credits <= 0 || files.length > credits;






  return (
    <DashboardLayout activeMenu="Upload">
      <div className="p-6">
        { message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3  ${messageType === 'error' ? 'bg-red-50 text-red-700': messageType === 'sucess'? 'bg-green-50 text-green-700':'bg-blue-50 text-blue-700'}`}>
                  {messageType === 'error' && <AlertCircle size={20}/>}
                  {message}

                </div>
        )}

        <UploadBox
        files={files}
        onFileChange={handleFileChange}
        onUpload = {handleUpload}
        uploading ={uploading}
        onRemove = {handleRemoveFile}
        remainingCredits = {credits}
        isUploadDisable = {isUploadDisable}
        
        
        />
      </div>
    </DashboardLayout>
  )
}

export default Upload