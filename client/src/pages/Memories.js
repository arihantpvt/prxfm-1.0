import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'text',
    title: '',
    content: '',
    description: '',
    mood: '😊',
    tags: '',
    location: ''
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await axios.get('/memories');
      if (response.data.success) {
        setMemories(response.data.data.memories);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      toast.error('💔 Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/memories', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      
      if (response.data.success) {
        toast.success('🌸 Memory saved successfully');
        setShowForm(false);
        setFormData({
          type: 'text',
          title: '',
          content: '',
          description: '',
          mood: '😊',
          tags: '',
          location: ''
        });
        fetchMemories();
      }
    } catch (error) {
      toast.error('💔 Failed to save memory');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRandomMemory = async () => {
    try {
      const response = await axios.get('/memories/random');
      if (response.data.success) {
        const memory = response.data.data.memory;
        toast.success(`💕 ${memory.title || 'Random Memory'}: ${memory.content.substring(0, 50)}...`);
      }
    } catch (error) {
      toast.error('💔 No memories found');
    }
  };

  const moods = ['😊', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟', '🎉', '💖', '😌', '😇'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading memories...</p>
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
            Sweet Memories 💕
          </h1>
          <p className="text-lg text-romantic-600">
            Capture and cherish your precious moments
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-romantic"
          >
            {showForm ? 'Cancel' : 'Add Memory'} 💕
          </button>
          <button
            onClick={getRandomMemory}
            className="btn-lavender"
          >
            Surprise Me! ✨
          </button>
        </div>

        {/* Memory Form */}
        {showForm && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Create a Memory</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  className="input-romantic"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="text">📝 Text</option>
                  <option value="photo">📸 Photo</option>
                  <option value="voice">🎤 Voice</option>
                  <option value="video">🎥 Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-romantic"
                  placeholder="Give this memory a title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Content
                </label>
                {formData.type === 'text' ? (
                  <textarea
                    name="content"
                    required
                    rows={4}
                    className="input-romantic"
                    placeholder="What happened? How did it make you feel?"
                    value={formData.content}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="content"
                    required
                    className="input-romantic"
                    placeholder="Describe the content or add a URL"
                    value={formData.content}
                    onChange={handleChange}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="input-romantic"
                  placeholder="Additional details about this memory..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-romantic-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    className="input-romantic"
                    placeholder="date, vacation, anniversary..."
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="input-romantic"
                  placeholder="Where did this happen?"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn-romantic">
                  Save Memory 💕
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.length > 0 ? (
            memories.map((memory) => (
              <div key={memory._id} className="card-romantic">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{memory.mood}</span>
                    <span className="text-sm text-romantic-500">
                      {memory.type === 'text' ? '📝' : memory.type === 'photo' ? '📸' : memory.type === 'voice' ? '🎤' : '🎥'}
                    </span>
                  </div>
                  {memory.isFavorite && (
                    <span className="text-yellow-500">⭐</span>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-romantic-700 mb-2">
                  {memory.title}
                </h3>
                
                <p className="text-romantic-600 text-sm mb-3 line-clamp-3">
                  {memory.content}
                </p>
                
                {memory.description && (
                  <p className="text-romantic-500 text-xs mb-3">
                    {memory.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-romantic-500">
                  <span>{new Date(memory.memoryDate).toLocaleDateString()}</span>
                  {memory.location && (
                    <span>📍 {memory.location}</span>
                  )}
                </div>
                
                {memory.tags && memory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {memory.tags.map((tag, index) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">💕</div>
              <h3 className="text-xl font-medium text-romantic-700 mb-2">No memories yet</h3>
              <p className="text-romantic-600">Start capturing your beautiful moments together!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Memories;
