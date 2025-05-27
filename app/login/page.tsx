'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', padding: '3rem 1rem'}}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden" style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', top: '25%', left: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #60a5fa, #a855f7)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-20" style={{position: 'absolute', bottom: '25%', right: '25%', width: '18rem', height: '18rem', background: 'linear-gradient(90deg, #c084fc, #f472b6)', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.2}}></div>
      </div>
      
      <div className="relative max-w-md w-full space-y-8" style={{position: 'relative', maxWidth: '28rem', width: '100%'}}>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2rem'}}>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6" style={{margin: '0 auto', width: '4rem', height: '4rem', background: 'linear-gradient(90deg, #2563eb, #9333ea)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: 'white'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2" style={{fontSize: '1.875rem', fontWeight: '700', background: 'linear-gradient(90deg, #111827, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem'}}>
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8" style={{color: '#4b5563', marginBottom: '2rem'}}>
              Sign in to your account to continue
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
            <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm" style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem'}}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{width: '100%', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
            >
              Sign In
            </button>

            <div className="text-center pt-4" style={{textAlign: 'center', paddingTop: '1rem'}}>
              <p className="text-gray-600" style={{color: '#4b5563'}}>
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
                  style={{fontWeight: '600', color: '#2563eb', textDecoration: 'none', transition: 'color 0.2s ease'}}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 