/**
 * Clean Navbar with Theme Toggle
 */

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logoutauth } from "../services/operations/authAPI";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logoutauth(navigate));
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Hostels', path: '/hostels' },
    { name: 'Food', path: '/food' },
    { name: 'Books', path: '/books' },
    { name: 'Mentors', path: '/mentor' },
    { name: 'Calculator', path: '/pointer-helper' },
    { name: 'Interview', path: '/mock-interview' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-card)] border-b border-[var(--border)] z-50">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>UniBuddy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${isActive(link.path)
                  ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {token ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="avatar avatar-sm">
                    {user?.image ? (
                      <img src={user.image} alt="" />
                    ) : (
                      user?.firstName?.[0] || 'U'
                    )}
                  </div>
                  <span className="hidden sm:block text-sm text-[var(--text-secondary)]">{user?.firstName}</span>
                  <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg z-50 overflow-hidden ring-1 ring-black/5">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                      <p className="font-medium text-[var(--text-primary)]">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded-md transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Your Profile
                      </Link>
                      <Link to="/interview-history" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] rounded-md transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Interview History
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors text-left">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 w-72 h-full bg-[var(--bg-card)] border-l border-[var(--border)] z-50 transform transition-transform duration-200 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-[var(--text-primary)] font-medium">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {token && user && (
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="avatar avatar-md">
                {user?.image ? (
                  <img src={user.image} alt="" />
                ) : (
                  user?.firstName?.[0] || 'U'
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2.5 text-sm rounded-md transition-colors ${isActive(link.path)
                ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggle in Mobile */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
          >
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            {isDark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
          {token ? (
            <div className="space-y-2">
              <Link to="/profile" className="btn btn-secondary w-full">Profile</Link>
              <button onClick={handleLogout} className="btn btn-danger w-full">Sign Out</button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" className="btn btn-secondary w-full">Sign In</Link>
              <Link to="/signup" className="btn btn-primary w-full">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
