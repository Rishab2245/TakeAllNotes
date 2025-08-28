# Note Taking App - Full Stack Assignment

A modern, responsive note-taking application built with React (JavaScript) frontend and Express.js/Node.js backend, featuring user authentication with email/OTP and Google OAuth, and complete CRUD operations for notes.

## Features

- **User Authentication**
  - Email and OTP-based signup/login
  - Google OAuth integration (ready for configuration)
  - JWT-based authorization
  - Input validation and error handling

- **Note Management**
  - Create, read, update, and delete notes
  - Real-time note management
  - User-specific note isolation

- **Modern UI/UX**
  - Responsive design matching Figma specifications
  - Mobile-friendly interface
  - Clean, professional design with blue wave background
  - Smooth transitions and interactions

## Technology Stack

### Frontend
- **React 19** with JavaScript (JSX)
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with Mongoose
- **jsonwebtoken** for JWT authentication
- **bcryptjs** for password hashing
- **cors** for cross-origin requests
- **dotenv** for environment variables
- **nodemailer** for email (OTP) functionality
- **google-auth-library** for Google OAuth
- **express-validator** for input validation

## Project Structure

```
note-taking-app/
├── backend-nodejs/
│   ├── config/              # Database configuration
│   │   └── database.js
│   ├── controllers/         # Logic for routes
│   ├── middleware/          # Authentication middleware
│   │   └── auth.js
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   └── notes.js
│   ├── utils/               # Utility functions (e.g., OTP store, email service)
│   │   ├── otpStore.js
│   │   └── emailService.js
│   ├── .env                 # Environment variables
│   ├── package.json         # Node.js dependencies
│   └── server.js            # Main Express.js server file
├── frontend/
│   └── note-taking-frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/              # shadcn/ui components
│       │   │   ├── SignUp.jsx       # Signup page component
│       │   │   ├── SignIn.jsx       # Signin page component
│       │   │   ├── OTPVerification.jsx # OTP verification component
│       │   │   └── Dashboard.jsx    # Main dashboard component
│       │   ├── assets/              # Static assets (images, etc.)
│       │   └── App.jsx              # Main App component with routing
│       ├── public/                  # Public assets
│       └── package.json             # Node.js dependencies
└── README.md                        # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (optional - app has fallback support)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd note-taking-app/backend-nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend-nodejs` directory and add the following (replace with your actual values):
   ```
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   MONGODB_URI=mongodb://localhost:27017/note_taking_app
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

   # Email configuration (for OTP - using Mailtrap or similar for development)
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_username
   EMAIL_PASS=your_mailtrap_password
   ```

4. Start the Express.js server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd note-taking-app/frontend/note-taking-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev --host
   ```

The frontend will run on `http://localhost:5173` (or next available port)

### Building for Production

1. Build the frontend:
   ```bash
   cd note-taking-app/frontend/note-taking-frontend
   pnpm run build
   ```

2. The built frontend files will be in the `dist` directory. You can configure your Node.js server to serve these static files.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with email/OTP
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user info

### Notes
- `GET /api/notes/` - Get user=\'s notes
- `POST /api/notes/` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/archive` - Archive/Unarchive note
- `PATCH /api/notes/:id/pin` - Pin/Unpin note

## Configuration

### Environment Variables
- `PORT` - Port for the backend server
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `MONGODB_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email server details for OTP

### Google OAuth Setup
1. Create a project in Google Cloud Console.
2. Enable Google People API.
3. Create OAuth 2.0 Client IDs (Web application type).
4. Add `http://localhost:5173` (or your frontend URL) to Authorized JavaScript origins.
5. Add `http://localhost:5001` (or your backend URL) to Authorized redirect URIs.
6. Update the `GOOGLE_CLIENT_ID` in your `.env` file.

## Features Implemented

✅ User signup with email and OTP flow  
✅ Input validation and error handling  
✅ User login with email/password  
✅ JWT-based authorization  
✅ Welcome page with user information  
✅ Create and delete notes functionality  
✅ Mobile-friendly responsive design  
✅ Design matching Figma specifications  
✅ Google OAuth integration (ready for configuration)  
✅ Modern UI with smooth transitions  
✅ Error handling and user feedback  

## Design Implementation

The frontend closely replicates the provided Figma design with:
- Split-screen layout with form on left, blue wave background on right
- Consistent color scheme and typography
- Responsive design for mobile devices
- Professional form styling with proper validation states
- Smooth transitions and hover effects

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Protected routes requiring authentication

## Development Notes

- The app includes fallback support for MongoDB - it will work even without a MongoDB connection if the `MONGODB_URI` is not correctly set or the database is unavailable.
- OTP functionality now sends actual emails (requires email service configuration in `.env`).
- Google OAuth is implemented but requires proper client ID configuration.
- All API routes are protected with JWT authentication.
- Frontend uses modern React patterns with hooks and functional components.

## Author

Developed as a full-stack assignment demonstrating modern web development practices with React, Express.js/Node.js, and MongoDB.