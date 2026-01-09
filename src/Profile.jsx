import React, { useState } from 'react';
import { User, Mail, Phone, Car, MapPin, Star, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    location: 'Gurugram, Haryana',
    bio: 'Regular commuter between Gurugram and Delhi. Love meeting new people and sharing rides!',
    carModel: 'Honda City',
    carNumber: 'DL 01 AB 1234',
    carColor: 'Silver',
    memberSince: 'January 2024'
  });

  const [editData, setEditData] = useState(profileData);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const stats = {
    totalRides: 24,
    asDriver: 15,
    asPassenger: 9,
    rating: 4.8,
    totalReviews: 18,
    completionRate: 96
  };

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
                <h2 className="text-3xl font-bold text-white mb-2">{profileData.name}</h2>
                <div className="flex items-center text-neutral-400 mb-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profileData.location}
                </div>
                <div className="flex items-center text-neutral-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {profileData.memberSince}
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
              <div className="text-3xl font-bold text-white mb-1">{stats.totalRides}</div>
              <div className="text-sm text-neutral-400">Total Rides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.asDriver}</div>
              <div className="text-sm text-neutral-400">As Driver</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.asPassenger}</div>
              <div className="text-sm text-neutral-400">As Passenger</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl font-bold text-white mb-1">
                <Star className="w-6 h-6 mr-1 fill-white" />
                {stats.rating}
              </div>
              <div className="text-sm text-neutral-400">{stats.totalReviews} Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.completionRate}%</div>
              <div className="text-sm text-neutral-400">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">₹2.4k</div>
              <div className="text-sm text-neutral-400">Total Saved</div>
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
                  value={isEditing ? editData.name : profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
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
                  value={isEditing ? editData.email : profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
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
                  value={isEditing ? editData.phone : profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
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
                  value={isEditing ? editData.location : profileData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={isEditing ? editData.bio : profileData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                  isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                }`}
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
                  value={isEditing ? editData.carModel : profileData.carModel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  value={isEditing ? editData.carNumber : profileData.carNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Car Color</label>
                <input
                  type="text"
                  name="carColor"
                  value={isEditing ? editData.carColor : profileData.carColor}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-neutral-200 ${
                    isEditing ? 'focus:ring-2 focus:ring-white focus:border-transparent' : 'cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8 mt-6">
          <h3 className="text-2xl font-bold text-white mb-6">Verifications</h3>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Email Verified
            </span>
            <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Phone Verified
            </span>
            <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
              ✓ ID Verified
            </span>
            <span className="flex items-center bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
              ✓ Driving License
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;