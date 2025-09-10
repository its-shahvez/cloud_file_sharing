import React, {  useContext, useEffect, useRef, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useAuth, useUser } from '@clerk/clerk-react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import axios from 'axios';
import { apiEndoints } from '../util/apiEndpoint';
import { AlertCircle, Check, CreditCard, Loader2 } from 'lucide-react';

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(false);

  const [message, setMessage] = useState(false);

  const [messageType, setMessageType] = useState("");

  const {getToken} = useAuth();

  const {user} = useUser()

  const razorpayScriptref = useRef(null);

  const {credits, setCredits, fetchUserCredits} = useContext(UserCreditsContext);

  const [razorpayLoading, setRazorpayLoading] = useState(false);


   // Plans configuration
 const plans = [
     {
         id: "premium",
         name: "Premium",
         credits: 500,
         price: 500,
         features: [
             "Upload up to 500 files",
             "Access to all basic features",
             "Priority support"
         ],
         recommended: false
     },
     {
         id: "ultimate",
         name: "Ultimate",
         credits: 5000,
         price: 2500,
         features: [
             "Upload up to 5000 files",
             "Access to all premium features",
             "Priority support",
             "Advanced analytics"
         ],
         recommended: true
     }
 ];
 // Load Razorpay script
 useEffect(() => {
     if (!window.Razorpay) {
         const script = document.createElement('script');
         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
         script.async = true;
         script.onload = () => {
             console.log('Razorpay script loaded successfully');
            setRazorpayLoading(true);
         };
         script.onerror = () => {
             console.error('Failed to load Razorpay script');
             setMessage('Payment gateway failed to load. Please refresh the page and try again.');
             setMessageType('error');
         };
         document.body.appendChild(script);
        razorpayScriptref.current = script;
     } else {
         setRazorpayLoading(true);
     }
     return () => {
         // Cleanup script on component unmount
         if (razorpayScriptref.current) {
             document.body.removeChild(razorpayScriptref.current);
         }
     };
 }, []);

  // Fetch user credits on component mount
 useEffect(() => {
     const fetchUserCredits = async () => {
         try {
             const token = await getToken();
             const response = await axios.get(apiEndoints.GET_CREDITS, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });
             setCredits(response.data.credits);
         } catch (error) {
             console.error("Error fetching user credits:", error);
             setMessage("Failed to load your current credits. Please try again later.");
             setMessageType("error");
         }
     };
     fetchUserCredits();
 }, [getToken]);

  const  handlePurchase = async(plan) =>{
    if(!razorpayLoading){
        setMessage("Payment gateway is still loading. Please wait a moment and try again");
        setMessageType("error");
        return;
    }

    setProcessingPayment(true);
    setMessage('');

    try {
        const token = await getToken();
        const response =await axios.post(apiEndoints.CREATE_ORDER,{
            planId:plan.id,
            amount:plan.price*100,
            currency:"INR",
            credits:plan.credits
        }, {
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
       
        const  option = {
            key : import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount:plan.price *100,
            currency:"INR",
            name :"CloudShare",
            description :`Purchase ${plan.credits} credits`,
            order_id: response.data.orderId,
        handler: async function (response) {
          try {
              const verifyResponse = await axios.post(apiEndoints.VERIFY_PAYMENT, {
             razorpay_order_id: response.razorpay_order_id,
             razorpay_payment_id: response.razorpay_payment_id,
             razorpay_signature: response.razorpay_signature,
             planId: plan.id
           },  {
               headers: {
                    'Authorization': `Bearer ${token}`
               }
            });

           if (verifyResponse.data.success) {
                 // Update credits immediately with the value from the response
              if (verifyResponse.data.credits) {
                 console.log('Updating credits to:', verifyResponse.data.credits);
                 setCredits(verifyResponse.data.credits);
              } else {
                 // If credits not in response, fetch the latest credits from the server
                 console.log('Credits not in response, fetching latest credits');
                 await fetchUserCredits();
             }
                 setMessage(`Payment successful! ${plan.name} plan activated.`);
                 setMessageType("success");
           } else {
                 setMessage("Payment verification failed. Please contact support.");
                 setMessageType("error");
                }
            } catch (error) {
                console.error("Payment verification error:", error);
                setMessage("Payment verification failed. Please contact support.");
                setMessageType("error");
               }
            },
             prefill: {
                name: user.fullName,
                 email: user.primaryEmailAddress
            },
            theme: {
               color: "#3B82F6"
            }
        };
            if (window.Razorpay) {
                const razorpay = new window.Razorpay(option);
                razorpay.open();
            } else {
                throw new Error('Razorpay SDK not loaded');
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
            setMessage("Failed to initiate payment. Please try again later.");
            setMessageType("error");
       }finally{
        setProcessingPayment(false);
       }

    }  



  return (
   <DashboardLayout activeMenu="Subscription">
     <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-600 mb-6">Choose a plan that works for you</p>

        {message && (
     <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
        messageType === 'error' ? 'bg-red-50 text-red-700' :
            messageType === 'success' ? 'bg-green-50 text-green-700' :
                'bg-blue-50 text-blue-700'
        }`}>
        {messageType === 'error' && <AlertCircle size={20} />}
        {message}
      </div>
     )}
        
        <div className="flex flerx-col md:flex-row gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                     <CreditCard className="text-purple-500" />
                     <h2 className="text-lg font-medium">Current Credits: <span className="font-bold text-purple-500">{credits}</span></h2>
                  </div>
                 <p className="text-sm text-gray-600 mt-2">
                     You can upload {credits} more files with your current credits.
                 </p>
             </div>
        </div>   

        <div className="grid md:grid-cols-2 gap-6">
             {plans.map((plan) => (
          <div
             key={plan.id}
            className={`border rounded-xl p-6 ${
             plan.recommended
                 ? 'border-purple-200 bg-purple-50 shadow-md'
                 : 'border-gray-200 bg-white'
            }`} >
            {plan.recommended && (
             <div className="inline-block bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                 RECOMMENDED
             </div>
            )}
             <h3 className="text-xl font-bold">{plan.name}</h3>
               <div className="mt-2 mb-4">
                 <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-500"> for {plan.credits} credits</span>
                </div>
               <ul className="space-y-3 mb-6">
                   {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                         <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                      </li>
                    ))}
                </ul>
               <button
                 onClick={() => handlePurchase(plan)}
                   disabled={processingPayment}
                   className={`w-full py-2 rounded-md font-medium transition-colors ${
                    plan.recommended
                       ? 'bg-purple-500 text-white hover:bg-purple-600'
                       : 'bg-white border border-purple-500 text-purple-500 hover:bg-purple-50'
                    } disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                   {processingPayment ? (
                  <>
                     <Loader2 size={16} className="animate-spin" />
                     <span>Processing...</span>
                  </>
                  ) : (
                    <span>Purchase Plan</span>
                    )}
               </button>
           </div>
           ))}
         </div>
      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2">How credits work</h3>
             <p className="text-sm text-gray-600">
              Each file upload consumes 1 credit. New users start with 5 free credits.
              Credits never expire and can be used at any time. If you run out of credits,
              you can purchase more through one of our plans above.
           </p>
      </div>
  </div>
   </DashboardLayout>
  )
}

export default Subscription