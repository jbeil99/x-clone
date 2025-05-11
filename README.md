<div align="center">

# X-Clone

<img src="https://github.com/jbeil99/x-clone/raw/main/frontend/src/assets/x-logo.png" alt="X Logo" width="100" height="100">

**A full-featured Twitter/X clone built with Django and React**

![Django](https://img.shields.io/badge/Django-5.2-green.svg)
![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![DRF](https://img.shields.io/badge/DRF-3.16.0-red.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Admin Dashboard](#-admin-dashboard)
- [Contributing](#-contributing)
- [License](#-license)

## 🔍 Overview

X-Clone is a comprehensive social media platform that replicates the core functionality of Twitter/X. The application features a modern, responsive UI built with React and a robust Django backend with real-time capabilities powered by Django Channels and WebSockets.

## ✨ Features

### Core Features
- **Authentication System**
  - JWT-based authentication with Djoser
  - Social login integration
  - Password reset and account management

### Content Management
- **Tweet System**
  - Create, read, update, and delete tweets
  - Like, retweet, and reply functionality
  - Bookmark and pin tweets
  - Media uploads (images and videos)
  - Rich text formatting

### Social Features
- **User Interactions**
  - Follow/unfollow users
  - View follower and following lists
  - User profiles with customization options
  - Real-time notifications

### Messaging System
- **Real-time Chat**
  - Direct messaging between users
  - Real-time message delivery with WebSockets
  - Unread message counter
  - Message status indicators

### Community Features
- **Communities**
  - Create and join communities
  - Public and private community options
  - Role-based permissions (owner, moderator, member)
  - Community-specific posts and discussions

### AI Integration
- **AI Chatbot**
  - Embedded AI assistant powered by Google Generative AI
  - Natural language interaction

### Admin Features
- **Admin Dashboard**
  - Comprehensive statistics and analytics
  - User management tools
  - Content moderation
  - System settings and configuration

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router 7** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time communication
- **React Query** - Data fetching
- **Zod** - Form validation

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API development
- **Django Channels** - WebSocket support
- **Djoser & Simple JWT** - Authentication
- **SQLite** - Development database
- **Google Generative AI** - AI integration

### DevOps
- **Docker** - Containerization (optional)
- **Git** - Version control

## 🏗 System Architecture

The application follows a modern client-server architecture:

- **Frontend**: Single-page application built with React
- **Backend**: RESTful API with Django REST Framework
- **Real-time Communication**: WebSockets via Django Channels
- **Authentication**: JWT-based auth flow with token refresh
- **Data Storage**: Relational database with Django ORM

## 📸 Screenshots

*[Add screenshots of your application here]*

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/jbeil99/x-clone.git
   cd x-clone
   ```

2. **Backend Setup**

   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env file with your configuration
   
   # Apply migrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   # or
   yarn install
   ```

## 💻 Usage

1. **Start the backend server**

   ```bash
   # From the project root
   chmod +x runserver.sh
   ./runserver.sh
   ```

2. **Start the frontend development server**

   ```bash
   # From the frontend directory
   npm run dev
   # or
   yarn dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin interface: http://localhost:8000/admin/
   - Admin dashboard: http://localhost:3000/admin

## 📚 API Documentation

The API documentation is available at `/api/docs/` when the server is running.

Key API endpoints include:

- **Authentication**: `/api/auth/`
- **Users**: `/api/users/`
- **Tweets**: `/api/tweets/`
- **Profiles**: `/api/profiles/`
- **Communities**: `/api/communities/`
- **Messages**: `/api/messages/`
- **Notifications**: `/api/notifications/`

## 👑 Admin Dashboard

The admin dashboard provides a comprehensive interface for managing the application. It includes:

- Dashboard overview with statistics and charts
- User management section
- Content reports and moderation tools
- System settings and configuration

Access the admin dashboard at: http://localhost:3000/admin

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

Made with ❤️ by [Your Team Name]

</div>
