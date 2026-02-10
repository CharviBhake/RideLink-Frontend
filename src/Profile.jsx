import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Car, MapPin, Star, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      
      try {
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:8080/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setProfileData(profile);
          setEditData(profile);
        } else {
          alert('Failed to load profile');
        }

        // Fetch user stats
        const statsResponse = await fetch('http://localhost:8080/ride/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (statsResponse.ok) {
          const userStats = await statsResponse.json();
          setStats(userStats);
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfileData(updatedProfile);
        setEditData(updatedProfile);
        setIsEditing(false);
        alert('✅ Profile updated successfully!');
      } else {
        const error = await response.json();
        alert('❌ Update failed: ' + (error.message || 'Please try again'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getMemberSince = () => {
    if (!profileData?.createdAt) return 'Recently';
    
    const date = new Date(profileData.createdAt);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-white hover:text-neutral-300 mb-6 flex items-center"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-4xl">
        {/* Profile Header */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
                <User className="w-12 h-12 text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profileData.name || profileData.username || 'User'}
                </h2>
                <div className="flex items-center text-neutral-400 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profileData.location || profileData.city || 'Not specified'}
                </div>
                <div className="flex items-center text-neutral-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {getMemberSince()}
                </div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-lg font-semibold transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-semibold transition-all border border-neutral-700"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.totalRides || 0}
              </div>
              <div className="text-sm text-neutral-400">Total Rides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.asDriver || 0}
              </div>
              <div className="text-sm text-neutral-400">As Driver</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {stats?.asPassenger || 0}
              </div>
              <div className="text-sm text-neutral-400">As Passenger</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                ⭐ {stats?.rating || 'N/A'}
              </div>
              <div className="text-sm text-neutral-400">
                {stats?.totalReviews || 0} Reviews
              </div>
            </div>
            
            
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">Personal Information</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="name"
                  value={isEditing ? (editData.name || '') : (profileData.name || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  name="email"
                  value={isEditing ? (editData.email || '') : (profileData.email || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="tel"
                  name="phone"
                  value={isEditing ? (editData.phone || '') : (profileData.phone || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="location"
                  value={isEditing ? (editData.location || editData.city || '') : (profileData.location || profileData.city || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={isEditing ? (editData.bio || '') : (profileData.bio || '')}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                  isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                }`}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Vehicle Information</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Car Model</label>
              <div className="relative">
                <Car className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  name="carModel"
                  value={isEditing ? (editData.carModel || '') : (profileData.carModel || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="e.g., Honda City, Maruti Swift"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  value={isEditing ? (editData.carNumber || '') : (profileData.carNumber || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="DL 01 AB 1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Car Color</label>
                <input
                  type="text"
                  name="carColor"
                  value={isEditing ? (editData.carColor || '') : (profileData.carColor || '')}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed opacity-75'
                  }`}
                  placeholder="e.g., White, Silver"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        {profileData.verified && (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 mt-6">
            <h3 className="text-2xl font-bold text-white mb-6">Verifications</h3>
            <div className="flex flex-wrap gap-3">
              {profileData.emailVerified && (
                <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Email Verified
                </span>
              )}
              {profileData.phoneVerified && (
                <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Phone Verified
                </span>
              )}
              {profileData.idVerified && (
                <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ ID Verified
                </span>
              )}
              {profileData.licenseVerified && (
                <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Driving License
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;