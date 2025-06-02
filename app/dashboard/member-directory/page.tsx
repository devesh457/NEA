'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  posting?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function MemberDirectoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchMembers();
    }
  }, [session]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
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

  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.posting?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="text-gray-900 text-xl font-medium" style={{color: '#111827', fontSize: '1.25rem', fontWeight: '500'}}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)'}}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(229, 231, 235, 0.5)', position: 'sticky', top: 0, zIndex: 50}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
          <div className="flex justify-between items-center h-16" style={{display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center'}}>
            <div className="flex items-center space-x-4" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontSize: '1.75rem', fontWeight: '800', background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none'}}>
                NEA Website
              </Link>
              <span className="text-gray-400" style={{color: '#9ca3af'}}>/</span>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors" style={{color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s ease'}}>
                Dashboard
              </Link>
              <span className="text-gray-400" style={{color: '#9ca3af'}}>/</span>
              <span className="text-gray-900 font-medium" style={{color: '#111827', fontWeight: '500'}}>Member Directory</span>
            </div>
            <div className="flex items-center space-x-4" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div className="flex items-center space-x-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden" style={{width: '2rem', height: '2rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: '600', overflow: 'hidden'}}>
                  {session.user?.imageUrl ? (
                    <img src={session.user.imageUrl} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    session.user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Welcome, {session.user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', top: '25%', left: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #60a5fa, #a855f7)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', bottom: '25%', right: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #c084fc, #f472b6)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem'}}>
        {/* Header */}
        <div className="mb-8" style={{marginBottom: '2rem'}}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
            Member Directory
          </h1>
          <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
            Connect with fellow NEA members and expand your professional network.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6" style={{marginBottom: '1.5rem'}}>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none'}}>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{height: '1.25rem', width: '1.25rem', color: '#9ca3af'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search members by name, email, phone, designation, or posting..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
              />
            </div>
          </div>
        </div>

        {/* Members List */}
        {loading ? (
          <div className="flex justify-center items-center py-12" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0'}}>
            <div className="text-gray-600" style={{color: '#4b5563'}}>Loading members...</div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '4rem', height: '4rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: 'white'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
              {searchTerm ? 'No Members Found' : 'No Members Available'}
            </h3>
            <p className="text-gray-600" style={{color: '#4b5563'}}>
              {searchTerm ? 'Try adjusting your search terms.' : 'There are currently no members in the directory.'}
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6" style={{marginBottom: '1.5rem'}}>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                <p className="text-gray-600" style={{color: '#4b5563'}}>
                  Showing {filteredMembers.length} of {members.length} members
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:shadow-lg transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
                  <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden" style={{width: '3rem', height: '3rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name || 'Profile'} className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      ) : (
                        <span className="text-white font-semibold text-lg" style={{color: 'white', fontWeight: '600', fontSize: '1.125rem'}}>
                          {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="ml-4 flex-1" style={{marginLeft: '1rem', flex: 1}}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem'}}>
                        {member.name || 'Anonymous User'}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2" style={{color: '#4b5563', fontSize: '0.75rem', marginBottom: '0.5rem'}}>
                        Member since {new Date(member.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.875rem'}}>
                        <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                          <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '0.75rem', height: '0.75rem', color: '#9ca3af', marginRight: '0.25rem'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 truncate" style={{color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                            <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '0.75rem', height: '0.75rem', color: '#9ca3af', marginRight: '0.25rem'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-gray-700" style={{color: '#374151'}}>{member.phone}</span>
                          </div>
                        )}
                        {member.designation && (
                          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                            <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '0.75rem', height: '0.75rem', color: '#9ca3af', marginRight: '0.25rem'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                            </svg>
                            <span className="text-gray-700 truncate" style={{color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{member.designation}</span>
                          </div>
                        )}
                        {member.posting && (
                          <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                            <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '0.75rem', height: '0.75rem', color: '#9ca3af', marginRight: '0.25rem'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-700 truncate" style={{color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{member.posting}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 