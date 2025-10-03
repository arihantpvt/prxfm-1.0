import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('🌸 Welcome back, love!');
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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-romantic-600">
            Sign in to continue your love story
          </p>
        </div>

        {/* Login Form */}
        <div className="card-romantic">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
              />
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
                    Signing in...
                  </div>
                ) : (
                  'Sign In 💕'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-romantic-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-romantic-500 hover:text-romantic-600 transition-colors duration-300"
                >
                  Create one here
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

export default Login;
