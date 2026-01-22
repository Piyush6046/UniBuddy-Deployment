import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Coffee, Home as HomeIcon, GraduationCap, Calculator, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from "../components/Common/Footer";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";

// Import assets (Legacy assets kept for now, but styled differently)
import hostel1 from '../assets/dyphostel/hostel1.png';
import hostel2 from '../assets/dyphostel/hostel2.png';
import bookshare from '../assets/Images/bookshare.png';
import food from '../assets/Images/food.png';
import room from '../assets/Images/room.png';

const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [hostel1, hostel2]; // Simplified slider

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <GraduationCap size={32} />,
      title: "Mentorship Program",
      desc: "Connect with VJTI seniors for guidance on academics and placements.",
      link: "/mentor",
      color: "bg-vjti-red"
    },
    {
      icon: <Calculator size={32} />,
      title: "Pointer Helper",
      desc: "Track your SGPA/CGPA with our specialized VJTI academic calculator.",
      link: "/pointer-helper",
      color: "bg-vjti-gold text-richblack-900"
    },
    {
      icon: <HomeIcon size={32} />,
      title: "Hostel Allocation",
      desc: "Digital hostel allotment process for seamless accommodation.",
      link: "/hostels",
      color: "bg-richblack-800"
    },
    {
      icon: <Coffee size={32} />,
      title: "Canteen & Mess",
      desc: "Explore daily menus and tiffin services around Matunga.",
      link: "/food",
      color: "bg-richblack-800"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Library & Exchange",
      desc: "Buy/Sell engineering books and access previous year papers.",
      link: "/books",
      color: "bg-richblack-800"
    },
    {
      icon: <MapPin size={32} />,
      title: "Campus Guide",
      desc: "Navigate the historic VJTI campus and find key locations.",
      link: "/events", // Placeholder
      color: "bg-richblack-800"
    }
  ];

  return (
    <div className="bg-richblack-900 min-h-screen font-inter text-white selection:bg-vjti-gold selection:text-black">

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-richblack-900/80 via-richblack-900/60 to-richblack-900 z-10" />
          <img
            src={heroImages[currentSlide]}
            alt="VJTI Campus"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-5xl px-6">
          <div className="inline-block py-1 px-3 border border-vjti-gold text-vjti-gold rounded-full text-sm font-medium mb-6 animate-fade-in-up">
            EST. 1887 • MATUNGA, MUMBAI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
            Veermata Jijabai <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vjti-gold to-white">
              Technological Institute
            </span>
          </h1>
          <p className="text-richblack-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            The Student Guide Portal — Your central hub for academics, hostel life, and student resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-300">
            <button
              onClick={() => navigate(token ? '/pointer-helper' : '/signup')}
              className="px-8 py-4 bg-vjti-red hover:bg-red-900 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(128,0,0,0.5)] hover:shadow-[0_0_30px_rgba(128,0,0,0.7)] flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-transparent border border-richblack-600 hover:border-vjti-gold hover:text-vjti-gold text-richblack-100 font-bold rounded-lg transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-richblack-800 bg-richblack-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Years of Legacy", value: "137+" },
            { label: "Departments", value: "12" },
            { label: "Students", value: "4000+" },
            { label: "Alumni", value: "25k+" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-vjti-gold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 bg-richblack-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <div className="h-1 w-20 bg-vjti-red mx-auto text-center rounded-full" />
            <p className="mt-4 text-richblack-300">Curated tools for VJTIans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.link)}
                className={`${item.color === 'bg-vjti-gold text-richblack-900' ? 'bg-vjti-gold text-richblack-900' : 'bg-richblack-800 hover:bg-richblack-700 text-white'} 
                p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 group border border-transparent hover:border-richblack-600`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 
                  ${item.color === 'bg-vjti-gold text-richblack-900' ? 'bg-richblack-900 text-vjti-gold' : 'bg-richblack-900 text-vjti-gold'}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  {item.title}
                  <ArrowRight size={16} className={`opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300`} />
                </h3>
                <p className={`${item.color === 'bg-vjti-gold text-richblack-900' ? 'text-richblack-800' : 'text-richblack-300'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legacy Section with Image */}
      <div className="py-20 px-6 bg-gradient-to-b from-richblack-900 to-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-vjti-red rounded-xl opacity-20 blur-xl"></div>
              <img src={bookshare} alt="VJTI Library" className="relative rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Upholding the <br />
              <span className="text-vjti-gold">Legacy of Excellence</span>
            </h2>
            <p className="text-richblack-300 text-lg leading-relaxed">
              For over a century, VJTI has been a beacon of engineering education. The Student Guide connects this rich history with modern convenience, ensuring every student has access to the best resources from Day 1 to graduation.
            </p>
            <button onClick={() => navigate('/about')} className="text-vjti-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
              About Institute <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;