import React, { useState } from 'react';

const BackgroundWave = () => (
  <div className="absolute inset-0 overflow-hidden z-0"> 
    <svg 
      viewBox="0 0 1440 500" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-full" 
      preserveAspectRatio="none"
    >
      <path 
        d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,192C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,500L1392,500C1344,500,1248,500,1152,500C1056,500,960,500,864,500C768,500,672,500,576,500C480,500,384,500,288,500C192,500,96,500,48,500L0,500Z"
        fill="currentColor" 
        className="text-primary opacity-20"
      ></path>
    </svg>
  </div>
);

const GetStarted = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const formData = isSignUp 
      ? { fullName, email, password } 
      : { email, password };
    console.log(`${isSignUp ? 'Creating Account' : 'Signing In'} with:`, formData);
  };

  return (
    <div className="relative min-h-screen font-sans">
      <BackgroundWave />
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        <div className="w-full max-md:mt-32 md:w-1/2 flex flex-col justify-center items-center text-center md:text-left p-8 sm:p-12">
          <div className="max-w-md">
            <h1 className="font-black text-6xl text-primary">
              plus<span className='text-black'>ONE</span>
            </h1>
            <h2 className="mt-4 font-bold text-3xl text-charcoal">
              Never travel solo.
            </h2>
            <p className="mt-6 text-base text-slate-gray leading-relaxed">
             Find your travel crew, right on campus. plusONE connects you with other students for trips to the station, city, or home. Split the fare, stay safe, and never travel solo again. Your commute just got a major upgrade.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-center text-charcoal mb-6">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-slate-gray">Full Name</label>
                      <input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange" />
                    </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-gray">Email Address</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Use your @college.edu email" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-gray">Password</label>
                  <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange" />
                </div>
                <div>
                  <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                    {isSignUp ? 'Create My Account' : 'Sign In'}
                  </button>
                </div>
              </form>
              <p className="mt-6 text-center text-sm text-slate-gray">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setIsSignUp(!isSignUp)} className="ml-1 font-medium text-primary-orange hover:text-orange-600 focus:outline-none">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetStarted;