'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
              NHAI-EA
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/governing-body" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
              Leadership
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/events" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
              Events
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {session && (
              <Link href="/qa" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
                Q&A
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            ) : session ? (
              // Authenticated user navigation
              <>
                {isAdmin ? (
                  <Link href="/admin" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
                    Admin
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ) : (
                  <Link href="/dashboard" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
                <div className="hidden lg:flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                    {session.user?.imageUrl ? (
                      <img src={session.user.imageUrl} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                    ) : (
                      session.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-gray-700 text-sm font-medium truncate max-w-[120px]">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-3 py-1.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 border border-red-200/50 hover:border-red-300 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link href="/login" className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group text-sm lg:text-base">
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium hover:from-blue-700 hover:to-purple-700 border border-blue-500/20 text-sm"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/governing-body" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                Leadership
              </Link>
              
              <Link 
                href="/events" 
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                Events
              </Link>
              
              {session && (
                <Link 
                  href="/qa" 
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  onClick={closeMobileMenu}
                >
                  Q&A
                </Link>
              )}
              
              {session ? (
                <>
                  {/* User info on mobile */}
                  <div className="border-t border-gray-200/50 pt-3 mt-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                        {session.user?.imageUrl ? (
                          <img src={session.user.imageUrl} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                        ) : (
                          session.user?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-gray-700 font-medium">{session.user?.name}</span>
                    </div>
                    
                    {isAdmin ? (
                      <Link 
                        href="/admin" 
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                        onClick={closeMobileMenu}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link 
                        href="/dashboard" 
                        className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        signOut({ callbackUrl: '/' });
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200/50 pt-3 mt-3 space-y-3">
                  <Link 
                    href="/login" 
                    className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-full font-medium transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 