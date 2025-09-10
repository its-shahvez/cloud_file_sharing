import React from 'react'

const CTASection = ({openSignUp}) => {
  return (
  <div className="bg-purple-500">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        <span className='block '>Ready to get started</span>
        <span className='block text-purple-100'>Create your account today.</span>
      </h2>
      <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
              onClick={() => openSignUp()}
              className='inline-flex items-center justify-center px-5 py-3 border border-trasparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 transition-collors duration-200'>
                Sign up for free
              </button>
            </div>
      </div>
    </div>
  </div>
  )
}

export default CTASection