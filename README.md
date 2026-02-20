# BF6 Clan Application

## Introduction

This application is intended for users who wish to create, manage, and join Battlefield 6 clans within an online community. The main purpose is to provide a centralized platform where players can organize into groups, manage membership, and coordinate across different regions and platforms.

The primary functionalities of the application include:

- **User Authentication** – Secure registration and login system using JWT tokens, allowing users to manage their own accounts.
- **Clan Management** – Users can create, edit, and delete clans with customizable details such as name, tag, description, region, platform, and color.
- **Membership System** – Players can join or leave existing clans, with member tracking and owner-based permissions.
- **Persistent Data Storage** – All clan data is stored in local JSON files, ensuring data persists across sessions without requiring an external database.

By using this application, users will benefit from an organized and intuitive way to find and manage gaming communities for Battlefield 6.

## Design

The application architecture is based on the following technologies:

- **Backend:** Node.js with Express.js – handles API requests, authentication middleware, and file-based data operations.
- **Frontend:** React (with Vite as the build tool) – provides a modern, responsive single-page application interface.
- **Storage:** Local JSON files (`data/clans.json`, `public/data/clans.json`) – stores clan data in a lightweight, file-based format with no external database required.

### Architecture Overview

The application follows a client-server architecture with a RESTful API separating the frontend and backend. The React frontend communicates with the Express backend through HTTP requests, with JWT tokens handling authentication state. The backend reads and writes data directly to JSON files on disk, making the application self-contained and easy to deploy.

### Data Schema

**Clan** (stored in `data/clans.json`)
- `id` (String, unique identifier)
- `name` (String, required)
- `tag` (String, required)
- `owner` (String, owner username)
- `description` (String, required)
- `members` (Number, default: 1)
- `memberList` (Array of objects with `username` and `role`)
- `region` (String, enum: NA East, NA West, EU West, EU Central, Asia Pacific)
- `platform` (String, enum: PC, Xbox, PlayStation, Cross-play)
- `founded` (String, year)
- `image` (String, optional)
- `color` (String, default: '#4A9EFF')
- `activity` (Array of activity log entries)

### Role Hierarchy

Members within a clan have one of the following roles:

- **Leader** – Clan owner, full control over the clan. Only one per clan.
- **Officer** – Elevated permissions, can be promoted to Leader.
- **Member** – Standard member with basic access.

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

### 3. Running the Application

```bash
npm run dev
```

This starts the Vite development server. The application will be available at `http://localhost:5173`.

To start the backend server separately (for API routes):

```bash
npm run server
```

### Project Structure

```
BF6-application/
├── server/              # Backend code
│   ├── index.js         # Express server setup
│   ├── routes/          # API routes
│   │   ├── auth.js      # Authentication endpoints
│   │   ├── clans.js     # Clan CRUD (MongoDB-based, optional)
│   │   └── localClans.js # Clan CRUD (file-based, primary)
│   ├── models/          # Data models
│   ├── middleware/       # Middleware (JWT auth)
│   └── scripts/         # CLI utility scripts
│       ├── addMember.js
│       ├── kickMember.js
│       ├── addClan.js
│       ├── removeClan.js
│       ├── promoteMember.js
│       └── demoteMember.js
├── src/                 # Frontend code (React)
│   ├── App.jsx          # Main app component
│   ├── Clans.jsx        # Clan listing and management
│   ├── ClanPage.jsx     # Individual clan detail page
│   ├── Contact.jsx      # Contact page
│   ├── About.jsx        # About page
│   └── Navbar.jsx       # Navigation bar
├── data/                # JSON data storage
│   └── clans.json       # Clan data
├── public/              # Static assets
│   └── data/
│       └── clans.json   # Public-facing clan data
└── package.json
```

### API Endpoints

**Authentication:**
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user (requires token)

**Clans (file-based):**
- `GET /api/local/clans` – Get all clans
- `POST /api/local/clans` – Create a new clan
- `PUT /api/local/clans/:id` – Update a clan
- `DELETE /api/local/clans/:id` – Delete a clan

### CLI Scripts

The application includes utility scripts for managing clans and members from the command line. All scripts search by clan name, ID, or tag (case-insensitive).

**Clan Management:**

```bash
# Add a new clan
npm run add-clan "Shadow Squad" "[SHDW]" "DarkKnight" "Stealth ops clan" "EU West" "PC"
npm run add-clan "Shadow Squad" "[SHDW]" "DarkKnight" "Stealth ops clan" "EU West" "PC" "#FF5733"

# Remove a clan
npm run remove-clan "Shadow Squad"
npm run remove-clan "[SHDW]"
```

**Member Management:**

```bash
# Add a member to a clan
npm run add-member "Knot" "player2"

# Remove a member from a clan
npm run kick-member "Knot" "player2"
```

**Role Management (Member → Officer → Leader):**

```bash
# Promote a member (Member → Officer → Leader)
npm run promote "Knot" "player2"

# Demote a member (Leader → Officer → Member)
npm run demote "Knot" "player2"
```

Promoting a member to Leader will automatically demote the current leader to Officer. Demoting a Leader requires at least one Officer in the clan to take over.

## Usage

### 1. Authentication and Registration

Users must create an account or log into an existing one to access clan management features. Registration requires a unique username, email, and password. Upon successful login, a JWT token is issued and stored in localStorage, which is automatically included in subsequent API requests via the `Authorization: Bearer <token>` header.

### 2. Interface Navigation

The application features a React-based single-page interface. The main components include a navigation bar for accessing different sections, a clan listing/browsing view, and detailed clan pages showing membership and settings.

### 3. Using Main Functions

- **Clan Creation and Management** – Authenticated users can create new clans by providing a name, tag, description, region, platform, and optional customization (image, color). Clan owners can edit or delete their clans at any time.
- **Joining and Leaving Clans** – Users can browse available clans and join ones that interest them. They can also leave clans they no longer wish to be part of.
- **Data Persistence** – All clan data is stored in local JSON files. Changes made through the API or CLI scripts are written directly to `public/data/clans.json`.

### 4. Usage Examples

**Clan Listing** – The main page displays all available clans with their tag, name, owner, description, region, platform, and founding year. Owners can edit or delete their clans directly from this view.

![Clan Listing](./screenshots/clans-list.png)

**Creating a Clan** – Clicking "+ Create Clan" opens a form where users can enter the clan name, tag, description, region, platform, and a custom color.

![Create Clan Form](./screenshots/create-clan.png)

**Clan Detail Page** – Clicking "View Clan" shows detailed information including an about section, clan stats, quick actions (apply to join, message leader), and a top members list.

![Clan Detail Page](./screenshots/clan-detail.png)

## Conclusions and Next Steps

This application provides a robust solution for Battlefield 6 players looking to organize into clans and manage their communities. Users benefit from a streamlined registration process, intuitive clan management, and persistent file-based data storage. The application can be improved by:

- Adding new functionalities based on user feedback (e.g., clan chat, event scheduling, matchmaking integration).
- Optimizing performance for smoother usage with larger datasets.
- Implementing role-based permissions within clans (e.g., officers, recruiters).
- Adding search and filtering capabilities for browsing clans by region, platform, or member count.
- Deploying to a production environment with proper CI/CD pipelines.

## Prerequisites

- Node.js (v16 or higher)

## License

MIT