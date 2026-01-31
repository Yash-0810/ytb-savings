import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import axios from 'axios';

interface Profile {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export const Account: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/auth/profile/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setProfile(response.data);
      }
    } catch (err) {
      // Profile doesn't exist yet, that's okay
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/auth/profile',
        { ...profile, user_id: user?.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      <Navbar user={user} onLogout={() => {}} />
      <div className="max-w-2xl mx-auto pt-20 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
          <p className="text-gray-600 mb-6">Manage your profile and contact information</p>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Name:</strong> {user?.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="+91 9999999999"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Street address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">ZIP Code</label>
              <input
                type="text"
                value={profile.zip_code}
                onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="400001"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
