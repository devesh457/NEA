'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building,
  UserCheck,
  UserX,
  Lock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  designation?: string;
  posting?: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

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
  user: {
    name: string;
    email: string;
    phone?: string;
  };
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
  isActive: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user is admin and redirect non-admins to dashboard
    const checkAdminRole = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const user = await response.json();
          if (user.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
          }
          // User is admin, fetch data
          fetchData();
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/dashboard');
      }
    };

    checkAdminRole();
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [usersRes, bookingsRes, availabilityRes] = await Promise.all([
        fetch('/api/admin/users?status=pending'),
        fetch('/api/admin/bookings'), // Fetch all bookings, not just pending
        fetch('/api/admin/availability')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }

      if (availabilityRes.ok) {
        const availabilityData = await availabilityRes.json();
        setAvailability(availabilityData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        // Refresh users list
        const usersRes = await fetch('/api/admin/users?status=pending');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'APPROVED' | 'REJECTED', rejectedReason?: string, totalAmount?: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, action, rejectedReason, totalAmount }),
      });

      if (response.ok) {
        // Refresh bookings list
        const bookingsRes = await fetch('/api/admin/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
        // Close modal if it was open
        setShowRejectModal(false);
        setSelectedBookingId(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (selectedBookingId && rejectionReason.trim()) {
      handleBookingAction(selectedBookingId, 'REJECTED', rejectionReason.trim());
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingUsers = users.filter(user => !user.isApproved);
  const pendingBookings = bookings.filter(booking => booking.status === 'PENDING');
  const approvedBookings = bookings.filter(booking => booking.status === 'APPROVED');
  const rejectedBookings = bookings.filter(booking => booking.status === 'REJECTED');
  
  // Filter bookings based on selected filter
  const filteredBookings = bookingFilter === 'all' ? bookings : 
                          bookingFilter === 'pending' ? pendingBookings :
                          bookingFilter === 'approved' ? approvedBookings :
                          rejectedBookings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NEA Admin
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('change-password')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Change Password
              </button>
              <span className="text-gray-600 text-sm">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-600 px-4 py-2 rounded-full font-medium transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, user approvals, and availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Users</p>
                <p className="text-3xl font-bold text-orange-600">{pendingUsers.length}</p>
              </div>
              <UserCheck className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{pendingBookings.length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Bookings</p>
                <p className="text-3xl font-bold text-green-600">{approvedBookings.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guest Houses</p>
                <p className="text-3xl font-bold text-purple-600">{availability.length}</p>
              </div>
              <Building className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'bookings', label: 'Booking Requests', icon: Calendar },
                { id: 'users', label: 'User Approvals', icon: Users },
                { id: 'availability', label: 'Availability', icon: Settings },
                { id: 'change-password', label: 'Change Password', icon: Lock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Booking Management</h3>
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Bookings ({bookings.length})</option>
                    <option value="pending">Pending ({pendingBookings.length})</option>
                    <option value="approved">Approved ({approvedBookings.length})</option>
                    <option value="rejected">Rejected ({rejectedBookings.length})</option>
                  </select>
                </div>
                {filteredBookings.length === 0 ? (
                  <p className="text-gray-500">No {bookingFilter === 'all' ? '' : bookingFilter + ' '}bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-800">{booking.guestHouse}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{booking.location}</p>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Guest:</span> {booking.user.name}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {booking.user.phone || 'Not provided'}
                              </div>
                              <div>
                                <span className="font-medium">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Guests:</span> {booking.guests}
                              </div>
                              <div>
                                <span className="font-medium">Room Type:</span> {booking.roomType}
                              </div>
                              <div>
                                <span className="font-medium">Purpose:</span> {booking.purpose}
                              </div>
                              <div>
                                <span className="font-medium">Requested:</span> {new Date(booking.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {booking.specialRequests && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm font-medium text-blue-800">Special Requests:</p>
                                <p className="text-sm text-blue-700">{booking.specialRequests}</p>
                              </div>
                            )}
                            {booking.status === 'REJECTED' && booking.rejectedReason && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                                <p className="text-sm text-red-700">{booking.rejectedReason}</p>
                              </div>
                            )}
                            {booking.status === 'APPROVED' && booking.totalAmount && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm font-medium text-green-800">Total Amount: ₹{booking.totalAmount}</p>
                              </div>
                            )}
                          </div>
                          {booking.status === 'PENDING' && (
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleBookingAction(booking.id, 'APPROVED')}
                                disabled={actionLoading === booking.id}
                                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectClick(booking.id)}
                                disabled={actionLoading === booking.id}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Pending User Approvals</h3>
                {pendingUsers.length === 0 ? (
                  <p className="text-gray-500">No pending user approvals</p>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Phone:</span> {user.phone || 'Not provided'}
                              </div>
                              <div>
                                <span className="font-medium">Designation:</span> {user.designation || 'Not provided'}
                              </div>
                              <div>
                                <span className="font-medium">Posting:</span> {user.posting || 'Not provided'}
                              </div>
                              <div>
                                <span className="font-medium">Registered:</span> {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleUserAction(user.id, 'approve')}
                              disabled={actionLoading === user.id}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'reject')}
                              disabled={actionLoading === user.id}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                              <UserX className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Guest House Availability</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availability.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{item.guestHouse}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                      <div className="space-y-1 text-sm">
                        <div><span className="font-medium">Room Type:</span> {item.roomType}</div>
                        <div><span className="font-medium">Available:</span> {item.availableRooms}/{item.totalRooms}</div>
                        <div><span className="font-medium">Price:</span> ₹{item.pricePerNight}/night</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'change-password' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
                <div className="max-w-md">
                  <ChangePasswordForm />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Booking</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this booking request:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBookingId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || actionLoading === selectedBookingId}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {actionLoading === selectedBookingId ? 'Rejecting...' : 'Reject Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Change Password Component
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength={6}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>
  );
} 