# BF6 Clan Application

## Introduction

This application is intended for users who wish to create, manage, and join Battlefield 6 clans within an online community. The main purpose is to provide a centralized platform where players can organize into groups, manage membership, and coordinate across different regions and platforms.

The primary functionalities of the application include:

- **User Authentication** – Secure registration and login system using JWT tokens, allowing users to manage their own accounts.
- **Clan Management** – Users can create, edit, and delete clans with customizable details such as name, tag, description, region, platform, and color.
- **Membership System** – Players can join or leave existing clans, with member tracking and owner-based permissions.
- **Persistent Data Storage** – All user and clan data is stored in a MongoDB database, ensuring data persists across sessions.

By using this application, users will benefit from an organized and intuitive way to find and manage gaming communities for Battlefield 6.

## Design

The application architecture is based on the following technologies:

- **Backend:** Node.js with Express.js – handles API requests, authentication middleware, and database operations.
- **Frontend:** React (with Vite as the build tool) – provides a modern, responsive single-page application interface.
- **Database:** MongoDB (supports both local installation and MongoDB Atlas cloud hosting) – stores user accounts and clan data as document collections.

### Architecture Overview

The application follows a client-server architecture with a RESTful API separating the frontend and backend. The React frontend communicates with the Express backend through HTTP requests, with JWT tokens handling authentication state. The backend interfaces with MongoDB through Mongoose ODM for data modeling and validation.

### Database Schema

**User**
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `createdAt` (Date)

**Clan**
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

### Diagrams

> _Include UML diagrams here as required by your group (class diagram, component diagram, sequence diagram, etc.). You can add images using:_
> ```
> ![Diagram Name](./path-to-diagram.png)
> ```

## Implementation

To download and continue the development of the application, follow these steps:

### 1. Cloning the Repository

```bash
git clone https://github.com/knotbyt/BF6-application.git
cd BF6-application
```

### 2. Installing Dependencies

```bash
npm install
```

### 3. Setting Up Environment Variables

Create a `.env` file in the root directory:

**For MongoDB Atlas (Cloud):**

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Drivers" → Select "Node.js" → Copy the connection string
3. Replace `<password>` with your database user password and `<dbname>` with `bf6-clans`

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bf6-clans?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Local MongoDB:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bf6-clans
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

For the frontend, create a `.env` file in the root:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Starting MongoDB

- **MongoDB Atlas**: No setup needed – it's cloud-based.
- **Local MongoDB**: Ensure MongoDB is running on your system.

### 5. Running the Application

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

### Project Structure

```
BF6-application/
├── server/              # Backend code
│   ├── index.js         # Express server setup
│   ├── models/          # MongoDB models
│   │   ├── User.js
│   │   └── Clan.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   └── clans.js
│   └── middleware/      # Middleware functions
│       └── auth.js
├── src/                 # Frontend code
│   ├── components/      # React components
│   ├── context/         # React context (Auth)
│   └── ...
├── data/                # Data files
├── public/              # Static assets
└── package.json
```

### API Endpoints

**Authentication:**
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user (requires token)

**Clans:**
- `GET /api/clans` – Get all clans
- `GET /api/clans/:id` – Get a single clan
- `POST /api/clans` – Create a new clan (requires authentication)
- `PUT /api/clans/:id` – Update a clan (requires authentication, owner only)
- `DELETE /api/clans/:id` – Delete a clan (requires authentication, owner only)
- `POST /api/clans/:id/join` – Join a clan (requires authentication)
- `POST /api/clans/:id/leave` – Leave a clan (requires authentication)

## Usage

### 1. Authentication and Registration

Users must create an account or log into an existing one to access clan management features. Registration requires a unique username, email, and password. Upon successful login, a JWT token is issued and stored in localStorage, which is automatically included in subsequent API requests via the `Authorization: Bearer <token>` header.

### 2. Interface Navigation

The application features a React-based single-page interface. The main components include a navigation bar for accessing different sections, a clan listing/browsing view, and detailed clan pages showing membership and settings.

### 3. Using Main Functions

- **Clan Creation and Management** – Authenticated users can create new clans by providing a name, tag, description, region, platform, and optional customization (image, color). Clan owners can edit or delete their clans at any time.
- **Joining and Leaving Clans** – Users can browse available clans and join ones that interest them. They can also leave clans they no longer wish to be part of.
- **Data Persistence** – All data is stored in MongoDB. User passwords are hashed for security, and clan membership is tracked through referenced ObjectIds.

### 4. Usage Examples

> _Add screenshots of your application here to illustrate common workflows:_
> - Registering a new account and logging in.
> - Creating a new clan and customizing its details.
> - Browsing, filtering, and joining existing clans.
> - Editing or deleting a clan as the owner.
>
> ```
> ![Screenshot Description](./path-to-screenshot.png)
> ```

## Security Notes

- Change the `JWT_SECRET` in production to a strong, random string.
- Use environment variables for all sensitive data.
- Consider adding rate limiting for production deployment.
- Implement HTTPS in production.
- Add input validation and sanitization.

## Conclusions and Next Steps

This application provides a robust solution for Battlefield 6 players looking to organize into clans and manage their communities. Users benefit from a streamlined registration process, intuitive clan management, and persistent data storage. The application can be improved by:

- Adding new functionalities based on user feedback (e.g., clan chat, event scheduling, matchmaking integration).
- Optimizing performance for smoother usage with larger datasets.
- Implementing role-based permissions within clans (e.g., officers, recruiters).
- Adding search and filtering capabilities for browsing clans by region, platform, or member count.
- Deploying to a production environment with proper CI/CD pipelines.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## License

MIT
