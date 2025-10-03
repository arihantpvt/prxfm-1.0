import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just show a success message
      toast.success('🌸 Profile updated successfully!');
    } catch (error) {
      toast.error('💔 Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('🌸 See you soon, love!');
  };

  return (
    <div className="min-h-screen bg-gradient-romantic py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pacifico text-romantic-700 mb-2">
            Profile 👤
          </h1>
          <p className="text-lg text-romantic-600">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Info */}
        <div className="card-romantic mb-8">
          <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Your Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-romantic-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="input-romantic"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-romantic-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="input-romantic"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-romantic-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                className="input-romantic"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-romantic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'} 💕
              </button>
            </div>
          </form>
        </div>

        {/* Preferences */}
        <div className="card-romantic mb-8">
          <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-romantic-700 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setThemeMode('romantic')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    theme === 'romantic'
                      ? 'border-romantic-400 bg-romantic-100'
                      : 'border-romantic-200 hover:border-romantic-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🌸</div>
                  <div className="font-medium text-romantic-700">Romantic Mode</div>
                  <div className="text-sm text-romantic-600">Soft pastels and gentle animations</div>
                </button>

                <button
                  onClick={() => setThemeMode('pookie')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    theme === 'pookie'
                      ? 'border-romantic-400 bg-romantic-100'
                      : 'border-romantic-200 hover:border-romantic-300'
                  }`}
                >
                  <div className="text-2xl mb-2">💖</div>
                  <div className="font-medium text-romantic-700">Pookie Mode</div>
                  <div className="text-sm text-romantic-600">Hearts, sparkles, and extra love</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card-romantic mb-8">
          <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full btn-romantic bg-red-500 hover:bg-red-600"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="card-romantic text-center">
          <h2 className="text-2xl font-pacifico text-romantic-700 mb-4">About PRXFM</h2>
          <p className="text-romantic-600 mb-4">
            A private, romantic platform for couples to log fights, save memories, 
            and build stronger relationships together.
          </p>
          <div className="text-sm text-romantic-500">
            Made with 💕 for couples who want to grow together
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
