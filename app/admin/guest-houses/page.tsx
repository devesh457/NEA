'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

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

interface GuestHouseForm {
  guestHouse: string;
  location: string;
  roomType: string;
  totalRooms: number;
  pricePerNight: number;
  amenities: string;
}

export default function AdminGuestHousesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGuestHouse, setEditingGuestHouse] = useState<GuestHouse | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<GuestHouseForm>({
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
    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchGuestHouses();
  }, [session, status, router]);

  const fetchGuestHouses = async () => {
    try {
      const response = await fetch('/api/admin/guest-houses');
      if (response.ok) {
        const data = await response.json();
        setGuestHouses(data.guestHouses);
      } else {
        setMessage('Failed to fetch guest houses');
      }
    } catch (error) {
      setMessage('Error fetching guest houses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          ...formData,
          availableRooms: formData.totalRooms // Initially all rooms are available
        })
      });

      if (response.ok) {
        setMessage(editingGuestHouse ? 'Guest house updated successfully' : 'Guest house added successfully');
        setShowForm(false);
        setEditingGuestHouse(null);
        resetForm();
        fetchGuestHouses();
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

  const handleEdit = (guestHouse: GuestHouse) => {
    setEditingGuestHouse(guestHouse);
    setFormData({
      guestHouse: guestHouse.guestHouse,
      location: guestHouse.location,
      roomType: guestHouse.roomType,
      totalRooms: guestHouse.totalRooms,
      pricePerNight: guestHouse.pricePerNight,
      amenities: guestHouse.amenities || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest house?')) return;

    try {
      const response = await fetch(`/api/admin/guest-houses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('Guest house deleted successfully');
        fetchGuestHouses();
      } else {
        setMessage('Failed to delete guest house');
      }
    } catch (error) {
      setMessage('Error deleting guest house');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/guest-houses/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setMessage(`Guest house ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchGuestHouses();
      } else {
        setMessage('Failed to update status');
      }
    } catch (error) {
      setMessage('Error updating status');
    }
  };

  const resetForm = () => {
    setFormData({
      guestHouse: '',
      location: '',
      roomType: '',
      totalRooms: 1,
      pricePerNight: 0,
      amenities: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGuestHouse(null);
    resetForm();
  };

  if (loading && guestHouses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guest houses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest House Management</h1>
              <p className="text-gray-600">Manage guest houses, rooms, and pricing</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Guest House
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              {message}
            </div>
          )}

          {/* Guest Houses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {guestHouses.map((guestHouse) => (
              <div
                key={guestHouse.id}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${
                  !guestHouse.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{guestHouse.guestHouse}</h3>
                    <p className="text-gray-600">{guestHouse.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      guestHouse.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {guestHouse.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium">Room Type:</span>
                    <span>{guestHouse.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Rooms:</span>
                    <span>{guestHouse.totalRooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Available:</span>
                    <span className={guestHouse.availableRooms > 0 ? 'text-green-600' : 'text-red-600'}>
                      {guestHouse.availableRooms}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price/Night:</span>
                    <span className="text-lg font-semibold text-blue-600">₹{guestHouse.pricePerNight}</span>
                  </div>
                  {guestHouse.amenities && (
                    <div>
                      <span className="font-medium">Amenities:</span>
                      <p className="text-sm text-gray-600 mt-1">{guestHouse.amenities}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(guestHouse)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(guestHouse.id, guestHouse.isActive)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      guestHouse.isActive
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {guestHouse.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(guestHouse.id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {guestHouses.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No guest houses found.</p>
              <p className="text-gray-400">Add your first guest house to get started.</p>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingGuestHouse ? 'Edit Guest House' : 'Add New Guest House'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest House Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guestHouse}
                      onChange={(e) => setFormData({...formData, guestHouse: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., NEA Guest House Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., New Delhi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      required
                      value={formData.roomType}
                      onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Rooms *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({...formData, totalRooms: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Night (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({...formData, pricePerNight: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <textarea
                      value={formData.amenities}
                      onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., WiFi, AC, TV, Breakfast, Parking"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingGuestHouse ? 'Update Guest House' : 'Add Guest House')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 