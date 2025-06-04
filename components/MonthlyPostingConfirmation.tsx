'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface MonthlyPostingConfirmationProps {
  currentPosting: string;
  onComplete: () => void;
}

export default function MonthlyPostingConfirmation({ 
  currentPosting, 
  onComplete 
}: MonthlyPostingConfirmationProps) {
  const { data: session, update } = useSession();
  const [posting, setPosting] = useState(currentPosting || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!posting.trim()) {
      setMessage('Please enter your current place of posting.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/confirm-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posting: posting.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.postingChanged) {
          setMessage('Posting confirmed successfully! Your previous posting has been moved to "Last Place of Posting".');
        } else {
          setMessage('Posting confirmed successfully!');
        }
        
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            posting: posting.trim(),
            lastPostingConfirmedAt: new Date().toISOString()
          }
        });
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        setMessage(data.error || 'Failed to confirm posting');
      }
    } catch (error) {
      setMessage('An error occurred while confirming posting');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Just confirm current posting without changes
    handleSubmit(new Event('submit') as any);
  };

  const currentMonth = new Date().toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Monthly Posting Confirmation
          </h2>
          <p className="text-gray-600">
            Welcome to {currentMonth}! Please confirm your current place of posting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="posting" className="block text-sm font-medium text-gray-700 mb-2">
              Current Place of Posting
            </label>
            <input
              type="text"
              id="posting"
              value={posting}
              onChange={(e) => setPosting(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your current place of posting"
            />
            <p className="text-xs text-gray-500 mt-1">
              Update this if your posting has changed since last month
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming...' : 'Confirm Posting'}
            </button>
            
            {posting === currentPosting && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No Changes
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This confirmation helps us keep your posting information up to date
          </p>
        </div>
      </div>
    </div>
  );
} 