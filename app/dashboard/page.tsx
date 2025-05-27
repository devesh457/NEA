'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/login'); // Not authenticated
    
    // Check if user is admin and redirect immediately
    const checkUserRole = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/me');
          if (response.ok) {
            const user = await response.json();
            if (user.role === 'ADMIN') {
              router.replace('/admin'); // Use replace instead of push to avoid back button issues
              return; // Don't set isCheckingRole to false if redirecting
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error);
        }
      }
      setIsCheckingRole(false); // Only set to false if not redirecting
    };
    
    if (session) {
      checkUserRole();
    }
  }, [session, status, router]);

  if (status === 'loading' || isCheckingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-gray-900 text-xl font-medium" style={{color: '#111827', fontSize: '1.25rem', fontWeight: '500'}}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'}}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(229, 231, 235, 0.5)', position: 'sticky', top: 0, zIndex: 50}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
          <div className="flex justify-between items-center h-16" style={{display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center'}}>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none'}}>
              NEA Website
            </Link>
            <div className="flex items-center space-x-4" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-full font-medium transition-all duration-200"
                style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', top: '25%', left: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #60a5fa, #a855f7)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', bottom: '25%', right: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #c084fc, #f472b6)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem'}}>
        {/* Welcome Section */}
        <div className="mb-8" style={{marginBottom: '2rem'}}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
            Welcome, {session.user?.name}
          </h1>
          <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
            Manage your NHAI-EA account and access exclusive content.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Profile</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>View and edit your profile information</p>
            <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Name:</span> {session.user?.name || 'Not provided'}</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Email:</span> {session.user?.email}</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Phone:</span> {session.user?.phone || 'Not provided'}</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Designation:</span> {session.user?.designation || 'Not provided'}</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Current Posting:</span> {session.user?.posting || 'Not provided'}</p>
            </div>
          </div>

          {/* Membership Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Membership</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Your membership status and benefits</p>
            <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Status:</span> Active Member</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Type:</span> Standard</p>
              <p className="text-gray-900" style={{color: '#111827'}}><span className="text-gray-600" style={{color: '#4b5563'}}>Since:</span> 2024</p>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Resources</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Access exclusive member resources</p>
            <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <Link href="/dashboard/circulars" className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #059669, #0d9488)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Circulars
              </Link>
              <Link href="/dashboard/member-directory" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #9333ea, #db2777)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Member Directory
              </Link>
            </div>
          </div>

          {/* Q&A Community Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Q&A Community</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Ask questions and share knowledge with fellow engineers</p>
            <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <p className="text-gray-900" style={{color: '#111827'}}>• Technical discussions</p>
              <p className="text-gray-900" style={{color: '#111827'}}>• Expert answers</p>
              <p className="text-gray-900" style={{color: '#111827'}}>• Knowledge sharing</p>
            </div>
            <div className="mt-4" style={{marginTop: '1rem'}}>
              <Link href="/qa" className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #059669, #0891b2)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Join Discussion
              </Link>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Events</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Upcoming events and registrations</p>
            <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <p className="text-gray-900" style={{color: '#111827'}}>• Annual Conference 2024</p>
              <p className="text-gray-900" style={{color: '#111827'}}>• Workshop Series</p>
              <p className="text-gray-900" style={{color: '#111827'}}>• Networking Events</p>
            </div>
          </div>

          {/* Guest House Booking Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Guest House</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Book guest house for official and personal stays</p>
            <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <p className="text-gray-900" style={{color: '#111827'}}>• NEA Guest House in Delhi</p>
              <p className="text-gray-900" style={{color: '#111827'}}>• Online booking system</p>
            </div>
            <div className="mt-4" style={{marginTop: '1rem'}}>
              <Link href="/dashboard/guest-house" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #4f46e5, #2563eb)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Book Now
              </Link>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-3" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginLeft: '0.75rem'}}>Settings</h3>
            </div>
            <p className="text-gray-600 mb-4" style={{color: '#4b5563', marginBottom: '1rem'}}>Manage your account preferences</p>
            <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <Link href="/dashboard/profile" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </Link>
              <Link href="/dashboard/change-password" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center" style={{width: '100%', background: 'linear-gradient(90deg, #f97316, #ef4444)', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.5rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
} 