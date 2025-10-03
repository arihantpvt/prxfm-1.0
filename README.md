# 💕 PRXFM - Private Romantic Couple Web App

A beautiful, intimate platform designed exclusively for couples to strengthen their relationship through conflict resolution, memory keeping, and love tracking.

## 🌸 Features

### Core Features
- **Fight Logging & Resolution Tracking** - Record conflicts with intensity, mood, and triggers
- **Sweet Memory Vault** - Save text, photos, voice notes, and videos of precious moments
- **Love Jar** - Drop anonymous love notes and surprises for each other
- **Relationship Analytics** - AI-powered insights into your relationship patterns
- **Streak Counter** - Track days without fights and successful resolutions

### Romantic Features
- **Pookie Mode** - Transform the UI with hearts, sparkles, and extra love
- **Mood Tracker** - Emoji-based emotional tracking with analytics
- **Promise Wall** - Make and track relationship promises
- **Random Memory Generator** - "Surprise Me" button for random sweet memories
- **Love Calendar** - Timeline of your relationship journey
- **Private Chat** - Couple-only messaging with custom stickers

### UI/UX
- **Romantic Theme** - Pastel pinks, lavender, and cream gradients
- **Playful Typography** - Pacifico for headings, Nunito for body text
- **Floating Animations** - Hearts, sparkles, and gentle movements
- **Responsive Design** - Beautiful on all devices
- **Accessibility** - Inclusive design for all users

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **GridFS** for file storage
- **RESTful API** design

### Frontend
- **React 18** with functional components
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prxfm
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/prxfm-couple-app
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

### Alternative Setup

**Backend only:**
```bash
cd server
npm install
npm run dev
```

**Frontend only:**
```bash
cd client
npm install
npm start
```

## 📱 Usage

### Getting Started
1. **Register** - Create your account
2. **Create Couple** - Set up your relationship (or join with a couple code)
3. **Start Logging** - Begin tracking fights, resolutions, and memories
4. **Explore Features** - Try the Love Jar, Analytics, and Pookie Mode

### Key Workflows

**Logging a Fight:**
1. Go to Fights page
2. Click "Log New Fight"
3. Fill in details (title, description, intensity, mood, triggers)
4. Save and later add a resolution

**Adding Memories:**
1. Go to Memories page
2. Click "Add Memory"
3. Choose type (text, photo, voice, video)
4. Add content, mood, and tags
5. Save precious moments

**Using Love Jar:**
1. Go to Love Jar page
2. Click "Drop a Note"
3. Write a sweet message
4. Choose type and mood
5. Send anonymously or schedule for later

## 🗄️ Database Schema

### User
- Basic profile information
- Couple association
- Preferences and settings

### Couple
- Relationship start date
- Love streak counter
- Promise tracking
- Settings and preferences

### Fight
- Conflict details and intensity
- Mood and triggers
- Resolution status
- Location and duration

### Resolution
- Resolution steps and outcome
- Lessons learned
- Follow-up actions
- AI suggestions

### Memory
- Content and media
- Mood and tags
- Privacy settings
- File metadata

### LoveNote
- Anonymous messaging
- Scheduling system
- Reactions and delivery
- Type categorization

## 🎨 Customization

### Themes
- **Romantic Mode** - Soft pastels and gentle animations
- **Pookie Mode** - Hearts, sparkles, and extra love

### Colors
- Primary: Romantic pink (#e85d5d)
- Secondary: Lavender (#a855f7)
- Accent: Cream (#ffd700)
- Background: Gradient combinations

### Typography
- Headings: Pacifico (cursive)
- Body: Nunito (sans-serif)
- Handwriting: Kalam (cursive)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/create-couple` - Create couple

### Fights
- `POST /api/fights` - Log new fight
- `GET /api/fights` - Get all fights
- `GET /api/fights/:id` - Get specific fight
- `PUT /api/fights/:id` - Update fight
- `DELETE /api/fights/:id` - Delete fight

### Resolutions
- `POST /api/resolutions` - Create resolution
- `GET /api/resolutions/:fightId` - Get resolution for fight
- `PUT /api/resolutions/:id` - Update resolution

### Memories
- `POST /api/memories` - Create memory
- `GET /api/memories` - Get all memories
- `GET /api/memories/random` - Get random memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Love Notes
- `POST /api/lovenotes` - Create love note
- `GET /api/lovenotes` - Get all love notes
- `GET /api/lovenotes/random` - Get random love note
- `PUT /api/lovenotes/:id/read` - Mark as read
- `POST /api/lovenotes/:id/reaction` - Add reaction

### Analytics
- `GET /api/analytics` - Get comprehensive analytics

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Deploy!

### Backend (Render/Heroku)
1. Connect your repository
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables
5. Deploy!

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💕 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Email: support@prxfm.app
- Discord: [Join our community]

## 🙏 Acknowledgments

- Built with love for couples everywhere
- Inspired by the need for better relationship tools
- Special thanks to the open-source community

---

**Made with 💕 for couples who want to grow together**

*PRXFM - Where love stories are written, conflicts are resolved, and memories are cherished.*