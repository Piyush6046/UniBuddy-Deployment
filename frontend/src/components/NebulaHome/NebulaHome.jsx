/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA HOME PAGE                                     ║
 * ║         Completely custom-designed landing page                   ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './NebulaHome.css';

// Import assets
import hostel1 from '../../assets/dyphostel/hostel1.png';
import hostel2 from '../../assets/dyphostel/hostel2.png';

// Custom Icons
const Icons = {
    ArrowRight: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
    GraduationCap: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    Calculator: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="8" y2="10.01" />
            <line x1="12" y1="10" x2="12" y2="10.01" />
            <line x1="16" y1="10" x2="16" y2="10.01" />
            <line x1="8" y1="14" x2="8" y2="14.01" />
            <line x1="12" y1="14" x2="12" y2="14.01" />
            <line x1="16" y1="14" x2="16" y2="14.01" />
            <line x1="8" y1="18" x2="8" y2="18.01" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
            <line x1="16" y1="18" x2="16" y2="18.01" />
        </svg>
    ),
    Building: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
        </svg>
    ),
    Coffee: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
    ),
    BookOpen: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    ),
    Map: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
    ),
    Star: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Sparkles: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3L14 9L20 9L15 13L17 20L12 16L7 20L9 13L4 9L10 9L12 3Z" />
        </svg>
    ),
};

