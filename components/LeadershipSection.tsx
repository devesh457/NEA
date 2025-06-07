'use client';

import { useState, useEffect } from 'react';
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

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<GoverningBodyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/governing-body');
        
        if (response.ok) {
          const data = await response.json();
          
          // Filter for leadership positions (President, Vice President, Secretary, Treasurer)
          const leadership = data.filter((member: any) => 
            ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(member.position)
          );
          
          setLeaders(leadership);
        }
      } catch (error) {
        // Silent error handling for production
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50" style={{padding: '6rem 0', background: 'linear-gradient(90deg, #eff6ff, #faf5ff)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center'}}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" style={{animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', borderBottom: '2px solid #2563eb', margin: '0 auto'}}></div>
          <p className="mt-4 text-gray-600" style={{marginTop: '1rem', color: '#4b5563'}}>Loading leadership...</p>
        </div>
      </div>
    );
  }

  if (leaders.length === 0 && !loading) {
    return (
      <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50" style={{padding: '6rem 0', background: 'linear-gradient(90deg, #eff6ff, #faf5ff)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center'}}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>
            Our Leadership
          </h2>
          <p className="text-xl text-gray-600" style={{fontSize: '1.25rem', color: '#4b5563'}}>
            Leadership information will be available soon.
          </p>
          <div className="text-center mt-12" style={{textAlign: 'center', marginTop: '3rem'}}>
            <Link
              href="/governing-body"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', fontWeight: '600', borderRadius: '9999px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'}}
            >
              View Full Governing Body
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-r from-blue-50 to-purple-50" style={{padding: '6rem 0', background: 'linear-gradient(90deg, #eff6ff, #faf5ff)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
        <div className="text-center mb-16" style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>
            Our Leadership
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{fontSize: '1.25rem', color: '#4b5563', maxWidth: '42rem', margin: '0 auto'}}>
            Meet the visionary leaders driving our association forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '72rem', margin: '0 auto'}}>
          {leaders.map((leader) => (
            <div key={leader.id} className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', transition: 'all 0.4s ease'}}>
              <div className="relative p-6 pb-4" style={{position: 'relative', padding: '1.5rem', paddingBottom: '1rem'}}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-bl-full opacity-50" style={{position: 'absolute', top: 0, right: 0, width: '6rem', height: '6rem', background: 'linear-gradient(to bottom left, rgba(219, 234, 254, 0.5), rgba(243, 232, 255, 0.5))', borderBottomLeftRadius: '100%', opacity: '0.5'}}></div>
                
                {/* Avatar with initials */}
                <div className="flex justify-center mb-5" style={{display: 'flex', justifyContent: 'center', marginBottom: '1.25rem'}}>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg" style={{width: '6rem', height: '6rem', borderRadius: '50%', background: 'linear-gradient(90deg, #2563eb, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'}}>
                      <span className="text-2xl font-bold text-white" style={{fontSize: '1.5rem', fontWeight: '700', color: 'white'}}>
                        {leader.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -inset-1 rounded-full border-2 border-white/30 opacity-70" style={{position: 'absolute', inset: '-0.25rem', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.3)', opacity: '0.7'}}></div>
                  </div>
                </div>
                
                {/* Name and Position */}
                <div className="text-center mb-4" style={{textAlign: 'center', marginBottom: '1rem'}}>
                  <h3 className="text-xl font-bold text-gray-900" style={{fontSize: '1.25rem', fontWeight: '700', color: '#111827'}}>
                    {leader.name}
                  </h3>
                  <div className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full" style={{display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.75rem', background: 'linear-gradient(90deg, #eff6ff, #faf5ff)', borderRadius: '9999px'}}>
                    <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontSize: '0.875rem', fontWeight: '600', background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                      {leader.position}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-t border-gray-100" style={{background: 'linear-gradient(90deg, #f9fafb, #f3f4f6)', padding: '1rem', borderTop: '1px solid #f3f4f6'}}>
                <div className="flex flex-col space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {leader.email && (
                    <a href={`mailto:${leader.email}`} className="flex items-center text-sm text-blue-600 hover:text-purple-600 transition-colors" style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s ease'}}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {leader.email}
                    </a>
                  )}
                  {leader.phone && (
                    <a href={`tel:${leader.phone}`} className="flex items-center text-sm text-blue-600 hover:text-purple-600 transition-colors" style={{display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s ease'}}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {leader.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12" style={{textAlign: 'center', marginTop: '3rem'}}>
          <Link
            href="/governing-body"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            style={{display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', fontWeight: '600', borderRadius: '9999px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'}}
          >
            View Full Governing Body
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}