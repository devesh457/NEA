'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  Lock,
  Home,
  CalendarDays,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Upload,
  Image
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

interface Member {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  designation: string | null;
  posting: string | null;
  imageUrl: string | null;
  role: string;
  isApproved: boolean;
  employeeId: string | null;
  dateOfJoining: string | null;
  dateOfBirth: string | null;
  bloodGroup: string | null;
  lastPlaceOfPosting: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  insuranceNomineeName: string | null;
  insuranceNomineePhone: string | null;
  insuranceNomineeRelation: string | null;
  isProfileComplete: boolean;
  lastPostingConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
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

interface GuestHouse {
  id: string;
  guestHouse: string;
  location: string;
  roomType: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  amenities: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  // Event management states
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Member management states
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Guest house management states
  const [showGuestHouseForm, setShowGuestHouseForm] = useState(false);
  const [editingGuestHouse, setEditingGuestHouse] = useState<GuestHouse | null>(null);

  const [message, setMessage] = useState('');

  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    imageUrl: '',
    isFeatured: false,
    isPublished: true
  });

  const [guestHouseFormData, setGuestHouseFormData] = useState({
    guestHouse: '',
    location: '',
    roomType: '',
    totalRooms: 1,
    pricePerNight: 0,
    amenities: ''
  });

  const roomTypes = ['Single', 'Double', 'Triple', 'Suite', 'Deluxe', 'Executive'];

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
      const [usersRes, membersRes, eventsRes, guestHousesRes, bookingsRes, availabilityRes] = await Promise.all([
        fetch('/api/admin/users?status=pending'),
        fetch('/api/admin/members'),
        fetch('/api/events'),
        fetch('/api/admin/guest-houses'),
        fetch('/api/admin/bookings'),
        fetch('/api/admin/availability')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events);
      }

      if (guestHousesRes.ok) {
        const guestHousesData = await guestHousesRes.json();
        setGuestHouses(guestHousesData.guestHouses);
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

  // User management handlers
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

  // Booking management handlers
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
        const bookingsRes = await fetch('/api/admin/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
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
      handleBookingAction(selectedBookingId, 'REJECTED', rejectionReason);
    }
  };

  // Event management handlers
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setMessage('File size too large. Maximum size is 10MB.');
      return;
    }

    setImageUploading(true);
    setMessage('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload/event-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setEventFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        setMessage('Image uploaded successfully!');
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

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = showEditEventModal && selectedEvent ? `/api/events/${selectedEvent.id}` : '/api/events';
      const method = showEditEventModal && selectedEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Event ${showEditEventModal ? 'updated' : 'created'} successfully!`);
        setShowCreateEventModal(false);
        setShowEditEventModal(false);
        setSelectedEvent(null);
        resetEventForm();
        fetchData();
      } else {
        setMessage(data.error || `Failed to ${showEditEventModal ? 'update' : 'create'} event`);
      }
    } catch (error) {
      setMessage(`An error occurred while ${showEditEventModal ? 'updating' : 'creating'} event`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description || '',
      eventDate: event.eventDate.split('T')[0],
      location: event.location || '',
      imageUrl: event.imageUrl || '',
      isFeatured: event.isFeatured,
      isPublished: event.isPublished
    });
    setShowEditEventModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Event deleted successfully!');
        setShowDeleteEventModal(false);
        setSelectedEvent(null);
        fetchData();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to delete event');
      }
    } catch (error) {
      setMessage('An error occurred while deleting event');
    } finally {
      setLoading(false);
    }
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      imageUrl: '',
      isFeatured: false,
      isPublished: true
    });
  };

  // Member management handlers
  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setMessage('User approved successfully');
        fetchData();
      } else {
        setMessage('Failed to approve user');
      }
    } catch (error) {
      setMessage('Error approving user');
    }
  };

  // Guest house management handlers
  const handleGuestHouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingGuestHouse 
        ? `/api/admin/guest-houses/${editingGuestHouse.id}`
        : '/api/admin/guest-houses';
      
      const method = editingGuestHouse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...guestHouseFormData,
          availableRooms: guestHouseFormData.totalRooms
        })
      });

      if (response.ok) {
        setMessage(editingGuestHouse ? 'Guest house updated successfully' : 'Guest house added successfully');
        setShowGuestHouseForm(false);
        setEditingGuestHouse(null);
        resetGuestHouseForm();
        fetchData();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to save guest house');
      }
    } catch (error) {
      setMessage('Error saving guest house');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuestHouse = (guestHouse: GuestHouse) => {
    setEditingGuestHouse(guestHouse);
    setGuestHouseFormData({
      guestHouse: guestHouse.guestHouse,
      location: guestHouse.location,
      roomType: guestHouse.roomType,
      totalRooms: guestHouse.totalRooms,
      pricePerNight: guestHouse.pricePerNight,
      amenities: guestHouse.amenities || ''
    });
    setShowGuestHouseForm(true);
  };

  const handleDeleteGuestHouse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest house?')) return;

    try {
      const response = await fetch(`/api/admin/guest-houses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Guest house deleted successfully');
        fetchData();
      } else {
        setMessage('Failed to delete guest house');
      }
    } catch (error) {
      setMessage('Error deleting guest house');
    }
  };

  const toggleGuestHouseStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/guest-houses/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setMessage(`Guest house ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchData();
      } else {
        setMessage('Failed to update status');
      }
    } catch (error) {
      setMessage('Error updating status');
    }
  };

  const resetGuestHouseForm = () => {
    setGuestHouseFormData({
      guestHouse: '',
      location: '',
      roomType: '',
      totalRooms: 1,
      pricePerNight: 0,
      amenities: ''
    });
  };

  const handleCancelGuestHouse = () => {
    setShowGuestHouseForm(false);
    setEditingGuestHouse(null);
    resetGuestHouseForm();
  };

  // Filter functions
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'approved' && member.isApproved) ||
      (filterStatus === 'pending' && !member.isApproved);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getFilteredBookings = () => {
    if (bookingFilter === 'all') return bookings;
    return bookings.filter(booking => booking.status === bookingFilter);
  };

  if (loading && (!users.length && !members.length && !events.length && !guestHouses.length && !bookings.length)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-orange-600">{users.filter(user => !user.isApproved).length}</p>
              </div>
              <UserCheck className="h-12 w-12 text-orange-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-blue-600">{bookings.filter(booking => booking.status === 'PENDING').length}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Bookings</p>
                <p className="text-3xl font-bold text-green-600">{bookings.filter(booking => booking.status === 'APPROVED').length}</p>
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
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'members', label: 'Members', icon: UserCheck },
                { id: 'events', label: 'Events', icon: CalendarDays },
                { id: 'guest-houses', label: 'Guest Houses', icon: Building },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'change-password', label: 'Change Password', icon: Lock }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Members</p>
                        <p className="text-3xl font-bold text-blue-600">{members.length}</p>
                      </div>
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Events</p>
                        <p className="text-3xl font-bold text-green-600">{events.length}</p>
                      </div>
                      <CalendarDays className="h-12 w-12 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Guest Houses</p>
                        <p className="text-3xl font-bold text-purple-600">{guestHouses.length}</p>
                      </div>
                      <Building className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-3xl font-bold text-orange-600">{bookings.length}</p>
                      </div>
                      <Calendar className="h-12 w-12 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending User Approvals</h3>
                    {users.filter(user => !user.isApproved).length === 0 ? (
                      <p className="text-gray-500">No pending user approvals</p>
                    ) : (
                      <div className="space-y-4">
                        {users.filter(user => !user.isApproved).slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'approve')}
                                disabled={actionLoading === user.id}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading === user.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'reject')}
                                disabled={actionLoading === user.id}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                    {bookings.length === 0 ? (
                      <p className="text-gray-500">No recent bookings</p>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{booking.guestHouse}</p>
                              <p className="text-sm text-gray-600">{booking.user.name}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'change-password' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <div className="max-w-md">
                  <ChangePasswordForm />
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search by name, email, employee ID, or designation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Members</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending Approval</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                          {member.imageUrl ? (
                            <img src={member.imageUrl} alt={member.name || 'Profile'} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl font-bold text-white">
                              {member.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name || 'No Name'}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              member.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.isApproved ? 'Approved' : 'Pending'}
                            </span>
                            {member.isProfileComplete && (
                              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                Complete Profile
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium">Employee ID:</span> {member.employeeId || 'Not provided'}</div>
                        <div><span className="font-medium">Designation:</span> {member.designation || 'Not provided'}</div>
                        <div><span className="font-medium">Posting:</span> {member.posting || 'Not provided'}</div>
                        <div><span className="font-medium">Joined:</span> {formatDate(member.createdAt)}</div>
                      </div>

                      {!member.isApproved && (
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveUser(member.id);
                            }}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </button>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <CalendarDays className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex space-x-2">
                          {event.isFeatured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs ${
                            event.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.eventDate).toLocaleDateString()}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowDeleteEventModal(true);
                            }}
                            className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {events.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first event to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* Guest Houses Tab */}
            {activeTab === 'guest-houses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Guest House Management</h2>
                  <button
                    onClick={() => setShowGuestHouseForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest House
                  </button>
                </div>

                {/* Guest Houses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {guestHouses.map((guestHouse) => (
                    <div key={guestHouse.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{guestHouse.guestHouse}</h3>
                          <p className="text-gray-600">{guestHouse.location}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          guestHouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {guestHouse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div><span className="font-medium">Room Type:</span> {guestHouse.roomType}</div>
                        <div><span className="font-medium">Total Rooms:</span> {guestHouse.totalRooms}</div>
                        <div><span className="font-medium">Available:</span> {guestHouse.availableRooms}</div>
                        <div><span className="font-medium">Price:</span> {formatCurrency(guestHouse.pricePerNight)}/night</div>
                        {guestHouse.amenities && (
                          <div><span className="font-medium">Amenities:</span> {guestHouse.amenities}</div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditGuestHouse(guestHouse)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => toggleGuestHouseStatus(guestHouse.id, guestHouse.isActive)}
                          className={`px-3 py-2 rounded text-sm ${
                            guestHouse.isActive 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {guestHouse.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteGuestHouse(guestHouse.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {guestHouses.length === 0 && (
                  <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No guest houses found</h3>
                    <p className="mt-1 text-sm text-gray-500">Add your first guest house to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Bookings</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {getFilteredBookings().map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.guestHouse}</h3>
                          <p className="text-gray-600">{booking.location}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Guest Details</p>
                          <p className="text-sm text-gray-600">{booking.user.name}</p>
                          <p className="text-sm text-gray-600">{booking.user.email}</p>
                          {booking.user.phone && <p className="text-sm text-gray-600">{booking.user.phone}</p>}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Booking Details</p>
                          <p className="text-sm text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Guests: {booking.guests}</p>
                          <p className="text-sm text-gray-600">Room: {booking.roomType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Purpose & Amount</p>
                          <p className="text-sm text-gray-600">{booking.purpose}</p>
                          {booking.totalAmount && (
                            <p className="text-sm text-gray-600">Amount: {formatCurrency(booking.totalAmount)}</p>
                          )}
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700">Special Requests</p>
                          <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                        </div>
                      )}

                      {booking.rejectedReason && (
                        <div className="mb-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-red-700">Rejection Reason</p>
                          <p className="text-sm text-red-600">{booking.rejectedReason}</p>
                        </div>
                      )}

                      {booking.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const amount = prompt('Enter total amount (optional):');
                              handleBookingAction(booking.id, 'APPROVED', undefined, amount || undefined);
                            }}
                            disabled={actionLoading === booking.id}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === booking.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectClick(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {getFilteredBookings().length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">No {bookingFilter === 'all' ? '' : bookingFilter.toLowerCase() + ' '}bookings at the moment.</p>
                  </div>
                )}
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

      {/* Event Create/Edit Modal */}
      {(showCreateEventModal || showEditEventModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {showEditEventModal ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  setShowEditEventModal(false);
                  setSelectedEvent(null);
                  resetEventForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventFormData.eventDate}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{imageUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  {eventFormData.imageUrl && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={eventFormData.imageUrl}
                        alt="Event preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setEventFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={eventFormData.isFeatured}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Featured Event</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={eventFormData.isPublished}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Publish Event</span>
                </label>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateEventModal(false);
                    setShowEditEventModal(false);
                    setSelectedEvent(null);
                    resetEventForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Saving...' : showEditEventModal ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Delete Modal */}
      {showDeleteEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedEvent.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteEventModal(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest House Form Modal */}
      {showGuestHouseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGuestHouse ? 'Edit Guest House' : 'Add New Guest House'}
              </h3>
              <button
                onClick={handleCancelGuestHouse}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleGuestHouseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guest House Name *
                  </label>
                  <input
                    type="text"
                    value={guestHouseFormData.guestHouse}
                    onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, guestHouse: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={guestHouseFormData.location}
                    onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={guestHouseFormData.roomType}
                    onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Rooms *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestHouseFormData.totalRooms}
                    onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, totalRooms: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={guestHouseFormData.pricePerNight}
                    onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, pricePerNight: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <textarea
                  value={guestHouseFormData.amenities}
                  onChange={(e) => setGuestHouseFormData(prev => ({ ...prev, amenities: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WiFi, AC, TV, Parking, etc."
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelGuestHouse}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? 'Saving...' : editingGuestHouse ? 'Update Guest House' : 'Add Guest House'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Member Details</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  {selectedMember.imageUrl ? (
                    <img src={selectedMember.imageUrl} alt={selectedMember.name || 'Profile'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {selectedMember.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4">{selectedMember.name || 'No Name'}</h3>
                <div className="flex justify-center items-center mt-2 space-x-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedMember.isApproved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedMember.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                  {selectedMember.isProfileComplete && (
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      Complete Profile
                    </span>
                  )}
                </div>

                {!selectedMember.isApproved && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        handleApproveUser(selectedMember.id);
                        setSelectedMember(null);
                      }}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve Member
                    </button>
                  </div>
                )}
              </div>

              {/* Member Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-600">{selectedMember.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600">{selectedMember.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Employee ID</p>
                      <p className="text-sm text-gray-600">{selectedMember.employeeId || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedMember.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date of Joining</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedMember.dateOfJoining)}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Designation</p>
                      <p className="text-sm text-gray-600">{selectedMember.designation || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Posting</p>
                      <p className="text-sm text-gray-600">{selectedMember.posting || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Place of Posting</p>
                      <p className="text-sm text-gray-600">{selectedMember.lastPlaceOfPosting || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Posting Confirmed</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedMember.lastPostingConfirmedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-600">{selectedMember.emergencyContactName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600">{selectedMember.emergencyContactPhone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Relation</p>
                      <p className="text-sm text-gray-600">{selectedMember.emergencyContactRelation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Nominee */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Insurance Nominee</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-600">{selectedMember.insuranceNomineeName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600">{selectedMember.insuranceNomineePhone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Relation</p>
                      <p className="text-sm text-gray-600">{selectedMember.insuranceNomineeRelation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Role</p>
                      <p className="text-sm text-gray-600">{selectedMember.role}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Member Since</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedMember.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Profile Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(selectedMember.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
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