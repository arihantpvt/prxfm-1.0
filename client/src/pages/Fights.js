import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Fights = () => {
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [selectedFight, setSelectedFight] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    intensity: 3,
    mood: '😔',
    triggers: '',
    location: '',
    duration: 0
  });
  const [resolutionData, setResolutionData] = useState({
    summary: '',
    steps: '',
    outcomeRating: 3,
    resolutionType: 'communication',
    lessonsLearned: '',
    moodAfter: '😊'
  });

  useEffect(() => {
    fetchFights();
  }, []);

  const fetchFights = async () => {
    try {
      const response = await axios.get('/fights');
      if (response.data.success) {
        setFights(response.data.data.fights);
      }
    } catch (error) {
      console.error('Error fetching fights:', error);
      toast.error('💔 Failed to load fights');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/fights', {
        ...formData,
        triggers: formData.triggers.split(',').map(t => t.trim()).filter(t => t)
      });
      
      if (response.data.success) {
        toast.success('🌸 Fight logged successfully');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          intensity: 3,
          mood: '😔',
          triggers: '',
          location: '',
          duration: 0
        });
        fetchFights();
      }
    } catch (error) {
      console.error('Fight logging error:', error);
      if (error.response?.data?.message) {
        toast.error(`💔 ${error.response.data.message}`);
      } else if (error.response?.status === 401) {
        toast.error('💔 Please log in first');
      } else if (error.response?.status === 400) {
        toast.error('💔 You must be in a couple to log fights');
      } else {
        toast.error('💔 Failed to log fight');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResolutionChange = (e) => {
    setResolutionData({
      ...resolutionData,
      [e.target.name]: e.target.value
    });
  };

  const handleResolveFight = (fight) => {
    setSelectedFight(fight);
    setShowResolutionForm(true);
  };

  const handleSubmitResolution = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/resolutions', {
        fightId: selectedFight._id,
        ...resolutionData,
        lessonsLearned: resolutionData.lessonsLearned.split(',').map(l => l.trim()).filter(l => l)
      });
      
      if (response.data.success) {
        toast.success('🌸 Fight resolved successfully!');
        setShowResolutionForm(false);
        setSelectedFight(null);
        setResolutionData({
          summary: '',
          steps: '',
          outcomeRating: 3,
          resolutionType: 'communication',
          lessonsLearned: '',
          moodAfter: '😊'
        });
        fetchFights();
      }
    } catch (error) {
      console.error('Resolution error:', error);
      if (error.response?.data?.message) {
        toast.error(`💔 ${error.response.data.message}`);
      } else {
        toast.error('💔 Failed to resolve fight');
      }
    }
  };

  const moods = ['😢', '😡', '😔', '😤', '😰', '😞', '😠', '😭', '😤', '😓'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading fights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-romantic py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pacifico text-romantic-700 mb-2">
            Fight Log 💔
          </h1>
          <p className="text-lg text-romantic-600">
            Track and resolve conflicts together
          </p>
        </div>

        {/* Add Fight Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-romantic"
          >
            {showForm ? 'Cancel' : 'Log New Fight'} 💔
          </button>
        </div>

        {/* Fight Form */}
        {showForm && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Log a Fight</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-romantic"
                  placeholder="What was the fight about?"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="input-romantic"
                  placeholder="Describe what happened..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Intensity (1-5)
                  </label>
                  <input
                    type="range"
                    name="intensity"
                    min="1"
                    max="5"
                    className="w-full"
                    value={formData.intensity}
                    onChange={handleChange}
                  />
                  <div className="text-center text-sm text-romantic-600">
                    {formData.intensity}/5 - {formData.intensity === 1 ? 'Minor' : formData.intensity === 2 ? 'Small' : formData.intensity === 3 ? 'Moderate' : formData.intensity === 4 ? 'Serious' : 'Major'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setFormData({...formData, mood})}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all duration-300 ${
                          formData.mood === mood
                            ? 'border-romantic-400 bg-romantic-100'
                            : 'border-romantic-200 hover:border-romantic-300'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Triggers (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="triggers"
                    className="input-romantic"
                    placeholder="money, time, communication..."
                    value={formData.triggers}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input-romantic"
                    placeholder="Where did it happen?"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn-romantic">
                  Log Fight 💔
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Resolution Form */}
        {showResolutionForm && selectedFight && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">
              Resolve Fight: {selectedFight.title}
            </h2>
            <form onSubmit={handleSubmitResolution} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Resolution Summary
                </label>
                <textarea
                  name="summary"
                  required
                  rows={3}
                  className="input-romantic"
                  placeholder="How was the fight resolved?"
                  value={resolutionData.summary}
                  onChange={handleResolutionChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Steps Taken
                </label>
                <textarea
                  name="steps"
                  required
                  rows={4}
                  className="input-romantic"
                  placeholder="What steps did you take to resolve this conflict?"
                  value={resolutionData.steps}
                  onChange={handleResolutionChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Resolution Type
                  </label>
                  <select
                    name="resolutionType"
                    className="input-romantic"
                    value={resolutionData.resolutionType}
                    onChange={handleResolutionChange}
                  >
                    <option value="communication">💬 Communication</option>
                    <option value="apology">🙏 Apology</option>
                    <option value="compromise">🤝 Compromise</option>
                    <option value="understanding">💡 Understanding</option>
                    <option value="forgiveness">❤️ Forgiveness</option>
                    <option value="other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Outcome Rating (1-5)
                  </label>
                  <input
                    type="range"
                    name="outcomeRating"
                    min="1"
                    max="5"
                    className="w-full"
                    value={resolutionData.outcomeRating}
                    onChange={handleResolutionChange}
                  />
                  <div className="text-center text-sm text-romantic-600">
                    {resolutionData.outcomeRating}/5 - {resolutionData.outcomeRating === 1 ? 'Poor' : resolutionData.outcomeRating === 2 ? 'Fair' : resolutionData.outcomeRating === 3 ? 'Good' : resolutionData.outcomeRating === 4 ? 'Very Good' : 'Excellent'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Lessons Learned (comma-separated)
                </label>
                <input
                  type="text"
                  name="lessonsLearned"
                  className="input-romantic"
                  placeholder="What did you learn from this conflict?"
                  value={resolutionData.lessonsLearned}
                  onChange={handleResolutionChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Mood After Resolution
                </label>
                <div className="flex flex-wrap gap-2">
                  {['😊', '😌', '😇', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟'].map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setResolutionData({...resolutionData, moodAfter: mood})}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all duration-300 ${
                        resolutionData.moodAfter === mood
                          ? 'border-romantic-400 bg-romantic-100'
                          : 'border-romantic-200 hover:border-romantic-300'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResolutionForm(false);
                    setSelectedFight(null);
                  }}
                  className="btn-lavender"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-romantic">
                  Resolve Fight 🤝
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fights List */}
        <div className="space-y-6">
          {fights.length > 0 ? (
            fights.map((fight) => (
              <div key={fight._id} className="card-romantic">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{fight.mood}</span>
                      <h3 className="text-xl font-medium text-romantic-700">{fight.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fight.resolved 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {fight.resolved ? '✅ Resolved' : '⏳ Pending'}
                      </span>
                    </div>
                    <p className="text-romantic-600 mb-3">{fight.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-romantic-500">
                      <span>Intensity: {fight.intensity}/5</span>
                      <span>•</span>
                      <span>{new Date(fight.occurredAt).toLocaleDateString()}</span>
                      {fight.location && (
                        <>
                          <span>•</span>
                          <span>{fight.location}</span>
                        </>
                      )}
                    </div>
                    {fight.tags && fight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {fight.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-romantic-100 text-romantic-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-end space-x-2">
                    {!fight.resolved && (
                      <button
                        onClick={() => handleResolveFight(fight)}
                        className="btn-romantic text-sm"
                      >
                        🤝 Resolve Fight
                      </button>
                    )}
                    {fight.resolved && (
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        ✅ Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🕊️</div>
              <h3 className="text-xl font-medium text-romantic-700 mb-2">No fights recorded</h3>
              <p className="text-romantic-600">Keep the peace! Start logging when conflicts arise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fights;
