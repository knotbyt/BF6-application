# BF6 Clan Application

A full-stack application for managing Battlefield 6 clans with user authentication and database integration.

## Features

- User authentication with JWT tokens
- Create, edit, and delete clans
- MongoDB database for persistent storage
- RESTful API backend
- React frontend with modern UI

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

**For MongoDB Atlas (Cloud):**
1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Drivers" → Select "Node.js" → Copy the connection string
3. Replace `<password>` with your database user password
4. Replace `<dbname>` with `bf6-clans` (or your preferred database name)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bf6-clans?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bf6-clans
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

For the frontend, create a `.env` file in the root (or use the example):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

- **MongoDB Atlas**: No setup needed, it's cloud-based
- **Local MongoDB**: Make sure MongoDB is running on your system

### 4. Run the Application

**Development mode (with auto-reload):**
```bash
# Terminal 1: Start the backend server
npm run dev:server

# Terminal 2: Start the frontend
npm run dev
```

**Production mode:**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Build and preview frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Clans
- `GET /api/clans` - Get all clans
- `GET /api/clans/:id` - Get a single clan
- `POST /api/clans` - Create a new clan (requires authentication)
- `PUT /api/clans/:id` - Update a clan (requires authentication, owner only)
- `DELETE /api/clans/:id` - Delete a clan (requires authentication, owner only)
- `POST /api/clans/:id/join` - Join a clan (requires authentication)
- `POST /api/clans/:id/leave` - Leave a clan (requires authentication)

## Project Structure

```
BF6-application/
├── server/              # Backend code
│   ├── index.js        # Express server setup
│   ├── models/         # MongoDB models
│   │   ├── User.js
│   │   └── Clan.js
│   ├── routes/         # API routes
│   │   ├── auth.js
│   │   └── clans.js
│   └── middleware/     # Middleware functions
│       └── auth.js
├── src/                # Frontend code
│   ├── components/     # React components
│   ├── context/        # React context (Auth)
│   └── ...
└── package.json
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. When a user logs in or registers, they receive a token that should be included in the `Authorization` header for protected routes:

```
Authorization: Bearer <token>
```

Tokens are stored in localStorage and automatically included in API requests.

## Database Schema

### User
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `createdAt` (Date)

### Clan
- `name` (String, required)
- `tag` (String, required)
- `owner` (ObjectId, ref: User)
- `ownerUsername` (String)
- `description` (String, required)
- `members` (Number, default: 1)
- `memberList` (Array of ObjectIds, ref: User)
- `region` (String, enum)
- `platform` (String, enum)
- `founded` (String)
- `image` (String, optional)
- `color` (String, default: '#4A9EFF')
- `createdAt` (Date)

## Security Notes

- Change the `JWT_SECRET` in production to a strong, random string
- Use environment variables for sensitive data
- Consider adding rate limiting for production
- Implement HTTPS in production
- Add input validation and sanitization

## License

MIT
