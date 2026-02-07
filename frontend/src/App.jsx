import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { checkAuthOnAppLoad } from "./services/operations/authAPI"
import Home from './pages/Home';
import HostelPage from './pages/HostelPage';
import FoodPage from './pages/FoodPage';
import BooksPage from './pages/BooksPage';
import MentorPage from './pages/MentorPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmail from './pages/VerifyEmail';
import Admin from "./pages/Admin";
import Hostel from "./components/Admin/Hostels";
import ApplyMentorForm from "./components/Mentor/ApplyMentorForm";
import { useNavigate } from 'react-router-dom';
import Profile from './pages/Profile';
import PointerHelper from './pages/PointerHelper';
import MockInterview from './pages/MockInterview';
import InterviewRoom from './pages/InterviewRoom';
import Subscription from './pages/Subscription';
import InterviewHistory from './pages/InterviewHistory';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on interview room pages
  const hideNavbar = location.pathname.startsWith('/interview-room');

  useEffect(() => {
    dispatch(checkAuthOnAppLoad(navigate))
  }, [])

  return (
    <>
      <div className="page-wrapper">
        {/* Conditionally render navbar - hide on interview pages */}
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hostels" element={<HostelPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/hos" element={<Hostel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ApplyMentorForm" element={<ApplyMentorForm />} />
          <Route path="/pointer-helper" element={<PointerHelper />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/interview-room/:assistantId" element={<InterviewRoom />} />
          <Route path="/interview-history" element={<InterviewHistory />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </div>
    </>
  )
}

export default App
