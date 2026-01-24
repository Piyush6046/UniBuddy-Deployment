import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { checkAuthOnAppLoad } from "./services/operations/authAPI"
import Home from './pages/Home';
import AdmissionPage from './pages/AdmissionPage';
import HostelPage from './pages/HostelPage';
import FoodPage from './pages/FoodPage';
import BooksPage from './pages/BooksPage';
import GroceryPage from './pages/GroceryPage';
import GuidePage from './pages/GuidePage';
import MentorPage from './pages/MentorPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyEmail from './pages/VerifyEmail';
import Admin from "./pages/Admin";
import Hostel from "./components/Admin/Hostels";
import GuideApplication from "./components/Guide/Guideapplication"
import ApplyMentorForm from "./components/Mentor/ApplyMentorForm";
import { useNavigate } from 'react-router-dom';
import Profile from './pages/Profile';
import PointerHelper from './pages/PointerHelper';
import MockInterview from './pages/MockInterview';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuthOnAppLoad(navigate))
  }, [])

  return (
    <>
      <div className="page-wrapper">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/hostels" element={<HostelPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/grocery" element={<GroceryPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/mentor" element={<MentorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/hos" element={<Hostel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/guideapplication" element={<GuideApplication />} />
          <Route path="/ApplyMentorForm" element={<ApplyMentorForm />} />
          <Route path="/pointer-helper" element={<PointerHelper />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  )
}

export default App
