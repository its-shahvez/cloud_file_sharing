import React, { useEffect } from 'react'
import HeroSection from '../components/Landing/HeroSection'
import FeatureSection from '../components/Landing/FeatureSection'
import PricingSection from '../components/Landing/PricingSection'
import TestimonalSection from '../components/Landing/TestimonalSection'
import CTASection from '../components/Landing/CTASection'
import FooterSection from '../components/Landing/FooterSection'
import { features, pricingPlans, testimonials } from '../assets/data'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
const LandingPage = () => {
  const {openSignIn, openSignUp} = useClerk();
  const {isSignedIn} = useUser();
  const navigate = useNavigate()

  useEffect(() =>{
    if(isSignedIn){
      navigate("/dashboard")
    }
  }, [isSignedIn, navigate]);
  return (
    
    <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
         <HeroSection  openSignIn = {openSignIn}  openSignUp={openSignUp}/>

      {/* Feature  Section */}
         <FeatureSection features={features}/>

      {/* Pricing  Section */}
        <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp}/>
    

      {/* Testimonal  Section */}
        <TestimonalSection testimonials={testimonials}/>

      {/* CTA Section */}
        <CTASection openSignUp={openSignUp}/>

      {/* Fpoter Section */}
        <FooterSection />
    </div>
  )
}

export default LandingPage