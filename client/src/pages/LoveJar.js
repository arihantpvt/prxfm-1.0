import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoveJar = () => {
  const [loveNotes, setLoveNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    type: 'love',
    mood: '💕',
    isAnonymous: false,
    isScheduled: false,
    scheduledFor: ''
  });

  useEffect(() => {
    fetchLoveNotes();
  }, []);

  const fetchLoveNotes = async () => {
    try {
      const response = await axios.get('/lovenotes');
      if (response.data.success) {
        setLoveNotes(response.data.data.loveNotes);
      }
    } catch (error) {
      console.error('Error fetching love notes:', error);
      toast.error('💔 Failed to load love notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/lovenotes', {
        ...formData,
        scheduledFor: formData.isScheduled ? formData.scheduledFor : null
      });
      
      if (response.data.success) {
        toast.success('🌸 Love note added to the jar!');
        setShowForm(false);
        setFormData({
          content: '',
          type: 'love',
          mood: '💕',
          isAnonymous: false,
          isScheduled: false,
          scheduledFor: ''
        });
        fetchLoveNotes();
      }
    } catch (error) {
      toast.error('💔 Failed to add love note');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getRandomNote = async () => {
    try {
      const response = await axios.get('/lovenotes/random');
      if (response.data.success) {
        const note = response.data.data.loveNote;
        toast.success(`💕 ${note.content}`, { duration: 6000 });
      }
    } catch (error) {
      toast.error('💔 No love notes found in the jar');
    }
  };

  const markAsRead = async (noteId) => {
    try {
      await axios.put(`/lovenotes/${noteId}/read`);
      fetchLoveNotes();
    } catch (error) {
      console.error('Error marking note as read:', error);
    }
  };

  const types = [
    { value: 'love', label: '💕 Love Note', emoji: '💕' },
    { value: 'apology', label: '🙏 Apology', emoji: '🙏' },
    { value: 'surprise', label: '🎁 Surprise', emoji: '🎁' },
    { value: 'quote', label: '💭 Quote', emoji: '💭' },
    { value: 'promise', label: '🤝 Promise', emoji: '🤝' },
    { value: 'memory', label: '📸 Memory', emoji: '📸' },
    { value: 'gratitude', label: '🙏 Gratitude', emoji: '🙏' }
  ];

  const moods = ['💕', '🥰', '😍', '🤗', '😘', '✨', '🌟', '🎉', '💖', '😌', '😇'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-romantic">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-romantic-500 mx-auto mb-4"></div>
          <p className="text-romantic-600 font-medium">Loading love jar...</p>
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
            Love Jar 🏺
          </h1>
          <p className="text-lg text-romantic-600">
            Drop sweet surprises and love notes for each other
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-romantic"
          >
            {showForm ? 'Cancel' : 'Drop a Note'} 💕
          </button>
          <button
            onClick={getRandomNote}
            className="btn-lavender"
          >
            Surprise Me! ✨
          </button>
        </div>

        {/* Love Note Form */}
        {showForm && (
          <div className="card-romantic mb-8">
            <h2 className="text-2xl font-pacifico text-romantic-700 mb-6">Drop a Love Note</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-romantic-700 mb-2">
                  Your Message
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  className="input-romantic"
                  placeholder="Write something sweet, loving, or encouraging..."
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="w-4 h-4 text-romantic-500 border-romantic-300 rounded focus:ring-romantic-500"
                  />
                  <span className="text-sm text-romantic-700">Send anonymously</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isScheduled"
                    checked={formData.isScheduled}
                    onChange={handleChange}
                    className="w-4 h-4 text-romantic-500 border-romantic-300 rounded focus:ring-romantic-500"
                  />
                  <span className="text-sm text-romantic-700">Schedule for later</span>
                </label>

                {formData.isScheduled && (
                  <div>
                    <label className="block text-sm font-medium text-romantic-700 mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledFor"
                      className="input-romantic"
                      value={formData.scheduledFor}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="text-center">
                <button type="submit" className="btn-romantic">
                  Drop in Jar 🏺
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Love Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loveNotes.length > 0 ? (
            loveNotes.map((note) => (
              <div 
                key={note._id} 
                className={`card-romantic cursor-pointer transition-all duration-300 hover:scale-105 ${
                  !note.isRead ? 'ring-2 ring-romantic-300' : ''
                }`}
                onClick={() => markAsRead(note._id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{note.mood}</span>
                    <span className="text-sm text-romantic-500">
                      {types.find(t => t.value === note.type)?.emoji}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {note.isAnonymous && (
                      <span className="text-xs text-romantic-500">👤 Anonymous</span>
                    )}
                    {!note.isRead && (
                      <span className="w-2 h-2 bg-romantic-500 rounded-full"></span>
                    )}
                  </div>
                </div>
                
                <p className="text-romantic-700 mb-3 line-clamp-4">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-romantic-500">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize">{note.type}</span>
                </div>
                
                {note.reactions && note.reactions.length > 0 && (
                  <div className="flex items-center space-x-1 mt-3">
                    {note.reactions.map((reaction, index) => (
                      <span key={index} className="text-sm">
                        {reaction.emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏺</div>
              <h3 className="text-xl font-medium text-romantic-700 mb-2">Love jar is empty</h3>
              <p className="text-romantic-600">Start dropping love notes for each other!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoveJar;
