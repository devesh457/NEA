'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminNavigation from '@/components/AdminNavigation';

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

export default function AdminMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, approved, pending
  const [message, setMessage] = useState('');

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
    fetchMembers();
  }, [session, status, router]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      } else {
        setMessage('Failed to fetch members');
      }
    } catch (error) {
      setMessage('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setMessage('User approved successfully');
        fetchMembers();
      } else {
        setMessage('Failed to approve user');
      }
    } catch (error) {
      setMessage('Error approving user');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading members...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Management</h1>
            <p className="text-gray-600">View and manage all member profiles</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
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

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              {message}
            </div>
          )}

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
                          Profile Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Employee ID:</span> {member.employeeId || 'Not provided'}</div>
                  <div><span className="font-medium">Designation:</span> {member.designation || 'Not provided'}</div>
                  <div><span className="font-medium">Current Posting:</span> {member.posting || 'Not provided'}</div>
                  <div><span className="font-medium">Phone:</span> {member.phone || 'Not provided'}</div>
                </div>

                {!member.isApproved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveUser(member.id);
                    }}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve User
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No members found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Member Details</h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                        {selectedMember.imageUrl ? (
                          <img src={selectedMember.imageUrl} alt={selectedMember.name || 'Profile'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {selectedMember.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold">{selectedMember.name || 'No Name'}</h4>
                        <p className="text-gray-600">{selectedMember.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div><span className="font-medium">Employee ID:</span> {selectedMember.employeeId || 'Not provided'}</div>
                      <div><span className="font-medium">Phone:</span> {selectedMember.phone || 'Not provided'}</div>
                      <div><span className="font-medium">Designation:</span> {selectedMember.designation || 'Not provided'}</div>
                      <div><span className="font-medium">Current Posting:</span> {selectedMember.posting || 'Not provided'}</div>
                      <div><span className="font-medium">Last Place of Posting:</span> {selectedMember.lastPlaceOfPosting || 'Not provided'}</div>
                      <div><span className="font-medium">Date of Joining:</span> {formatDate(selectedMember.dateOfJoining)}</div>
                      <div><span className="font-medium">Date of Birth:</span> {formatDate(selectedMember.dateOfBirth)}</div>
                      <div><span className="font-medium">Blood Group:</span> {selectedMember.bloodGroup || 'Not provided'}</div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact & Insurance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-3 mb-6">
                    <div><span className="font-medium">Name:</span> {selectedMember.emergencyContactName || 'Not provided'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedMember.emergencyContactPhone || 'Not provided'}</div>
                    <div><span className="font-medium">Relation:</span> {selectedMember.emergencyContactRelation || 'Not provided'}</div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Nominee</h3>
                  <div className="space-y-3 mb-6">
                    <div><span className="font-medium">Name:</span> {selectedMember.insuranceNomineeName || 'Not provided'}</div>
                    <div><span className="font-medium">Phone:</span> {selectedMember.insuranceNomineePhone || 'Not provided'}</div>
                    <div><span className="font-medium">Relation:</span> {selectedMember.insuranceNomineeRelation || 'Not provided'}</div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Approval Status:</span>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        selectedMember.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedMember.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Profile Status:</span>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        selectedMember.isProfileComplete 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedMember.isProfileComplete ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    <div><span className="font-medium">Role:</span> {selectedMember.role}</div>
                    <div><span className="font-medium">Member Since:</span> {formatDate(selectedMember.createdAt)}</div>
                    <div><span className="font-medium">Last Updated:</span> {formatDate(selectedMember.updatedAt)}</div>
                    <div><span className="font-medium">Last Posting Confirmed:</span> {formatDate(selectedMember.lastPostingConfirmedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 