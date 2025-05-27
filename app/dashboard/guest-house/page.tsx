'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  guestHouse: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  purpose: string;
  specialRequests?: string;
  status: string;
  totalAmount?: number;
  rejectedReason?: string;
  createdAt: string;
}

interface Availability {
  id: string;
  guestHouse: string;
  location: string;
  roomType: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  amenities?: string;
}

export default function GuestHouseBookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    guestHouse: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    purpose: '',
    specialRequests: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchBookings();
      fetchAvailability();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/guest-house-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch('/api/availability');
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get location from availability data
      const selectedAvailability = availability.find(item => 
        item.guestHouse === formData.guestHouse && item.roomType === formData.roomType
      );
      
      const bookingData = {
        ...formData,
        location: selectedAvailability?.location || ''
      };

      const response = await fetch('/api/guest-house-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking request submitted successfully!');
        setFormData({
          guestHouse: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          roomType: '',
          purpose: '',
          specialRequests: ''
        });
        setShowForm(false);
        fetchBookings();
        fetchAvailability(); // Refresh availability after booking
      } else {
        setMessage(data.error || 'Failed to submit booking');
      }
    } catch (error) {
      setMessage('An error occurred while submitting booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'guests' ? parseInt(value) : value
    });

    // Refresh availability when guest house changes
    if (name === 'guestHouse' && value) {
      fetchFilteredAvailability(value);
    }
  };

  const fetchFilteredAvailability = async (guestHouse?: string) => {
    try {
      const url = guestHouse ? `/api/availability?guestHouse=${encodeURIComponent(guestHouse)}` : '/api/availability';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error fetching filtered availability:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingBookingId(bookingId);
    try {
      const response = await fetch('/api/guest-house-bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, action: 'CANCEL' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking cancelled successfully!');
        fetchBookings();
        fetchAvailability(); // Refresh availability as room becomes available again
      } else {
        setMessage(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      setMessage('An error occurred while cancelling booking');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
              <span className="text-gray-900 font-medium" style={{color: '#111827', fontWeight: '500'}}>Guest House Booking</span>
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
        <div className="mb-8 flex justify-between items-center" style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{fontSize: '2.25rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem'}}>
              Guest House Booking
            </h1>
            <p className="text-gray-600 text-lg" style={{color: '#4b5563', fontSize: '1.125rem'}}>
              Book guest houses for your official and personal stays.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            style={{background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
          >
            {showForm ? 'Cancel' : 'New Booking'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`} style={{marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem'}}>
            {message}
          </div>
        )}

        {/* Availability Display */}
        {!showForm && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '2rem'}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem'}}>
              Available Guest Houses
            </h2>
            {availability.length === 0 ? (
              <p className="text-gray-500">No guest houses available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(availability.map(item => item.guestHouse))).map(guestHouse => {
                  const guestHouseRooms = availability.filter(item => item.guestHouse === guestHouse);
                  const totalAvailable = guestHouseRooms.reduce((sum, item) => sum + item.availableRooms, 0);
                  
                  return (
                    <div key={guestHouse} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{guestHouse}</h3>
                      <p className="text-sm text-gray-600 mb-4">{guestHouseRooms[0]?.location}</p>
                      <div className="space-y-2">
                        {guestHouseRooms.map(room => (
                          <div key={room.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{room.roomType}</span>
                            <div className="text-right">
                              <span className="text-green-600 font-medium">{room.availableRooms} available</span>
                              <br />
                              <span className="text-gray-500">₹{room.pricePerNight}/night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <span className="text-sm font-medium text-blue-600">
                          Total: {totalAvailable} rooms available
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Booking Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)', marginBottom: '2rem'}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem'}}>
              New Booking Request
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
              {/* Guest House */}
              <div>
                <label htmlFor="guestHouse" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Guest House *
                </label>
                <select
                  id="guestHouse"
                  name="guestHouse"
                  value={formData.guestHouse}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                >
                  <option value="">Select Guest House</option>
                  {Array.from(new Set(availability.map(item => item.guestHouse))).map(guestHouse => {
                    const availableRooms = availability
                      .filter(item => item.guestHouse === guestHouse)
                      .reduce((sum, item) => sum + item.availableRooms, 0);
                    return (
                      <option key={guestHouse} value={guestHouse}>
                        {guestHouse} ({availableRooms} rooms available)
                      </option>
                    );
                  })}
                </select>
              </div>



              {/* Check-in Date */}
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Check-in Date *
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Check-out Date *
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Room Type *
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                >
                  <option value="">Select Room Type</option>
                  {formData.guestHouse ? (
                    availability
                      .filter(item => item.guestHouse === formData.guestHouse && item.availableRooms > 0)
                      .map(item => (
                        <option key={item.id} value={item.roomType}>
                          {item.roomType} - ₹{item.pricePerNight}/night ({item.availableRooms} available)
                        </option>
                      ))
                  ) : (
                    // Show all unique room types from availability data
                    Array.from(new Set(availability.map(item => item.roomType)))
                      .filter(roomType => availability.some(item => item.roomType === roomType && item.availableRooms > 0))
                      .map(roomType => (
                        <option key={roomType} value={roomType}>
                          {roomType}
                        </option>
                      ))
                  )}
                </select>
                {formData.guestHouse && availability.filter(item => item.guestHouse === formData.guestHouse).length === 0 && (
                  <p className="text-sm text-red-600 mt-1">No rooms available at this guest house</p>
                )}
              </div>

              {/* Purpose */}
              <div className="md:col-span-2">
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Purpose of Visit *
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease'}}
                >
                  <option value="">Select Purpose</option>
                  <option value="Official">Official Work</option>
                  <option value="Conference">Conference/Meeting</option>
                  <option value="Training">Training Program</option>
                  <option value="Personal">Personal</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Special Requests */}
              <div className="md:col-span-2">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Any special requirements or requests..."
                  style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', fontSize: '1rem', transition: 'all 0.2s ease', resize: 'vertical'}}
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{width: '100%', background: 'linear-gradient(90deg, #2563eb, #9333ea)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: '500', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
                >
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bookings List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/20" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '1.5rem'}}>
            Your Bookings ({bookings.length})
          </h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12" style={{textAlign: 'center', padding: '3rem 0'}}>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '4rem', height: '4rem', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'}}>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '2rem', height: '2rem', color: '#9ca3af'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg" style={{color: '#6b7280', fontSize: '1.125rem'}}>No bookings found</p>
              <p className="text-gray-400 mt-2" style={{color: '#9ca3af', marginTop: '0.5rem'}}>Create your first booking to get started</p>
            </div>
          ) : (
            <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200" style={{border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', transition: 'all 0.2s ease'}}>
                  <div className="flex justify-between items-start mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900" style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827'}}>{booking.guestHouse}</h3>
                      <p className="text-gray-600" style={{color: '#4b5563'}}>{booking.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`} style={{padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500'}}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem'}}>
                    <div>
                      <span className="text-gray-500" style={{color: '#6b7280'}}>Check-in:</span>
                      <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#111827'}}>{formatDate(booking.checkIn)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500" style={{color: '#6b7280'}}>Check-out:</span>
                      <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#111827'}}>{formatDate(booking.checkOut)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500" style={{color: '#6b7280'}}>Guests:</span>
                      <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#111827'}}>{booking.guests}</p>
                    </div>
                    <div>
                      <span className="text-gray-500" style={{color: '#6b7280'}}>Room:</span>
                      <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#111827'}}>{booking.roomType}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200" style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb'}}>
                    <div className="flex justify-between items-center" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <span className="text-gray-500 text-sm" style={{color: '#6b7280', fontSize: '0.875rem'}}>Purpose:</span>
                        <span className="ml-2 text-gray-900 font-medium" style={{marginLeft: '0.5rem', color: '#111827', fontWeight: '500'}}>{booking.purpose}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingBookingId === booking.id}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{padding: '0.25rem 0.75rem', backgroundColor: '#dc2626', color: 'white', fontSize: '0.875rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease'}}
                          >
                            {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                        <div className="text-gray-500 text-sm" style={{color: '#6b7280', fontSize: '0.875rem'}}>
                          Booked on {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                    {booking.status === 'REJECTED' && booking.rejectedReason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md" style={{marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem'}}>
                        <p className="text-sm font-medium text-red-800" style={{fontSize: '0.875rem', fontWeight: '500', color: '#991b1b'}}>Rejection Reason:</p>
                        <p className="text-sm text-red-700 mt-1" style={{fontSize: '0.875rem', color: '#b91c1c', marginTop: '0.25rem'}}>{booking.rejectedReason}</p>
                      </div>
                    )}
                    {booking.status === 'APPROVED' && booking.totalAmount && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md" style={{marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem'}}>
                        <p className="text-sm font-medium text-green-800" style={{fontSize: '0.875rem', fontWeight: '500', color: '#166534'}}>Total Amount: ₹{booking.totalAmount}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 