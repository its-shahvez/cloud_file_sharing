import { ArrowUpCircle, Clock, CreditCard, FileText, Share2, Shield, Wallet } from 'lucide-react'
import React from 'react'

const FeatureSection = ({features}) => {
  const renderIcon = (iconName, iconColor) =>{
    const iconProps = {size:25, className:iconColor}
     switch (iconName){
      case 'ArrowUpCircle':
         return <ArrowUpCircle {...iconProps}/>;
      case 'Shield':
        return <Shield {...iconProps}/> ;
      case 'Share2':
        return <Share2 {...iconProps}/> ;
      case 'CreditCard':
        return <CreditCard {...iconProps}/>; 
      case 'FileText':
        return <FileText {...iconProps}/>;  
      case 'Clock':
       return <Clock {...iconProps}/>; 
      default:
        return <FileText {...iconProps}/>; 
     }
  }
  return (
   <div className="py-16 bg-white">
    <div className="max-w-7xl max-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
         <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl ml-75">
          Everything you need for the  file sharing
         </h2>
         <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 ml-105">
          ClodShare provides all the tools you need to manage your digital content
         </p>
      </div>
      <div className="mt-16 ml-55">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
           {features.map((feature,index) =>(
              <div key={index} className='pt-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration:300 bg-white '>
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 ">
                        <div className="-mt-6">
                          <div className='inline-flex items-center justify-center p-3 bg-white rounded-md shadow-lg'>
                            {renderIcon(feature.iconName,feature.iconColor)}
                          </div>
                          <h3 className="mt-5 text-lg font-medium text-gray-900 tracking-tight">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-base text-gray-500">
                            {feature.description}
                          </p>

                        </div>
                </div>
              </div>
           ))}
        </div>

      </div>
    </div>
   </div>
  )
}

export default FeatureSection