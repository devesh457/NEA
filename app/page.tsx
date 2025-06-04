'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeadershipSection from '@/components/LeadershipSection';
import Navigation from '@/components/Navigation';
import BackgroundElements from '@/components/BackgroundElements';

interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  imageUrl?: string;
  isFeatured: boolean;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  images: EventImage[];
}

interface EventImage {
  id: string;
  imageUrl: string;
  caption?: string;
  order: number;
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  useEffect(() => {
    if (featuredEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % featuredEvents.length);
      }, 5000); // Change event every 5 seconds

      return () => clearInterval(interval);
    }
  }, [featuredEvents.length]);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        // Get featured events or the most recent ones if no featured events
        const featured = data.events.filter((event: Event) => event.isFeatured);
        const eventsToShow = featured.length > 0 ? featured : data.events.slice(0, 3);
        setFeaturedEvents(eventsToShow);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentEvent = featuredEvents[currentEventIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', position: 'relative'}}>
      {/* Background Elements */}
      <BackgroundElements />
      
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{position: 'relative', overflow: 'hidden'}}>
        {/* Enhanced Background with Indian Highway Construction Theme */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97316" fill-opacity="0.08"%3E%3Cpath d="M10 10h60v4H10zM10 20h60v4H10zM10 30h60v4H10zM10 40h60v4H10zM10 50h60v4H10zM10 60h60v4H10z"/%3E%3C/g%3E%3Cg fill="%232563eb" fill-opacity="0.06"%3E%3Cpath d="M20 0v80M30 0v80M40 0v80M50 0v80M60 0v80"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.08
          }}
        ></div>
        
        {/* Highway Construction Equipment Silhouettes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-10 w-16 h-8 bg-gradient-to-t from-orange-400/10 to-transparent rounded-t-lg animate-pulse" style={{animation: 'pulse 4s infinite'}}></div>
          <div className="absolute bottom-0 right-20 w-12 h-6 bg-gradient-to-t from-yellow-400/10 to-transparent rounded-t-lg animate-pulse" style={{animation: 'pulse 5s infinite 1s'}}></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(147, 51, 234, 0.1))'}}></div>
        
        {/* Subtle Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-400/8 rounded-full blur-xl" style={{position: 'absolute', top: '5rem', left: '2.5rem', width: '4rem', height: '4rem', backgroundColor: 'rgba(96, 165, 250, 0.08)', borderRadius: '50%', filter: 'blur(20px)', animation: 'gentlePulse 12s ease-in-out infinite'}}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-orange-400/8 rounded-lg blur-xl" style={{position: 'absolute', top: '10rem', right: '5rem', width: '3rem', height: '3rem', backgroundColor: 'rgba(251, 146, 60, 0.08)', borderRadius: '0.5rem', filter: 'blur(20px)', animation: 'gentlePulse 15s ease-in-out infinite 5s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-green-400/8 rounded-full blur-lg" style={{position: 'absolute', bottom: '5rem', left: '25%', width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(34, 197, 94, 0.08)', borderRadius: '50%', filter: 'blur(16px)', animation: 'gentlePulse 18s ease-in-out infinite 8s'}}></div>
        
        {/* Main Gradient Orb */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-10" style={{position: 'absolute', top: '-4rem', left: '50%', transform: 'translateX(-50%)', width: '20rem', height: '20rem', background: 'linear-gradient(90deg, #60a5fa, #a855f7)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.1, animation: 'gentlePulse 20s ease-in-out infinite'}}></div>
        
        {/* Subtle Highway Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main Highway Lane */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent transform -translate-y-1/2" style={{position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.15), transparent)', transform: 'translateY(-50%)', animation: 'gentlePulse 10s ease-in-out infinite'}}></div>
          
          {/* Side Lanes */}
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/10 to-transparent" style={{position: 'absolute', top: '33%', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.1), transparent)', animation: 'gentlePulse 12s ease-in-out infinite 4s'}}></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/10 to-transparent" style={{position: 'absolute', top: '67%', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)', animation: 'gentlePulse 14s ease-in-out infinite 8s'}}></div>
        </div>
        
        <div className="relative max-w-full mx-auto py-24 px-8 sm:py-32 sm:px-12 lg:px-16 xl:px-20" style={{position: 'relative', maxWidth: '100%', margin: '0 auto', padding: '6rem 2rem'}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem', alignItems: 'center', maxWidth: '80rem', margin: '0 auto'}}>
            
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left" style={{textAlign: 'center'}}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 animate-fade-in" style={{fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: '900', color: '#111827', marginBottom: '1.5rem', lineHeight: '1.1', animation: 'fadeIn 1s ease-out'}}>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg" style={{background: 'linear-gradient(90deg, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}>
                  NHAI-Engineers Association
                </span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed animate-slide-up mb-8" style={{marginTop: '1.5rem', fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', color: '#4b5563', lineHeight: '1.75', animation: 'slideUp 1s ease-out 0.3s both', marginBottom: '2rem'}}>
                Building India's Highway Future — Connecting Dreams, Constructing Progress, Engineering Excellence Across Every Mile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-slide-up" style={{display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', animation: 'slideUp 1s ease-out 0.6s both'}}>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                  style={{display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', fontWeight: '600', borderRadius: '9999px', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'}}
                >
                  Join Now
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all duration-300"
                  style={{display: 'inline-flex', alignItems: 'center', padding: '1rem 2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', color: '#374151', fontWeight: '600', borderRadius: '9999px', border: '2px solid #e5e7eb', textDecoration: 'none', transition: 'all 0.3s ease'}}
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Column - Dynamic Events Gallery Showcase */}
            <div className="relative animate-slide-up" style={{position: 'relative', animation: 'slideUp 1s ease-out 0.9s both'}}>
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '1.5rem', position: 'relative', overflow: 'hidden'}}>
                
                {/* Header */}
                <div className="text-center mb-6" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
                    Events Gallery
                  </h3>
                  <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>
                    {featuredEvents.length > 0 ? 'Community Events, Conferences & Professional Gatherings' : 'Stay tuned for upcoming events'}
                  </p>
                </div>

                {/* Main Events Image Area - Now Dynamic */}
                <Link
                  href="/events"
                  className="block relative h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500"
                  style={{display: 'block', position: 'relative', height: '20rem', background: 'linear-gradient(135deg, #3b82f6, #9333ea)', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.5s ease', textDecoration: 'none'}}
                >
                  
                  {/* Dynamic Background Image */}
                  {currentEvent?.imageUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                      style={{
                        backgroundImage: `url(${currentEvent.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  )}
                  
                  {/* Image Placeholder Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease'}}></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4 z-10" style={{position: 'absolute', top: '1rem', right: '1rem', zIndex: 10}}>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full" style={{padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)', color: 'white', fontSize: '0.875rem', fontWeight: '500', borderRadius: '9999px'}}>
                      {currentEvent?.isFeatured ? 'Featured Event' : 'Latest Event'}
                    </span>
                  </div>

                  {/* Event Content or Placeholder */}
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center z-5">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : currentEvent ? (
                    <>
                      {/* Event Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10" style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)', padding: '1.5rem', zIndex: 10}}>
                        <div className="flex items-center justify-between text-white" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white'}}>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1 truncate" style={{fontWeight: '700', fontSize: '1.125rem', marginBottom: '0.25rem'}}>{currentEvent.title}</h4>
                            <p className="text-sm opacity-90 mb-2" style={{fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem'}}>{formatDate(currentEvent.eventDate)}</p>
                            {currentEvent.location && (
                              <p className="text-xs opacity-75" style={{fontSize: '0.75rem', opacity: 0.75}}>{currentEvent.location}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            {featuredEvents.length > 1 && (
                              <div className="flex space-x-1" style={{display: 'flex', gap: '0.25rem'}}>
                                {featuredEvents.map((_, index) => (
                                  <div 
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      index === currentEventIndex ? 'bg-white' : 'bg-white/50'
                                    }`} 
                                    style={{width: '0.5rem', height: '0.5rem', borderRadius: '50%', transition: 'all 0.3s ease'}}
                                  />
                                ))}
                              </div>
                            )}
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.25rem', height: '1.25rem', transition: 'transform 0.3s ease'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-5" style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5}}>
                      <div className="text-center text-white" style={{textAlign: 'center', color: 'white'}}>
                        <svg className="w-20 h-20 mx-auto mb-4 opacity-60 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '5rem', height: '5rem', margin: '0 auto', marginBottom: '1rem', opacity: 0.6, transition: 'opacity 0.3s ease'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xl font-semibold mb-2 group-hover:scale-105 transition-transform" style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', transition: 'transform 0.3s ease'}}>No Events Yet</p>
                        <p className="text-sm opacity-80" style={{fontSize: '0.875rem', opacity: 0.8}}>Click to explore events</p>
                      </div>
                    </div>
                  )}

                  {/* Event Elements */}
                  <div className="absolute top-6 left-6 flex space-x-2 z-5" style={{position: 'absolute', top: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.5rem', zIndex: 5}}>
                    <div className="w-3 h-3 bg-orange-400/60 rounded-full animate-pulse" style={{width: '0.75rem', height: '0.75rem', backgroundColor: 'rgba(251, 146, 60, 0.6)', borderRadius: '50%', animation: 'pulse 3s infinite'}}></div>
                    <div className="w-3 h-3 bg-yellow-400/60 rounded-full animate-pulse" style={{width: '0.75rem', height: '0.75rem', backgroundColor: 'rgba(251, 191, 36, 0.6)', borderRadius: '50%', animation: 'pulse 3s infinite 1s'}}></div>
                    <div className="w-3 h-3 bg-green-400/60 rounded-full animate-pulse" style={{width: '0.75rem', height: '0.75rem', backgroundColor: 'rgba(74, 222, 128, 0.6)', borderRadius: '50%', animation: 'pulse 3s infinite 2s'}}></div>
                  </div>
                </Link>

                {/* View More Events Link */}
                <div className="text-center mt-6" style={{textAlign: 'center', marginTop: '1.5rem'}}>
                  <Link 
                    href="/events"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-purple-600 transition-colors group"
                    style={{display: 'inline-flex', alignItems: 'center', color: '#2563eb', fontWeight: '600', transition: 'color 0.3s ease', textDecoration: 'none'}}
                  >
                    {featuredEvents.length > 0 ? `View All ${featuredEvents.length} Events` : 'Explore Events'}
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '0.5rem', width: '1rem', height: '1rem', transition: 'transform 0.3s ease'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-24 bg-white/95 backdrop-blur-sm relative overflow-hidden" style={{padding: '6rem 0', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(4px)', position: 'relative', overflow: 'hidden'}}>
        {/* Section Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)'}}></div>
        
        <div className="max-w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10" style={{maxWidth: '100%', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10}}>
          <div className="text-center mb-16 animate-slide-up" style={{textAlign: 'center', marginBottom: '4rem', animation: 'slideUp 1s ease-out'}}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 gradient-text" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{fontSize: '1.25rem', color: '#4b5563', maxWidth: '42rem', margin: '0 auto'}}>
              Advancing highway construction excellence and infrastructure development across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-7xl mx-auto" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', maxWidth: '80rem', margin: '0 auto'}}>
            {/* Mission */}
            <div className="group bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2 hover-lift relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fff7ed, #fffbeb)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #fed7aa', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6" style={{width: '4rem', height: '4rem', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>Our Mission</h3>
              <p className="text-gray-700 leading-relaxed text-lg" style={{color: '#374151', lineHeight: '1.75', fontSize: '1.125rem'}}>
                To advance highway construction excellence in India by fostering professional development, promoting innovative construction techniques, and creating a collaborative network of engineers dedicated to building world-class infrastructure that connects communities and drives economic growth.
              </p>
            </div>
            
            {/* Vision */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 hover-lift relative overflow-hidden" style={{background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', border: '1px solid #e9d5ff', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'}}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6" style={{width: '4rem', height: '4rem', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem'}}>Our Vision</h3>
              <p className="text-gray-700 leading-relaxed text-lg" style={{color: '#374151', lineHeight: '1.75', fontSize: '1.125rem'}}>
                To be India's premier highway construction engineering association, leading the transformation of transportation infrastructure through cutting-edge technology, sustainable practices, and skilled professionals who build the roads that unite our nation and fuel its progress.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-16" style={{marginTop: '4rem'}}>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '2rem'}}>
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '72rem', margin: '0 auto'}}>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover-lift group transition-all duration-300 hover:shadow-xl" style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', borderRadius: '0.75rem', border: '1px solid #dcfce7', transition: 'all 0.3s ease'}}>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '3rem', height: '3rem', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: '1rem'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem', color: 'white'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>Quality Construction</h4>
                <p className="text-gray-600" style={{color: '#4b5563'}}>Building highways that meet international standards and last for generations</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover-lift group transition-all duration-300 hover:shadow-xl" style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #fff7ed, #fffbeb)', borderRadius: '0.75rem', border: '1px solid #fed7aa', transition: 'all 0.3s ease'}}>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '3rem', height: '3rem', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: '1rem'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem', color: 'white'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>Safety First</h4>
                <p className="text-gray-600" style={{color: '#4b5563'}}>Prioritizing worker safety and public welfare in every construction project</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 hover-lift group transition-all duration-300 hover:shadow-xl" style={{textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(135deg, #ecfeff, #eff6ff)', borderRadius: '0.75rem', border: '1px solid #a5f3fc', transition: 'all 0.3s ease'}}>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '3rem', height: '3rem', background: 'linear-gradient(90deg, #06b6d4, #0891b2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: '1rem'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1.5rem', height: '1.5rem', color: 'white'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>Sustainable Development</h4>
                <p className="text-gray-600" style={{color: '#4b5563'}}>Creating eco-friendly infrastructure that harmonizes with the environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <LeadershipSection />
    </div>
  );
} 
