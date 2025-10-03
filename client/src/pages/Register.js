import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    coupleCode: ''
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('💔 Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.coupleCode || null
      );
      
      if (result.success) {
        toast.success('🌸 Welcome to your love story!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('💔 Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-romantic py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 heart-glow flex items-center justify-center text-4xl">
            💕
          </div>
          <h2 className="mt-6 text-3xl font-pacifico text-romantic-700">
            Start Your Love Story
          </h2>
          <p className="mt-2 text-sm text-romantic-600">
            Create your account and begin your journey together
          </p>
        </div>

        {/* Registration Form */}
        <div className="card-romantic">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-romantic-700 mb-2">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-romantic"
                placeholder="Your beautiful name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-romantic-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-romantic"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-romantic-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-romantic"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-romantic-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-romantic"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="coupleCode" className="block text-sm font-medium text-romantic-700 mb-2">
                Couple Code (Optional)
              </label>
              <input
                id="coupleCode"
                name="coupleCode"
                type="text"
                className="input-romantic"
                placeholder="Enter your partner's couple code"
                value={formData.coupleCode}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-romantic-500">
                If your partner already created an account, enter their couple code to join them
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-romantic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account 💕'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-romantic-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-romantic-500 hover:text-romantic-600 transition-colors duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="text-center">
          <p className="text-xs text-romantic-500">
            ✨ Log fights & resolutions • 💕 Save sweet memories • 🏺 Love jar surprises • 📊 Relationship analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
