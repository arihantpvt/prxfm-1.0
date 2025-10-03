import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, createCouple } = useAuth();
  const [stats, setStats] = useState({
    totalFights: 0,
    resolvedFights: 0,
    totalMemories: 0,
    loveStreak: 0,
    relationshipDuration: 0
  });
  const [recentMemories, setRecentMemories] = useState([]);
  const [recentFights, setRecentFights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Debug: Log user object to see its structure
      console.log('User object:', user);
      console.log('User coupleId:', user?.coupleId);
      console.log('CoupleId type:', typeof user?.coupleId);
      
      // Only fetch data if user is logged in and in a couple
      if (!user || !user.coupleId) {
        setLoading(false);
        return;
      }

      // Fetch analytics
      try {
        const analyticsResponse = await axios.get('/analytics');
        if (analyticsResponse.data.success) {
          const { overview } = analyticsResponse.data.data;
          setStats(overview);
        }
      } catch (error) {
        console.log('Analytics not available:', error.message);
      }

      // Fetch recent memories
      try {
        const memoriesResponse = await axios.get('/memories?limit=3');
        if (memoriesResponse.data.success) {
          setRecentMemories(memoriesResponse.data.data.memories);
        }
      } catch (error) {
        console.log('Memories not available:', error.message);
      }

      // Fetch recent fights
      try {
        const fightsResponse = await axios.get('/fights?limit=3');
        if (fightsResponse.data.success) {
          setRecentFights(fightsResponse.data.data.fights);
        }
      } catch (error) {
        console.log('Fights not available:', error.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't show error toast for dashboard data - it's optional
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStreakMessage = () => {
    if (stats.loveStreak === 0) return "Let's start building your love streak! 💕";
    if (stats.loveStreak < 7) return `You're on a ${stats.loveStreak}-day streak! Keep it up! 🌟`;
    if (stats.loveStreak < 30) return `Amazing! ${stats.loveStreak} days of love! 💖`;
    return `Incredible! ${stats.loveStreak} days of pure love! 🏆`;
  };

  const handleCreateCouple = async () => {
    const loveStartDate = prompt('When did you start dating? (YYYY-MM-DD)');
    if (loveStartDate) {
      try {
        const result = await createCouple(loveStartDate);
        if (result.success) {
          toast.success('🌸 Couple created! Your couple code is ready.');
          // Refresh the page to show the couple code
          window.location.reload();
        } else {
          toast.error(`💔 ${result.message}`);
        }
      } catch (error) {
        toast.error('💔 Failed to create couple');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading your love story...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show welcome message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-romantic py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6 heart-glow">💕</div>
          <h1 className="text-4xl font-pacifico text-romantic-700 mb-4">
            Welcome to PRXFM
          </h1>
          <p className="text-xl text-romantic-600 mb-8">
            Your private, romantic couple app for building stronger relationships
          </p>
          <div className="card-romantic max-w-2xl mx-auto">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-4">Get Started</h2>
            <p className="text-romantic-600 mb-6">
              Create your account and start your love story together
            </p>
            <div className="space-y-4">
              <a href="/register" className="btn-romantic inline-block">
                Create Account 💕
              </a>
              <br />
              <a href="/login" className="btn-lavender inline-block">
                Sign In 🌸
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-romantic py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pacifico text-romantic-700 mb-2">
            {getGreeting()}, {user?.name}! 💕
          </h1>
          <p className="text-lg text-romantic-600">
            {getStreakMessage()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">💔</div>
            <div className="text-2xl font-bold text-romantic-700">{stats.totalFights}</div>
            <div className="text-sm text-romantic-600">Total Fights</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-2xl font-bold text-romantic-700">{stats.resolvedFights}</div>
            <div className="text-sm text-romantic-600">Resolved</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">💕</div>
            <div className="text-2xl font-bold text-romantic-700">{stats.totalMemories}</div>
            <div className="text-sm text-romantic-600">Memories</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-romantic-700">{stats.loveStreak}</div>
            <div className="text-sm text-romantic-600">Day Streak</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/fights"
            className="card-romantic hover:scale-105 transition-all duration-300 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce-gentle">💔</div>
            <h3 className="text-lg font-medium text-romantic-700 mb-2">Log a Fight</h3>
            <p className="text-sm text-romantic-600">Record and resolve conflicts</p>
          </Link>

          <Link
            to="/memories"
            className="card-romantic hover:scale-105 transition-all duration-300 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce-gentle">💕</div>
            <h3 className="text-lg font-medium text-romantic-700 mb-2">Add Memory</h3>
            <p className="text-sm text-romantic-600">Save precious moments</p>
          </Link>

          <Link
            to="/love-jar"
            className="card-romantic hover:scale-105 transition-all duration-300 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce-gentle">🏺</div>
            <h3 className="text-lg font-medium text-romantic-700 mb-2">Love Jar</h3>
            <p className="text-sm text-romantic-600">Drop a surprise note</p>
          </Link>

          <Link
            to="/analytics"
            className="card-romantic hover:scale-105 transition-all duration-300 text-center group"
          >
            <div className="text-4xl mb-3 group-hover:animate-bounce-gentle">📊</div>
            <h3 className="text-lg font-medium text-romantic-700 mb-2">Analytics</h3>
            <p className="text-sm text-romantic-600">View your progress</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Memories */}
          <div className="card-romantic">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-pacifico text-romantic-700">Recent Memories</h2>
              <Link
                to="/memories"
                className="text-sm text-romantic-500 hover:text-romantic-700 transition-colors duration-300"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentMemories.length > 0 ? (
                recentMemories.map((memory) => (
                  <div key={memory._id} className="flex items-center space-x-3 p-3 bg-romantic-50 rounded-lg">
                    <div className="text-2xl">{memory.mood}</div>
                    <div className="flex-1">
                      <p className="font-medium text-romantic-700">{memory.title || 'Untitled Memory'}</p>
                      <p className="text-sm text-romantic-600">{memory.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-romantic-500 text-center py-4">No memories yet. Start creating some! 💕</p>
              )}
            </div>
          </div>

          {/* Recent Fights */}
          <div className="card-romantic">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-pacifico text-romantic-700">Recent Fights</h2>
              <Link
                to="/fights"
                className="text-sm text-romantic-500 hover:text-romantic-700 transition-colors duration-300"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentFights.length > 0 ? (
                recentFights.map((fight) => (
                  <div key={fight._id} className="flex items-center space-x-3 p-3 bg-romantic-50 rounded-lg">
                    <div className="text-2xl">{fight.mood}</div>
                    <div className="flex-1">
                      <p className="font-medium text-romantic-700">{fight.title}</p>
                      <p className="text-sm text-romantic-600">
                        Intensity: {fight.intensity}/5 • {fight.resolved ? '✅ Resolved' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-romantic-500 text-center py-4">No fights recorded. Keep the peace! 🕊️</p>
              )}
            </div>
          </div>
        </div>

        {/* Couple Code Display or Create Couple */}
        {user?.coupleId && (typeof user.coupleId === 'string' || user.coupleId._id) ? (
          <div className="card-romantic max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-pacifico text-romantic-700 mb-4 text-center">💕 Your Couple Code</h3>
            <div className="bg-gradient-to-r from-romantic-50 to-lavender-50 p-6 rounded-lg border-2 border-romantic-200">
              <p className="text-center text-romantic-600 mb-4 font-medium">Share this code with your partner to join your couple:</p>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-romantic-300 mb-4">
                  <code className="text-xl font-mono text-romantic-700 break-all">
                    {typeof user.coupleId === 'object' ? user.coupleId._id || user.coupleId : user.coupleId}
                  </code>
                </div>
                <button
                  onClick={() => {
                    const coupleCode = typeof user.coupleId === 'object' ? user.coupleId._id || user.coupleId : user.coupleId;
                    navigator.clipboard.writeText(coupleCode);
                    toast.success('💕 Couple code copied to clipboard!');
                  }}
                  className="btn-romantic text-lg px-6 py-3"
                >
                  📋 Copy Couple Code
                </button>
              </div>
              <p className="text-center text-sm text-romantic-500 mt-4">
                Your partner can use this code during registration to join your couple!
              </p>
            </div>
          </div>
        ) : (
          <div className="card-romantic max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-pacifico text-romantic-700 mb-4">💕 Create Your Couple</h3>
            <div className="bg-romantic-50 p-4 rounded-lg">
              <p className="text-sm text-romantic-600 mb-4">You need to create a couple to start using the app. This will generate a code for your partner to join.</p>
              <button
                onClick={handleCreateCouple}
                className="btn-romantic"
              >
                Create Couple 💕
              </button>
            </div>
          </div>
        )}

        {/* Love Quote */}
        <div className="text-center mt-12">
          <div className="card-romantic max-w-2xl mx-auto">
            <p className="text-lg text-romantic-700 italic">
              "Love is not about how many days, months, or years you have been together. 
              It's about how much you love each other every single day."
            </p>
            <p className="text-sm text-romantic-500 mt-2">- Unknown</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
