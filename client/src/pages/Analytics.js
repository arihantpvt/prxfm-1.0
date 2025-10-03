import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`/analytics?period=${selectedPeriod}`);
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('💔 Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const getSuccessRateColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-orange-100 text-orange-800',
      4: 'bg-red-100 text-red-800',
      5: 'bg-red-200 text-red-900'
    };
    return colors[intensity] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-romantic-700 mb-2">No analytics available</h3>
          <p className="text-romantic-600">Start logging fights and memories to see your relationship insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-romantic py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pacifico text-romantic-700 mb-2">
            Relationship Analytics 📊
          </h1>
          <p className="text-lg text-romantic-600 mb-4">
            Insights into your love story
          </p>
          
          {/* Period Selector */}
          <div className="flex justify-center">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-romantic max-w-xs"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">💔</div>
            <div className="text-2xl font-bold text-romantic-700">{analytics.overview.totalFights}</div>
            <div className="text-sm text-romantic-600">Total Fights</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">🤝</div>
            <div className="text-2xl font-bold text-romantic-700">{analytics.overview.resolvedFights}</div>
            <div className="text-sm text-romantic-600">Resolved</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className={`text-2xl font-bold ${getSuccessRateColor(analytics.overview.successRate)}`}>
              {analytics.overview.successRate}%
            </div>
            <div className="text-sm text-romantic-600">Success Rate</div>
          </div>
          
          <div className="card-romantic text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-romantic-700">{analytics.overview.loveStreak}</div>
            <div className="text-sm text-romantic-600">Day Streak</div>
          </div>
        </div>

        {/* AI Suggestions */}
        {analytics.aiSuggestions && analytics.aiSuggestions.length > 0 && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">💡 AI Suggestions</h2>
            <div className="space-y-4">
              {analytics.aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-romantic-50 rounded-lg">
                  <span className="text-2xl">{suggestion.emoji}</span>
                  <div>
                    <h3 className="font-medium text-romantic-700">{suggestion.title}</h3>
                    <p className="text-sm text-romantic-600">{suggestion.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fight Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Intensity Distribution */}
          <div className="card-romantic">
            <h2 className="text-xl font-pacifico text-romantic-700 mb-4">Fight Intensity</h2>
            <div className="space-y-3">
              {analytics.fights.intensityStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(stat._id)}`}>
                      {stat._id}/5
                    </span>
                    <span className="text-sm text-romantic-600">
                      {stat._id === 1 ? 'Minor' : stat._id === 2 ? 'Small' : stat._id === 3 ? 'Moderate' : stat._id === 4 ? 'Serious' : 'Major'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-romantic-200 rounded-full h-2">
                      <div 
                        className="bg-romantic-500 h-2 rounded-full" 
                        style={{ width: `${(stat.count / Math.max(...analytics.fights.intensityStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-romantic-700">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="card-romantic">
            <h2 className="text-xl font-pacifico text-romantic-700 mb-4">Common Moods</h2>
            <div className="space-y-3">
              {analytics.fights.moodStats.slice(0, 5).map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stat._id}</span>
                    <span className="text-sm text-romantic-600">
                      {stat._id === '😢' ? 'Sad' : stat._id === '😡' ? 'Angry' : stat._id === '😔' ? 'Disappointed' : stat._id === '😤' ? 'Frustrated' : 'Other'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-romantic-200 rounded-full h-2">
                      <div 
                        className="bg-romantic-500 h-2 rounded-full" 
                        style={{ width: `${(stat.count / Math.max(...analytics.fights.moodStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-romantic-700">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Triggers */}
        {analytics.fights.triggerStats && analytics.fights.triggerStats.length > 0 && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-4">Common Triggers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.fights.triggerStats.map((trigger, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-romantic-50 rounded-lg">
                  <span className="text-romantic-700 font-medium">{trigger._id}</span>
                  <span className="text-sm text-romantic-600">{trigger.count} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolution Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resolution Types */}
          <div className="card-romantic">
            <h2 className="text-xl font-pacifico text-romantic-700 mb-4">Resolution Methods</h2>
            <div className="space-y-3">
              {analytics.resolutions.resolutionTypeStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <span className="text-sm text-romantic-600 capitalize">{stat._id}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-romantic-200 rounded-full h-2">
                      <div 
                        className="bg-romantic-500 h-2 rounded-full" 
                        style={{ width: `${(stat.count / Math.max(...analytics.resolutions.resolutionTypeStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-romantic-700">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome Ratings */}
          <div className="card-romantic">
            <h2 className="text-xl font-pacifico text-romantic-700 mb-4">Resolution Outcomes</h2>
            <div className="space-y-3">
              {analytics.resolutions.resolutionStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <span className="text-sm text-romantic-600">{stat._id}/5 Stars</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-romantic-200 rounded-full h-2">
                      <div 
                        className="bg-romantic-500 h-2 rounded-full" 
                        style={{ width: `${(stat.count / Math.max(...analytics.resolutions.resolutionStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-romantic-700">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Memory Analytics */}
        <div className="card-romantic">
          <h2 className="text-2xl font-pacifico text-romantic-700 mb-4">Memory Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.memories.memoryTypeStats.map((stat) => (
              <div key={stat._id} className="text-center p-4 bg-romantic-50 rounded-lg">
                <div className="text-2xl mb-2">
                  {stat._id === 'text' ? '📝' : stat._id === 'photo' ? '📸' : stat._id === 'voice' ? '🎤' : '🎥'}
                </div>
                <div className="text-lg font-bold text-romantic-700">{stat.count}</div>
                <div className="text-sm text-romantic-600 capitalize">{stat._id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
