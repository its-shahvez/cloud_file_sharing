import { Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Music, Trash2, Video } from 'lucide-react';
import React, { useState } from 'react'

const FileCard = ({file, onDelete, onTogglePublic, onDownload, onShareLink}) => {
    const [showAction, setShowAction] = useState(false);

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
    
    const formatFileSize = (bytes) =>{
        if(bytes < 1024) return bytes + " B";
        else if(bytes < 1048576) return (bytes/1024).toFixed(1)+' KB';
        else return (bytes/1048576).toFixed(1)+" MB";
    }

    const formatDate = (dateString) =>{
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined,{year: 'numeric',month:'short',day:'numeric'});
    }

  return (
<div 
    onMouseEnter={() => setShowAction(true)}
    onMouseLeave={() => setShowAction(false)}
    className='relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100'>
       {/* file preview area */}
        <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
            {getFileIcon(file)}
        </div>

      {/*public/private badge */}

   <div className="absolute top-2 right-2">

        <div className={`rounded-full p-1.5 ${file.isPublic ? 'bg-green-100':'bg-gray-100'}`} title={file.isPublic ? "Public":"Private"}>
              {file.isPublic ?(
                <Globe size={14} className='text-green-600'/>
              ):(
                <Lock size={14} className='text-gray-600'/>
              )}
        </div>

    </div>
    
     {/*File Info */}

    <div className="p-4">
        <div className="flex justify-between item-start">
          <div className="overflow-hidden">
            <h3 title={file.name} className="font-medium text-gray-900 truncate">
                    {file.name}
            </h3>
            <p className="text-gray-500 mt-1">
                {formatFileSize(file.size)} {formatDate(file.uploadedAt)}
            </p>
          </div>

        </div>
    </div>

    {/*Action Button */}
    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-300 ${showAction ? 'opacity-100':'opacity-0'}`}>
     <div className="flex gap-3 justify-center">
        {file.isPublic &&(
            <button 
            onClick={() => onShareLink(file.id)}
            title='Share Link'
            className="p-2 cursor-pointer bg-white/90 rounded-full hover:bg-white transition-colors text-purple-500 hover:text-purple-600">
                  <Copy size={18}/>
            </button>
        )}

        {file.isPublic &&( 
            <a href={`/file/${file.id}`} title='View File' target='_blank' rel='noreferre' className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900'>
               <Eye size={18}/>
            </a>
        )}

        <button
        onClick={() => onDownload(file)}
        title='Download'
        className="p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-green-600 hover:text-green-700">
          <Download size={18}/>    
        </button>

        <button
        onClick={() => onTogglePublic(file)}
        title={file.isPublic ? "Make Private":"Make Public"}
        className=" p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-amber-600 hover:text-amber-700">

            {file.isPublic ? <Lock size={18}/> :<Globe size={18}/>}
        </button>

        <button 
        onClick={() => onDelete(file.id)}
        title='Delete'
        className='p-2 bg-white/90 rounded-full hover:bg-white cursor-pointer transition-colors text-red-600 hover:text-red-700'>
          <Trash2 size={18}/>
        </button>

     </div>
    </div>

 </div>
    
  )
}

export default FileCard