'use client';

import { useEffect, useState } from 'react';

export default function BackgroundElements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Gentle Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-2xl animate-float-slow" style={{animation: 'floatSlow 20s ease-in-out infinite'}}></div>
      <div className="absolute top-60 right-32 w-24 h-24 bg-gradient-to-r from-orange-400/5 to-yellow-400/5 rounded-full blur-2xl animate-float-slow" style={{animation: 'floatSlow 25s ease-in-out infinite 5s'}}></div>
      <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400/5 to-blue-400/5 rounded-full blur-2xl animate-float-slow" style={{animation: 'floatSlow 30s ease-in-out infinite 10s'}}></div>
      
      {/* Minimal Highway Construction Icons */}
      <div className="absolute top-32 right-20 opacity-5 animate-float-gentle" style={{animation: 'floatGentle 15s ease-in-out infinite'}}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-orange-500">
          <path d="M2 20h20M4 20v-4a2 2 0 012-2h12a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      
      <div className="absolute bottom-32 right-1/4 opacity-5 animate-float-gentle" style={{animation: 'floatGentle 18s ease-in-out infinite 7s'}}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" className="text-blue-500">
          <rect x="4" y="6" width="16" height="8" rx="2" fill="currentColor" opacity="0.3"/>
          <path d="M12 14v6" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>
      
      {/* Subtle Highway Lines */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -translate-y-1/2"
          style={{animation: 'gentlePulse 8s ease-in-out infinite'}}
        />
        <div 
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/8 to-transparent"
          style={{animation: 'gentlePulse 10s ease-in-out infinite 3s'}}
        />
        <div 
          className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/8 to-transparent"
          style={{animation: 'gentlePulse 12s ease-in-out infinite 6s'}}
        />
      </div>
      
      {/* Minimal Geometric Accents */}
      <div className="absolute top-10 left-10 w-1 h-16 bg-gradient-to-b from-orange-400/10 via-white/5 to-green-400/10 rounded-full" style={{animation: 'gentlePulse 15s ease-in-out infinite'}}></div>
      <div className="absolute bottom-10 right-10 w-1 h-16 bg-gradient-to-b from-blue-400/10 via-white/5 to-purple-400/10 rounded-full" style={{animation: 'gentlePulse 18s ease-in-out infinite 8s'}}></div>
      
      {/* Very Subtle Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animation: `subtleFloat ${20 + Math.random() * 20}s linear infinite ${Math.random() * 10}s`
          }}
        />
      ))}
      
      {/* CSS for gentle animations */}
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-15px) translateX(3px);
          }
        }
        
        @keyframes floatGentle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-8px) scale(1.02);
            opacity: 0.08;
          }
        }
        
        @keyframes gentlePulse {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
        }
        
        @keyframes subtleFloat {
          0% {
            transform: translateY(0px);
            opacity: 0;
          }
          10%, 90% {
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 