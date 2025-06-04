'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FirstTimeLoginForm from './FirstTimeLoginForm';
import MonthlyPostingConfirmation from './MonthlyPostingConfirmation';

interface ProfileWrapperProps {
  children: React.ReactNode;
}

interface ProfileStatus {
  needsProfileCompletion: boolean;
  needsMonthlyConfirmation: boolean;
  currentPosting: string;
}

export default function ProfileWrapper({ children }: ProfileWrapperProps) {
  const { data: session, status } = useSession();
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const response = await fetch('/api/profile/status');
        if (response.ok) {
          const data = await response.json();
          setProfileStatus(data);
        }
      } catch (error) {
        // Silent error handling for production
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      checkProfileStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleProfileComplete = () => {
    setProfileStatus(prev => prev ? {
      ...prev,
      needsProfileCompletion: false
    } : null);
  };

  const handleMonthlyConfirmationComplete = () => {
    setProfileStatus(prev => prev ? {
      ...prev,
      needsMonthlyConfirmation: false
    } : null);
  };

  // Show loading while checking status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show first-time login form if profile is incomplete
  if (profileStatus?.needsProfileCompletion) {
    return <FirstTimeLoginForm onComplete={handleProfileComplete} />;
  }

  // Show monthly posting confirmation if needed
  if (profileStatus?.needsMonthlyConfirmation) {
    return (
      <>
        {children}
        <MonthlyPostingConfirmation 
          currentPosting={profileStatus.currentPosting}
          onComplete={handleMonthlyConfirmationComplete}
        />
      </>
    );
  }

  // Show normal content
  return <>{children}</>;
} 