# Rithus Beauty Hub

A modern, premium full-stack beauty parlour website built with React.js, Node.js, Express, and MongoDB.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcrypt

## Features
- **Public**:
  - Stunning modern hero section with animations
  - Services listing with WhatsApp booking integration
  - Masonry gallery with category filters
  - Booking form integrated with WhatsApp
- **Admin**:
  - Secure JWT authentication
  - Dashboard to view stats
  - Manage services, gallery, and bookings

## Local Development

### 1. Clone & Setup
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run the App
```bash
# Run Server (from /server)
node index.js

# Run Client (from /client)
npm run dev
```

## Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas.
2. Allow access from anywhere (IP: `0.0.0.0/0`).
3. Get the connection string and replace `<password>` with your database user password.

### Backend (Render)
1. Push your code to GitHub.
2. Sign in to Render (render.com) and create a new **Web Service**.
3. Connect your GitHub repo.
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `node index.js`
7. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`).
8. Deploy!

### Frontend (Vercel)
1. Sign in to Vercel (vercel.com) and create a new Project.
2. Connect your GitHub repo.
3. Framework Preset: `Vite`
4. Root Directory: `client`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. In Vercel environment variables, set the base API URL if you configured Axios to use environment variables.
8. Deploy!

## API Endpoints

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Initial admin creation

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create a service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Add a gallery image
- `DELETE /api/gallery/:id` - Delete an image

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a booking
- `PUT /api/bookings/:id` - Update a booking status
- `DELETE /api/bookings/:id` - Delete a booking
