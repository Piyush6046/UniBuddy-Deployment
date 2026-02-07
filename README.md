# 🎓 UniBuddy - AI-Powered Student Ecosystem

UniBuddy is a comprehensive, all-in-one platform designed to simplify campus life for students. From **AI-driven voice interviews** to **books marketplaces** and **SGPA calculators**, UniBuddy centralizes everything a student needs in a modern, professional interface.

---

## 🎤 Hero Feature: AI Mock Interviewer
The core of UniBuddy is its state-of-the-art **AI Interview System**, built to help students ace their placements.

- **Voice-to-Voice Interaction**: Real-time natural conversations using Vapi.ai and Azure Voice.
- **Dynamic Context**: AI reads your uploaded **Resume (PDF)** and the **Job Description** to ask tailored, role-specific questions.
- **Automatic Scoring**: Instant feedback with scores (1-10) for Technical Skills, Communication, and Overall Performance.
- **Detailed Analysis**: Comprehensive performance summary, identifying strengths and areas for improvement.
- **Session History**: Track your progress over time with a complete history of all your interviews.

---

## 🚀 Key Features

### 🏢 Campus Services
- **Hostel Booking**: Seamlessly find and book campus accommodation.
- **Food & Dining**: Explore local food spots, canteens, and daily mess menus.
- **Mentorship**: Connect with experienced seniors and alumni for personalized guidance.

### 📚 Marketplace
- **Books Exchange**: A student-to-student marketplace to buy and sell academic books within the campus.

### 📊 Academic Tools
- **Pointer Helper**: A specialized SGPA/CGPA calculator with target prediction features.
- **Resume Parsing**: Automatic extraction of skills and experience from PDF resumes using AI.

### 🔐 Security & Admin
- **JWT Authentication**: Secure login/signup with email OTP verification.
- **Admin Dashboard**: Full control over hostels, mentor applications, and marketplace listings.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Vapi.ai SDK (Voice Interface)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- OpenAI GPT-4 & Google Gemini (AI Logic)
- Cloudinary (Image/Asset Hosting)
- Affinda (Advanced Resume Parsing)

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/unibuddy.git
cd unibuddy
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=4000
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
VAPI_PRIVATE_KEY=your_vapi_private_key
GEMINI_API_KEY=your_gemini_key
```
Run the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```
Run the client:
```bash
npm run dev
```

---

## 📈 Impact
UniBuddy bridges the gap between traditional campus life and modern technology, providing students with tools that were previously fragmented or unavailable. It specifically targets **Career Readiness** through its AI interview module, making it a powerful tool for final-year students.

---

## 📄 License
This project is licensed under the ISC License.

---

**Built with 💜 for the Student Community.**
