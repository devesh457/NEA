'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Circular {
  id: string;
  title: string;
  content: string;
  fileUrl?: string;
  publishedAt: string;
}

export default function CircularsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const openPDFPopup = (url: string, title: string) => {
    const popup = window.open(
      url,
      'pdfViewer',
      'width=900,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    if (popup) {
      popup.document.title = title;
    } else {
      // Fallback if popup is blocked
      window.open(url, '_blank');
    }
  };

  const downloadPDF = async (url: string, filename: string) => {
    try {
      // Use our server-side proxy to download the PDF
      const downloadUrl = `/api/download-pdf?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchCirculars();
    }
  }, [session]);

  const fetchCirculars = async () => {
    try {
      const response = await fetch('/api/circulars');
      if (response.ok) {
        const data = await response.json();
        setCirculars(data);
      }
    } catch (error) {
      console.error('Error fetching circulars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCirculars = circulars.filter(circular =>
    circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circular.content.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="text-gray-900 font-medium" style={{color: '#111827', fontWeight: '500'}}>Circulars</span>
            </div>
            <div className="flex items-center space-x-4" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Welcome, {session.user?.name}</span>
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
            Circulars
          </h1>
          <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
            Stay updated with the latest announcements and circulars from NEA.
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
                placeholder="Search circulars by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
              />
            </div>
          </div>
        </div>

        {/* Circulars List */}
        {loading ? (
          <div className="flex justify-center items-center py-12" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0'}}>
            <div className="text-gray-600" style={{color: '#4b5563'}}>Loading circulars...</div>
          </div>
        ) : filteredCirculars.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '4rem', height: '4rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto'}}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: 'white'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
              {searchTerm ? 'No Circulars Found' : 'No Circulars Available'}
            </h3>
            <p className="text-gray-600" style={{color: '#4b5563'}}>
              {searchTerm ? 'Try adjusting your search terms.' : 'There are currently no circulars published. Check back later for updates.'}
            </p>
          </div>
                  ) : (
          <>
            {/* Stats */}
            <div className="mb-6" style={{marginBottom: '1.5rem'}}>
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                <p className="text-gray-600" style={{color: '#4b5563'}}>
                  Showing {filteredCirculars.length} of {circulars.length} circulars
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            </div>

            <div className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {filteredCirculars.map((circular) => (
              <div key={circular.id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease'}}>
                <div className="flex items-start justify-between mb-4" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                      {circular.title}
                    </h3>
                    <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>
                      Published on {new Date(circular.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {circular.fileUrl && (
                    <div className="flex space-x-2" style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={() => openPDFPopup(circular.fileUrl!, circular.title)}
                        className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
                        style={{background: 'linear-gradient(90deg, #059669, #0d9488)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center'}}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View PDF
                      </button>
                      <button
                        onClick={() => downloadPDF(circular.fileUrl!, circular.title)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
                        style={{background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center'}}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <div className="prose prose-gray max-w-none" style={{color: '#374151', lineHeight: '1.75'}}>
                  <p>{circular.content}</p>
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