const NebulaHome = () => {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroImages = [hostel1, hostel2];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: Icons.GraduationCap,
            title: "Mentorship Program",
            desc: "Connect with seniors for guidance on academics, placements, and campus life.",
            link: "/mentor",
            accent: "primary",
        },
        {
            icon: Icons.Calculator,
            title: "Pointer Helper",
            desc: "Calculate your SGPA/CGPA instantly with our specialized academic calculator.",
            link: "/pointer-helper",
            accent: "accent",
            featured: true,
        },
        {
            icon: Icons.Building,
            title: "Hostel Allocation",
            desc: "Digital hostel allotment process for seamless accommodation management.",
            link: "/hostels",
            accent: "secondary",
        },
        {
            icon: Icons.Coffee,
            title: "Canteen & Mess",
            desc: "Explore daily menus, tiffin services, and food options around campus.",
            link: "/food",
            accent: "primary",
        },
        {
            icon: Icons.BookOpen,
            title: "Book Exchange",
            desc: "Buy, sell, or exchange engineering books with fellow students.",
            link: "/books",
            accent: "secondary",
        },
        {
            icon: Icons.Map,
            title: "Campus Navigator",
            desc: "Find your way around campus with our interactive guide.",
            link: "/guide",
            accent: "primary",
        },
    ];

    const stats = [
        { value: "137+", label: "Years of Legacy" },
        { value: "12", label: "Departments" },
        { value: "4000+", label: "Students" },
        { value: "25k+", label: "Alumni Network" },
    ];

    return (
        <div className="nebula-home">
            {/* Background Decorations */}
            <div className="nebula-home__bg-decor">
                <div className="cosmic-orb cosmic-orb--1" />
                <div className="cosmic-orb cosmic-orb--2" />
                <div className="cosmic-orb cosmic-orb--3" />
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className="nebula-hero">
                <div className="nebula-hero__bg">
                    <img
                        src={heroImages[currentSlide]}
                        alt="Campus"
                        className="nebula-hero__bg-image"
                    />
                    <div className="nebula-hero__bg-overlay" />
                </div>

                <div className="nebula-hero__content">
                    <div className="nebula-hero__badge">
                        <Icons.Sparkles />
                        <span>EST. 1887 • MATUNGA, MUMBAI</span>
                    </div>

                    <h1 className="nebula-hero__title">
                        Your Complete
                        <span className="nebula-hero__title-gradient"> Student Portal</span>
                    </h1>

                    <p className="nebula-hero__subtitle">
                        Everything you need for campus life — academics, accommodation,
                        mentorship, and more — all in one place.
                    </p>

                    <div className="nebula-hero__actions">
                        <button
                            onClick={() => navigate(token ? '/pointer-helper' : '/signup')}
                            className="nebula-hero__btn nebula-hero__btn--primary"
                        >
                            <span>Get Started</span>
                            <Icons.ArrowRight />
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="nebula-hero__btn nebula-hero__btn--ghost"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="nebula-hero__scroll">
                        <span>Scroll to explore</span>
                        <div className="nebula-hero__scroll-line">
                            <div className="nebula-hero__scroll-dot" />
                        </div>
                    </div>
                </div>

                {/* Slide Indicators */}
                <div className="nebula-hero__slides">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            className={`nebula-hero__slide-dot ${currentSlide === idx ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                        />
                    ))}
                </div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="nebula-stats">
                <div className="nebula-stats__container">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="nebula-stats__item">
                            <span className="nebula-stats__value">{stat.value}</span>
                            <span className="nebula-stats__label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="nebula-features">
                <div className="nebula-features__container">
                    <div className="nebula-features__header">
                        <span className="nebula-features__eyebrow">Everything You Need</span>
                        <h2 className="nebula-features__title">Curated Tools for Students</h2>
                        <p className="nebula-features__desc">
                            Access all the resources you need to thrive during your academic journey.
                        </p>
                    </div>

                    <div className="nebula-features__grid">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`nebula-feature-card ${feature.featured ? 'nebula-feature-card--featured' : ''}`}
                                    onClick={() => navigate(feature.link)}
                                >
                                    <div className={`nebula-feature-card__icon nebula-feature-card__icon--${feature.accent}`}>
                                        <Icon />
                                    </div>
                                    <h3 className="nebula-feature-card__title">
                                        {feature.title}
                                        <span className="nebula-feature-card__arrow">
                                            <Icons.ArrowRight />
                                        </span>
                                    </h3>
                                    <p className="nebula-feature-card__desc">{feature.desc}</p>
                                    {feature.featured && (
                                        <span className="nebula-feature-card__badge">Popular</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="nebula-cta">
                <div className="nebula-cta__container">
                    <div className="nebula-cta__content">
                        <h2 className="nebula-cta__title">
                            Ready to get started?
                        </h2>
                        <p className="nebula-cta__desc">
                            Join thousands of students already using UniBuddy to navigate campus life.
                        </p>
                        <div className="nebula-cta__actions">
                            <button
                                onClick={() => navigate(token ? '/profile' : '/signup')}
                                className="nebula-cta__btn"
                            >
                                {token ? 'Go to Dashboard' : 'Create Free Account'}
                                <Icons.ArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="nebula-cta__visual">
                        <div className="nebula-cta__rings">
                            <div className="nebula-cta__ring nebula-cta__ring--1" />
                            <div className="nebula-cta__ring nebula-cta__ring--2" />
                            <div className="nebula-cta__ring nebula-cta__ring--3" />
                            <div className="nebula-cta__ring-center">
                                <Icons.Star />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="nebula-footer">
                <div className="nebula-footer__container">
                    <div className="nebula-footer__brand">
                        <div className="nebula-footer__logo">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9" />
                                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>UniBuddy</span>
                        </div>
                        <p className="nebula-footer__tagline">
                            Your complete student portal for campus life.
                        </p>
                    </div>

                    <div className="nebula-footer__links">
                        <div className="nebula-footer__col">
                            <h4>Quick Links</h4>
                            <a href="/hostels">Hostels</a>
                            <a href="/food">Dining</a>
                            <a href="/books">Books</a>
                            <a href="/mentor">Mentors</a>
                        </div>
                        <div className="nebula-footer__col">
                            <h4>Resources</h4>
                            <a href="/pointer-helper">Calculator</a>
                            <a href="/guide">Campus Guide</a>
                            <a href="/admission">Admissions</a>
                        </div>
                        <div className="nebula-footer__col">
                            <h4>Account</h4>
                            <a href="/login">Sign In</a>
                            <a href="/signup">Sign Up</a>
                            <a href="/profile">Profile</a>
                        </div>
                    </div>
                </div>

                <div className="nebula-footer__bottom">
                    <p>© 2024 UniBuddy. Built with 💜 for students.</p>
                </div>
            </footer>
        </div>
    );
};

export default NebulaHome;
