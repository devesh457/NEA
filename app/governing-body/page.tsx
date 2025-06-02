'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface GoverningBodyMember {
  id: string;
  name: string;
  position: string;
  email?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
  order: number;
}

export default function GoverningBodyPage() {
  const { data: session, status } = useSession();
  const [members, setMembers] = useState<GoverningBodyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/governing-body');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" style={{animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', borderBottom: '2px solid #2563eb', margin: '0 auto 1rem'}}></div>
          <p className="text-gray-600" style={{color: '#4b5563'}}>Loading governing body members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'}}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(229, 231, 235, 0.5)', position: 'sticky', top: 0, zIndex: 50}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
          <div className="flex justify-between h-16" style={{display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center'}}>
            <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none'}}>
                NEA Website
              </Link>
            </div>
            <div className="flex items-center space-x-4" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease'}}>
                Home
              </Link>
              {status === 'loading' ? (
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              ) : session ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease'}}>
                    Dashboard
                  </Link>
                  <span className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>
                    Welcome, {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors" style={{color: '#374151', fontWeight: '500', transition: 'color 0.2s ease', background: 'none', border: 'none', cursor: 'pointer'}}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" style={{color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease'}}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="relative overflow-hidden py-24" style={{position: 'relative', overflow: 'hidden', padding: '6rem 0'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(147, 51, 234, 0.1))'}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center'}}>
          <h1 className="text-5xl font-bold text-gray-900 mb-6" style={{fontSize: 'clamp(2.5rem, 6vw, 3rem)', fontWeight: '900', color: '#111827', marginBottom: '1.5rem'}}>
            Governing Body
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{fontSize: '1.25rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto'}}>
            Meet the dedicated leaders who guide our association towards excellence and innovation.
          </p>
        </div>
      </div>

      {/* Members Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem 6rem'}}>
        {members.length === 0 ? (
          <div className="text-center py-12" style={{textAlign: 'center', padding: '3rem 0'}}>
            <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
              No governing body members found. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {members.map((member) => (
              <div key={member.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2rem', transition: 'all 0.3s ease'}}>
                <div className="text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6" style={{margin: '0 auto', width: '6rem', height: '6rem', background: 'linear-gradient(90deg, #2563eb, #9333ea)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full rounded-full object-cover" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      <span className="text-2xl font-bold text-white" style={{fontSize: '1.5rem', fontWeight: '700', color: 'white'}}>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
                    {member.name}
                  </h3>
                  
                  <p className="text-blue-600 font-semibold mb-4" style={{color: '#2563eb', fontWeight: '600', marginBottom: '1rem'}}>
                    {member.position}
                  </p>
                  
                  {/* Contact Details */}
                  <div className="space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center" style={{fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center'}}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center" style={{fontSize: '0.875rem', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center'}}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 