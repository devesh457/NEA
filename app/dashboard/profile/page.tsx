'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function UpdateProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designation: '',
    posting: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        phone: session.user.phone || '',
        designation: session.user.designation || '',
        posting: session.user.posting || '',
        imageUrl: session.user.imageUrl || ''
      });
      const properImageUrl = getImageUrl(session.user.imageUrl);
      setImagePreview(properImageUrl);
    }
  }, [session]);

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage('File size too large. Maximum size is 5MB.');
      return;
    }

    setImageUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        const properImageUrl = getImageUrl(data.imageUrl);
        const cacheBustedUrl = properImageUrl ? `${properImageUrl}?t=${Date.now()}` : null;
        setImagePreview(cacheBustedUrl);
        setMessage('Image uploaded successfully!');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setMessage('An error occurred while uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          designation: formData.designation,
          posting: formData.posting,
          imageUrl: formData.imageUrl
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.postingChanged) {
          setMessage('Profile updated successfully! Your previous posting has been moved to "Last Place of Posting".');
        } else {
          setMessage('Profile updated successfully!');
        }
        
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            phone: formData.phone,
            designation: formData.designation,
            posting: formData.posting,
            imageUrl: formData.imageUrl
          }
        });
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
              <span className="text-gray-900 font-medium" style={{color: '#111827', fontWeight: '500'}}>Update Profile</span>
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
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{position: 'relative', maxWidth: '56rem', margin: '0 auto', padding: '2rem 1rem'}}>
        {/* Header */}
        <div className="mb-8" style={{marginBottom: '2rem'}}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
            Update Profile
          </h1>
          <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
            Update your personal information and professional details.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
          <form onSubmit={handleSubmit} className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Profile Picture
              </label>
              <div className="flex items-center space-x-6" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                {/* Current Profile Picture */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center" style={{width: '6rem', height: '6rem', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(90deg, #2563eb, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <span className="text-2xl font-bold text-white" style={{fontSize: '1.5rem', fontWeight: '700', color: 'white'}}>
                      {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  )}
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    style={{border: '2px dashed #d1d5db', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', transition: 'border-color 0.2s ease', cursor: 'pointer'}}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imageUploading ? (
                      <div className="text-blue-600" style={{color: '#2563eb'}}>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" style={{animation: 'spin 1s linear infinite', borderRadius: '50%', height: '2rem', width: '2rem', borderBottom: '2px solid #2563eb', margin: '0 auto 0.5rem'}}></div>
                        <p>Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48" style={{margin: '0 auto', height: '3rem', width: '3rem', color: '#9ca3af', marginBottom: '1rem'}}>
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-gray-600 mb-2" style={{color: '#4b5563', marginBottom: '0.5rem'}}>
                          <span className="font-medium text-blue-600" style={{fontWeight: '500', color: '#2563eb'}}>Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500" style={{fontSize: '0.75rem', color: '#6b7280'}}>
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    style={{display: 'none'}}
                  />
                </div>
              </div>
            </div>

            {/* Name Field (Read-only) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'not-allowed'}}
              />
              <p className="text-xs text-gray-500 mt-1" style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem'}}>
                Name cannot be changed after registration
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Designation Field */}
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Designation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                placeholder="Enter your designation"
              />
            </div>

            {/* Posting Field */}
            <div>
              <label htmlFor="posting" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Current Place of Posting
              </label>
              <input
                type="text"
                id="posting"
                name="posting"
                value={formData.posting}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                placeholder="Enter your current place of posting"
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={session.user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'not-allowed'}}
              />
              <p className="text-xs text-gray-500 mt-1" style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem'}}>
                Email address cannot be changed
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`} style={{padding: '1rem', borderRadius: '0.75rem'}}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4" style={{display: 'flex', gap: '1rem'}}>
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{flex: 1, background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 text-center"
                style={{flex: 1, backgroundColor: '#e5e7eb', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '500', textDecoration: 'none', transition: 'all 0.2s ease', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 