# StudentGuide - Complete Academic Companion Platform

A comprehensive full-stack MERN application designed to solve real-world problems faced by students in their academic journey. StudentGuide is your one-stop solution for finding hostels, food services, buying/selling books, connecting with guides, and getting mentorship - all in one centralized platform.

## 🎯 The Problem & Solution

During my third year of college, I noticed students constantly struggling to find basic necessities like accommodation, affordable food, study materials, and academic guidance. Information was scattered across WhatsApp groups, Facebook pages, and word-of-mouth, making everything inefficient and time-consuming.

**StudentGuide was born to centralize everything students need** - from hostel hunting to mentor connections - making student life simpler and more organized.

## ✨ Key Features

### 🔐 **Secure Authentication System**
- Email/Password registration with OTP verification
- JWT token-based authentication
- Password reset via email
- Secure password encryption using bcrypt
- Session management with token expiration

### 🏠 **Hostel Finder**
- Browse multiple hostel listings with detailed information
- View images, pricing, amenities, and location
- Filter by price range, distance from college, and room type
- Direct contact with hostel owners
- Save favorite hostels to wishlist
- Reviews and ratings from students

### 🍔 **Food Services**
- Discover nearby hotels and restaurants
- Monthly tiffin/meal subscription services
- Browse menus with prices
- Filter by cuisine type, price, and delivery options
- Student discounts and special offers
- Hygiene ratings and reviews

### 📚 **Books Marketplace**
- **Buy Books**: Browse second-hand books by subject, department, or semester
- **Sell Books**: List your used books with images and pricing
- Filter by condition, price, and department
- Chat with sellers directly
- Track your listings and sales
- Save money on expensive textbooks

### 👨‍🏫 **Guide Section**
- Connect with volunteer guides (senior students offering free help)
- Find paid professional tutors for specialized subjects
- Filter by department and expertise
- View guide profiles with ratings and reviews
- Book consultation slots
- Get project guidance and exam preparation help

### 🎓 **Mentor Support System**
- **Department-wise filtering** for all engineering branches
- Connect with seniors and working professionals
- Get academic guidance and career counseling
- Research mentorship and project guidance
- Interview preparation and placement assistance
- View mentor credentials, achievements, and experience
- Schedule one-on-one mentorship sessions

### 👤 **User Profile Dashboard**
- Manage personal and enrollment information
- Track your listings (books, services)
- View saved hostels and subscriptions
- Monitor connected mentors and booked guides
- Update preferences and settings

### 🛡️ **Admin Panel**
- Comprehensive dashboard with analytics
- User management and verification
- Content moderation for all listings
- Approve/reject hostel and service listings
- Monitor platform activity and reports
- Role-based access control

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern component-based UI library
- **Tailwind CSS 3.4** - Utility-first styling for responsive design
- **Vite 5.4** - Lightning-fast build tool and dev server
- **Axios** - HTTP client for API requests
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js 20.x** - JavaScript runtime
- **Express.js 4.19** - Web application framework
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose 8.3** - MongoDB object modeling
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications and OTP delivery
- **express-validator** - Input validation and sanitization
- **cors** - Cross-origin resource sharing

### Security & Authentication
- JWT token-based authentication
- Password encryption with bcrypt (10 salt rounds)
- OTP email verification
- Role-based access control (User/Admin)
- Protected routes with middleware
- Input validation and sanitization

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account for email services
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nikhild1111/StudentGuideClient.git
cd StudentGuideClient
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Admin Credentials
ADMIN_EMAIL=admin@studentguide.com
ADMIN_PASSWORD=your_secure_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

5. **Run the application**

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 🌐 Live Demo

**Live URL:** [https://studentguideclient.onrender.com](https://studentguideclient.onrender.com)

## 📁 Project Structure

```
StudentGuideClient/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login, Signup, OTP verification
│   │   ├── Home/           # Dashboard and service cards
│   │   ├── Hostel/         # Hostel listings and filters
│   │   ├── Food/           # Food services and tiffins
│   │   ├── Books/          # Buy/Sell marketplace
│   │   ├── Profile/        # User dashboard
│   │   └── Admin/          # Admin panel components
│   ├── services/           # API service functions
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── context/            # React context (Auth)
│   └── App.jsx             # Main app component
├── server/
│   ├── models/             # MongoDB schemas
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation, error handling
│   ├── config/             # Database and email config
│   └── server.js           # Express server setup
└── README.md
```

## 🔄 Application Flow

1. **Authentication** → User signs up with email → Receives OTP → Verifies email → Login with JWT token
2. **Dashboard** → View all 6 service sections with quick stats and recent activity
3. **Browse Services** → Select any section (Hostels/Food/Books/Guides/Mentors)
4. **Apply Filters** → Filter by department, year, price, location, etc.
5. **Take Action** → Contact, book, buy, or connect based on the service
6. **Profile Management** → Track listings, subscriptions, and connections
7. **Admin Control** → Admin can manage users, verify listings, and monitor activity

## 🎯 Key Highlights

- **Department-wise filtering** across all sections (CSE, ECE, Mechanical, Civil, etc.)
- **Advanced search and filters** for precise results
- **Email notifications** for OTPs, bookings, and updates
- **Responsive design** works seamlessly on mobile and desktop
- **Secure data handling** with encryption and validation
- **Real-time updates** for availability and listings
- **User-friendly interface** with intuitive navigation

## 🔒 Security Features

- All passwords hashed with bcrypt before storage
- JWT tokens for stateless authentication
- OTP verification via email using Nodemailer
- Protected API routes with authentication middleware
- Admin role-based access control
- Input validation and sanitization on all forms
- CORS configuration for secure cross-origin requests

## 🚢 Deployment

**Frontend:** Deployed on netlify  
**Backend:** Deployed on Render  
**Database:** MongoDB Atlas (Cloud)

### Deployment Steps

1. Push code to GitHub repository
2. Create accounts on Render and MongoDB Atlas
3. Set up MongoDB cluster and get connection string
4. Create web services on Render for frontend and backend
5. Configure environment variables in Render dashboard
6. Deploy and test the application


## 📝 Use Cases

- **First-year students** finding accommodation near campus
- **Budget-conscious students** buying second-hand textbooks
- **Students seeking guidance** connecting with mentors and tutors
- **Service providers** listing hostels, food services
- **Senior students** helping juniors through volunteer guidance
- **Working professionals** giving back through mentorship
