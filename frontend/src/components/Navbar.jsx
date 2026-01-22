import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logoutauth } from "../services/operations/authAPI";
import ProfileDropdown from "./Profile/Profiledropdown";
import {
  FaHome,
  FaBed,
  FaUtensils,
  FaBook,
  FaShoppingCart,
  FaQuestionCircle,
  FaUserFriends,
  FaCalculator,
} from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, Landmark } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handlelogout = () => {
    dispatch(logoutauth(navigate));
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { name: 'Home', icon: <FaHome />, path: '/home' },
    { name: 'Hostels', icon: <FaBed />, path: '/hostels' },
    { name: 'Dining', icon: <FaUtensils />, path: '/food' },
    { name: 'Books', icon: <FaBook />, path: '/books' },
    { name: 'Mentors', icon: <FaUserFriends />, path: '/mentor' },
    { name: 'Calc', icon: <FaCalculator />, path: '/pointer-helper' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ name: 'Admin', icon: <FaUserFriends />, path: '/admin' });
  }

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b
          ${scrolled ? 'bg-richblack-900/80 backdrop-blur-md border-richblack-800 shadow-lg py-2' : 'bg-transparent border-transparent py-4'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-vjti-red to-red-900 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Landmark className="text-vjti-gold w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none tracking-tight">VJTI</span>
                <span className="text-xs text-richblack-300 font-medium tracking-widest uppercase">Portal</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden custom-lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                      ${isActive
                        ? 'bg-richblack-800 text-vjti-gold shadow-inner'
                        : 'text-richblack-300 hover:text-white hover:bg-richblack-800/50'}
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {/* Profile Dropdown */}
              <div className="hidden custom-lg:flex">
                <ProfileDropdown />
              </div>

              {/* Mobile Toggle */}
              <div className="custom-lg:hidden flex items-center gap-3">
                <ProfileDropdown />
                <button onClick={toggleMobileMenu} className="text-richblack-200 hover:text-white transition-colors">
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[140] transition-opacity duration-300 lg:hidden
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-richblack-900 border-l border-richblack-800 shadow-2xl z-[150] transition-transform duration-300 ease-out transform lg:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button onClick={toggleMobileMenu} className="p-2 hover:bg-richblack-800 rounded-lg transition-colors">
              <X size={24} className="text-richblack-400" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-vjti-red/10 text-vjti-gold border border-vjti-red/20'
                      : 'text-richblack-300 hover:bg-richblack-800 hover:text-white'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-richblack-800">
            <p className="text-xs text-center text-richblack-500 uppercase tracking-widest">
              VJTI Student Portal © 2024
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
