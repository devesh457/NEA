'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/me');
          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.role === 'ADMIN');
          }
        } catch (error) {
          // Silent error handling for production
        }
      }
    };

    checkAdminRole();
  }, [session]);

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/5" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.05), 0 4px 6px -2px rgba(59, 130, 246, 0.05)'}}>
      <div className="max-w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20" style={{maxWidth: '100%', margin: '0 auto', padding: '0 2rem'}}>
        <div className="flex justify-between h-16" style={{display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center'}}>
          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
            <Link href="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300" style={{fontSize: '1.75rem', fontWeight: '800', textDecoration: 'none', transition: 'transform 0.3s ease'}}>
              NHAI-EA
            </Link>
          </div>
          <div className="flex items-center space-x-6" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            <Link href="/governing-body" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
              Leadership
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
            </Link>
            
            <Link href="/events" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
            </Link>
            
            {session && (
              <Link href="/qa" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
                Q&A
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
              </Link>
            )}
            
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : session ? (
              // Authenticated user navigation
              <>
                {isAdmin ? (
                  <Link href="/admin" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
                    Admin Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
                  </Link>
                )}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'linear-gradient(90deg, #eff6ff, #faf5ff)', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #dbeafe'}}>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden" style={{width: '2rem', height: '2rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: '600', overflow: 'hidden'}}>
                    {session.user?.imageUrl ? (
                      <img src={session.user.imageUrl} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      session.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">Welcome, {session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 border border-red-200/50 hover:border-red-300"
                  style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '9999px', fontWeight: '500', border: '1px solid rgba(248, 113, 113, 0.5)', cursor: 'pointer', transition: 'all 0.3s ease'}}
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link href="/login" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', position: 'relative'}}>
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full" style={{position: 'absolute', bottom: '-4px', left: 0, width: 0, height: '2px', background: 'linear-gradient(90deg, #2563eb, #9333ea)', transition: 'width 0.3s ease'}}></span>
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium hover:from-blue-700 hover:to-purple-700 border border-blue-500/20"
                  style={{background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '9999px', textDecoration: 'none', fontWeight: '500', transition: 'all 0.3s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)'}}
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 