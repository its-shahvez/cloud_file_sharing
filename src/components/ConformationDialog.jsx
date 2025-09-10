import React from 'react'
import Model from './Model'

const ConformationDialog = (
    {
    isOpen,
    onClose,
    title="Confirm Action",
    message = "Are you sure you want to proced?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmationButtonClass ="bg-red-600 hover:bg-red-700"
}) => {
  return (
    <Model
     isOpen={isOpen}
     onClose={onClose}
     title={title}
     message={message}
     confirmText={confirmText}
     cancelText={cancelText}
     onConfirm={onConfirm}
    confirmationButtonClass={confirmationButtonClass}
    size="sm"
    >
        <p className='text-gray-600 '>{message }</p>
    </Model>

  )
}

export default ConformationDialog