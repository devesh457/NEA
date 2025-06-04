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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '56rem', margin: '0 auto'}}>
          {leaders.map((leader) => (
            <div key={leader.id} className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2rem', transition: 'all 0.5s ease'}}>
              <div className="text-center">
                <div className="relative mx-auto w-32 h-32 mb-6" style={{position: 'relative', margin: '0 auto', width: '8rem', height: '8rem', marginBottom: '1.5rem'}}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #2563eb, #9333ea)', borderRadius: '50%', animation: 'pulse 2s infinite'}}></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center" style={{position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #9333ea)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {leader.imageUrl ? (
                      <img src={leader.imageUrl} alt={leader.name} className="w-full h-full rounded-full object-cover" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                    ) : (
                      <span className="text-3xl font-bold text-white" style={{fontSize: '1.875rem', fontWeight: '700', color: 'white'}}>
                        {leader.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
                  {leader.name}
                </h3>
                
                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4" style={{fontSize: '1.125rem', fontWeight: '600', background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem'}}>
                  {leader.position}
                </p>
                
                {leader.bio && (
                  <p className="text-gray-600 leading-relaxed mb-6" style={{color: '#4b5563', lineHeight: '1.75', marginBottom: '1.5rem'}}>
                    {leader.bio.length > 150 ? `${leader.bio.substring(0, 150)}...` : leader.bio}
                  </p>
                )}
                
                <div className="flex flex-col space-y-2" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {leader.email && (
                    <a href={`mailto:${leader.email}`} className="text-blue-600 hover:text-purple-600 transition-colors font-medium" style={{color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: '500'}}>
                      {leader.email}
                    </a>
                  )}
                  {leader.phone && (
                    <a href={`tel:${leader.phone}`} className="text-blue-600 hover:text-purple-600 transition-colors font-medium" style={{color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: '500'}}>
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