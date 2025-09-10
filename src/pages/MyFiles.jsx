import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Copy, Download, Eye, File, FileIcon, FileText, Globe, Grid, Image, List, Lock, Music, Trash2, Video } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import FileCard from '../components/FileCard';
import { apiEndoints } from '../util/apiEndpoint';
import ConformationDialog from '../components/ConformationDialog';
import LinkShareModel from '../components/LinkShareModel';

//fetching the files login user

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [viewMode,setViewMode] = useState();
  const {getToken} = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen:false,
    fileId:null
  });
   
  const [shareModel, setShareModel] = useState({
    isOpen:false,
    fileId:null,
    link:""
  });

 
  //fetching the files for  logged user
  const fetchFiles = async() => {
     try {
      const token = await getToken();
      const response = await axios.get(apiEndoints.FETCH_FILES, {headers:{Authorization:`Bearer ${token}`}});

      if(response.status === 200){
           setFiles(response.data);
              
      }
      
     } catch (error) {
      console.log("Error fetching the files from server");
      toast.error("Error fetching the files from server",error.message);
      
     }
  }

  //Toggles public /private status file

  const  togglePublic = async(filetoUpadte) =>{
    try {
      const token =await getToken();
     axios.patch(apiEndoints.TOGGLE_FILE(filetoUpadte.id),{},{headers:{Authorization:`Bearer ${token}`}});


      setFiles(files.map((file) => file.id === filetoUpadte.id ? {...file, isPublic:!file.isPublic}:file));
  } catch (error) {
      console.log("Error toggline file status", error);
      toast.error("Error toggling file status", error.message);
      
    }

  }


  // handle file download 

  const handleDownload = async(file) =>{
    try {
      const token = await getToken();
       const response =await axios.get(apiEndoints.DOWNLOAD_FILE(file.id), {headers:{Authorization: `Bearer ${token}`}, responseType:'blob'});

      //crete a bolb url triggerd download
      const url = window.URL.createObjectURL(new Blob( [response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); //cleanup the object url

      
    } catch (error) {
      console.error("Download file", error);
      toast.error("Error downloading file", error.message);
    }

  }

  //delete confirmation
  const closeDeleteConfirmation = () =>{
    setDeleteConfirmation({
      isOpen:false,
      fileId:null
    })
  }

  //opens the delete confirmation model

  const  openDeleteConfirmation = (fileId) =>{
    setDeleteConfirmation({
      isOpen:true,
      fileId
    })
  }
 // delete file after confirmation
 const handleDelete = async () =>{
  const fileId = deleteConfirmation.fileId;
  
  if(!fileId) return;

  try {
    const token = await getToken();
   const response =await   axios.delete(apiEndoints.DELETE_FILE(fileId), {headers:{Authorization:`Bearer ${token}`}});
      if(response.status===204){
        setFiles(files.filter((file) => file.id != fileId));
        closeDeleteConfirmation();
      }else{
        toast.error(" Error deleting file");
      }
    
  } catch (error) {
    console.error('deleting the file ', error.message);

    
  }
 }

 //opens the share link model
 const openShareLinkModel = (fileId) =>{
  const link = `${window.location.origin}/file/${fileId}`
  setShareModel({
    isOpen:true,
    fileId,
    link
  });
 }

 //close to share link model
 const closeShareLinkModel = () =>{
  setShareModel({
    isOpen:false,
    fileId:null,
    link:""
  });
 }


  useEffect( () =>{
    fetchFiles();
  },[getToken]);

  const getFileIcon = (file) =>{
   const extension = file.name.split('.').pop().toLowerCase();
  
   if(['jpg','jpeg','png','gif','svg','webp'].includes(extension)){
    return <Image size={24} className='text-purple-500'/>
   }
   if(['mp4','webm','mov','aim','mkv'].includes(extension)){
      return <Video size={24} className='text-blue-500'/>
    }
    if(['mp3','wav','ogg','flac','m4a'].includes(extension)){
      return <Music size={24} className='text-green-500'/>
    }
    if(['pdf','doc','docx','text','rtf'].includes(extension)){
       return <FileText size={24} className='text-amber-500'/>
    }
     
    return <FileIcon size={24} className='text-purple-500'/>
  }

  return (
     <DashboardLayout activeMenu="My Files">
       <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Files {files.length}</h2>
          <div className="flex items-center gap-3">
                <List 
                onClick={() => setViewMode("list")}
                size={24}
                className={`cursor-pointer transition-color ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}/>
               
               <Grid
                size={24}
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer transition-color ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`} />
          </div>
        </div>
        {files.length===0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center">
              <File
              size={60}
              className='text-purple-300 mb-4'/>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No files uploaded yet
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Start uploading files to see them listed here. you can upload 
                documents, images, and other files to share and managed them securely.
              </p>
              <button
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                Go to Upload
              </button>
          </div>
        ): viewMode ==="grid" ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) =>(
              <FileCard
              key={file.id}
              file={file}
              onDelete ={openDeleteConfirmation}
              onTogglePublic = {togglePublic}
              onDownload = {handleDownload}
              onShareLink = {openShareLinkModel}
              />
            ))}
           </div>
        ):(
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                 {files.map((file) =>(
                  <tr key={file.id} className='hover:bg-gray-50 transition-color'>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gary-800">
                      <div className="flex items-center gap-2">
                       {getFileIcon(file)}
                      {file.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gary-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gary-600">
                       {new Date(file.uploadedAt).toLocaleDateString()} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  text-gary-600">
                       <div className="flex items-center gap-4">
                        <button
                        onClick={() => togglePublic(file)}
                        className="flex items-center gap-2 cursor-pointer group">
                               {file.isPublic ? (
                                <>
                                <Globe size={16} className='text-green-500'/>
                                 <span className="group-hover:underline">
                                  Public
                                 </span>
                                </>
                               ):(
                                <>
                                <Lock size={16} className='text-gray-500 '/>
                                <span className="group-hover:underline">
                                     Private
                                </span>
                                </>
                               )}
                        </button>
                        {file.isPublic &&(
                          <button
                           onClick={() => openShareLinkModel(file.id)}
                          className="flex items-center gap-2 cursor-pointer group text-blue-600">
                           <Copy size={16} />
                           <span className="group-hover:underline">
                            Share Link
                           </span>
                          </button>
                        )}
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex justify-center">
                          <button
                          onClick={() => handleDownload(file)} 
                          title='Download'
                          className="text-gray-500 hover:text-green-600">
                             <Download size={18}/>
                          </button>
                        </div>
                        <div className="flex justify-center">
                          <button
                          onClick={() => openDeleteConfirmation(file.id)} 
                          title='Delete'
                          className="text-gray-500 hover:text-red-600">
                           <Trash2 size={18}/>
                          </button>
                        </div>
                        <div className="flex justify-center">
                          {file.isPublic ?(
                           <Link to={`/file/${file.id}`} className='text-gray-500 hover:text-blue-600'>
                                    <Eye size={18}/>
                           </Link>
                          ):(
                            <span className="w-[18px]"></span>
                          )}
                        </div>
                      </div>

                     </td>
                       
                  </tr>
                 ))}
              </tbody>
            </table>
          </div>

        )}

        {/* delete confirmation dialog */}
        <ConformationDialog
         isOpen={deleteConfirmation.isOpen}
         onClose={closeDeleteConfirmation}
         title="Delele File"
         message='Are you sure want to delete this file? This action cannot be undone.'
         confirmText='Delete'
         cancelText='Cancel'
         onConfirm={handleDelete}
         confirmationButtonClass='bg-red-600 hover:bg-red-700'
        />

        {/* share link model */}

        <LinkShareModel
        isOpen={shareModel.isOpen}
        onClose={closeShareLinkModel}
        link={shareModel.link}
        title='Share File'
        />
       </div>
     </DashboardLayout>
  )
}

export default MyFiles