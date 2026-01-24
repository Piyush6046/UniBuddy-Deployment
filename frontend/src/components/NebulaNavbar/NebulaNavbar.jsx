/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA NAVBAR COMPONENT                              ║
 * ║         Completely custom-designed navigation                     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logoutauth } from "../../services/operations/authAPI";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './NebulaNavbar.css';

// Custom SVG Icons (no external icon library)
const Icons = {
    Home: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    ),
    Hostel: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
            <path d="M12 4v6" />
            <path d="M2 20h20" />
            <path d="M18 20v-4" />
            <path d="M6 20v-4" />
        </svg>
    ),
    Dining: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
    ),
    Books: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" />
            <path d="M8 11h6" />
        </svg>
    ),
    Mentors: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Calc: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="8" y2="10" />
            <line x1="12" y1="10" x2="12" y2="10" />
            <line x1="16" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="8" y2="14" />
            <line x1="12" y1="14" x2="12" y2="14" />
            <line x1="16" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="8" y2="18" />
            <line x1="12" y1="18" x2="12" y2="18" />
            <line x1="16" y1="18" x2="16" y2="18" />
        </svg>
    ),
    Admin: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
    ),
    Close: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    User: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    LogOut: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    Login: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
    ),
    ChevronDown: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
};

const NebulaNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(logoutauth(navigate));
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

    const menuItems = [
        { name: 'Home', icon: Icons.Home, path: '/home' },
        { name: 'Hostels', icon: Icons.Hostel, path: '/hostels' },
        { name: 'Dining', icon: Icons.Dining, path: '/food' },
        { name: 'Books', icon: Icons.Books, path: '/books' },
        { name: 'Mentors', icon: Icons.Mentors, path: '/mentor' },
        { name: 'Calculator', icon: Icons.Calc, path: '/pointer-helper' },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ name: 'Admin', icon: Icons.Admin, path: '/admin' });
    }

    return (
        <>
            {/* Main Navbar */}
            <nav className={`nebula-navbar ${isScrolled ? 'nebula-navbar--scrolled' : ''}`}>
                <div className="nebula-navbar__container">
                    {/* Logo */}
                    <Link to="/home" className="nebula-navbar__logo">
                        <div className="nebula-navbar__logo-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
                                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nebula-navbar__logo-text">
                            <span className="nebula-navbar__logo-title">UniBuddy</span>
                            <span className="nebula-navbar__logo-subtitle">Student Portal</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nebula-navbar__nav">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/home' && location.pathname.startsWith(item.path));

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`nebula-navbar__link ${isActive ? 'nebula-navbar__link--active' : ''}`}
                                >
                                    <Icon />
                                    <span>{item.name}</span>
                                    {isActive && <span className="nebula-navbar__link-indicator" />}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="nebula-navbar__actions">
                        {token ? (
                            <div className="nebula-navbar__profile">
                                <button
                                    className="nebula-navbar__profile-btn"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="nebula-navbar__avatar">
                                        {user?.image ? (
                                            <img src={user.image} alt={user.firstName} />
                                        ) : (
                                            <span>{user?.firstName?.[0] || 'U'}</span>
                                        )}
                                        <span className="nebula-navbar__avatar-status" />
                                    </div>
                                    <span className="nebula-navbar__profile-name">{user?.firstName || 'User'}</span>
                                    <Icons.ChevronDown />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="nebula-navbar__dropdown-overlay"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <div className="nebula-navbar__dropdown">
                                            <div className="nebula-navbar__dropdown-header">
                                                <div className="nebula-navbar__dropdown-avatar">
                                                    {user?.image ? (
                                                        <img src={user.image} alt={user.firstName} />
                                                    ) : (
                                                        <span>{user?.firstName?.[0] || 'U'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="nebula-navbar__dropdown-name">
                                                        {user?.firstName} {user?.lastName}
                                                    </p>
                                                    <p className="nebula-navbar__dropdown-email">{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="nebula-navbar__dropdown-divider" />
                                            <Link
                                                to="/profile"
                                                className="nebula-navbar__dropdown-item"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Icons.User />
                                                <span>My Profile</span>
                                            </Link>
                                            <button
                                                className="nebula-navbar__dropdown-item nebula-navbar__dropdown-item--danger"
                                                onClick={handleLogout}
                                            >
                                                <Icons.LogOut />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="nebula-navbar__auth-btns">
                                <Link to="/login" className="nebula-navbar__btn nebula-navbar__btn--ghost">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="nebula-navbar__btn nebula-navbar__btn--primary">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="nebula-navbar__mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Icons.Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`nebula-mobile-overlay ${isMobileMenuOpen ? 'nebula-mobile-overlay--active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div className={`nebula-mobile-menu ${isMobileMenuOpen ? 'nebula-mobile-menu--open' : ''}`}>
                <div className="nebula-mobile-menu__header">
                    <h2 className="nebula-mobile-menu__title">Menu</h2>
                    <button
                        className="nebula-mobile-menu__close"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <Icons.Close />
                    </button>
                </div>

                {/* User info in mobile */}
                {token && user && (
                    <div className="nebula-mobile-menu__user">
                        <div className="nebula-mobile-menu__avatar">
                            {user?.image ? (
                                <img src={user.image} alt={user.firstName} />
                            ) : (
                                <span>{user?.firstName?.[0] || 'U'}</span>
                            )}
                        </div>
                        <div>
                            <p className="nebula-mobile-menu__user-name">{user?.firstName} {user?.lastName}</p>
                            <p className="nebula-mobile-menu__user-email">{user?.email}</p>
                        </div>
                    </div>
                )}

                <nav className="nebula-mobile-menu__nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/home' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nebula-mobile-menu__link ${isActive ? 'nebula-mobile-menu__link--active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Icon />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="nebula-mobile-menu__footer">
                    {token ? (
                        <>
                            <Link
                                to="/profile"
                                className="nebula-mobile-menu__footer-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Icons.User />
                                <span>My Profile</span>
                            </Link>
                            <button
                                className="nebula-mobile-menu__footer-link nebula-mobile-menu__footer-link--danger"
                                onClick={handleLogout}
                            >
                                <Icons.LogOut />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="nebula-mobile-menu__auth">
                            <Link
                                to="/login"
                                className="nebula-mobile-menu__auth-btn nebula-mobile-menu__auth-btn--ghost"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="nebula-mobile-menu__auth-btn nebula-mobile-menu__auth-btn--primary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                    <p className="nebula-mobile-menu__copyright">
                        © 2024 UniBuddy Portal
                    </p>
                </div>
            </div>
        </>
    );
};

export default NebulaNavbar;
