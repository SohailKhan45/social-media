# MERN Social Media App

A social media application built using the MERN (MongoDB, Express, React, Node.js) stack. Users can create, update, delete, like, and view posts with images and videos.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Backend Services](#backend-services)
- [Environment Variables](#environment-variables)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization (JWT)
- Create, read, update, and delete posts
- Upload and display images and videos
- Like and unlike posts
- Responsive design

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SohailKhan45/social-media.git
   cd mern-social-media-app
2. Install dependencies
   ⋆ For the backend:
       cd server
       npm install
   * For the frontend:
       cd client
       npm install
3. Set up environment variables
   Create a .env file in the backend directory with the following variables:
   * PORT=5000
   * MONGO_URI=your_mongodb_uri
   * JWT_SECRET=your_jwt_secret
   * CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   * CLOUDINARY_API_KEY=your_cloudinary_api_key
   * CLOUDINARY_API_SECRET=your_cloudinary_api_secret
4. Run the application
    * In the backend directory:  npm run dev
    * In the frontend directory: npm start
    The backend will be running on http://localhost:5000 and the frontend on http://localhost:3000.

5. Technologies Used
    * Frontend: React, Axios, React Router, React Context API, React Toastify
    * Backend: Node.js, Express, MongoDB, Mongoose, Multer, Cloudinary
    * Other: JWT, dotenv, bcryptjs
