/**
 * Home Page - Premium Minimal Design
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, BookOpen, Coffee, MapPin, Users, Calculator, Building } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const features = [
    {
      title: "Mentorship",
      desc: "Connect with alumni and seniors.",
      link: "/mentor",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Analysis",
      desc: "Track your SGPA/CGPA performance.",
      link: "/pointer-helper",
      icon: <Calculator className="w-6 h-6" />,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Hostels",
      desc: "Allocation & room management.",
      link: "/hostels",
      icon: <Building className="w-6 h-6" />,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: "Books",
      desc: "Buy and sell academic books.",
      link: "/books",
      icon: <BookOpen className="w-6 h-6" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Food",
      desc: "Discover campus food spots.",
      link: "/food",
      icon: <Coffee className="w-6 h-6" />,
      color: "text-pink-500",
      bg: "bg-pink-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-semibold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
            Student Companion
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-6 tracking-tight leading-tight">
            Campus life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-600">simplified.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            One platform for all your academic needs. From hostels to mentorship, we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(token ? '/pointer-helper' : '/signup')}
              className="btn btn-primary btn-lg w-full sm:w-auto group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/hostels')}
              className="btn btn-secondary btn-lg w-full sm:w-auto"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                onClick={() => navigate(feature.link)}
                className="card group cursor-pointer hover:border-[var(--accent)]/30"
              >
                <div className="flex items-start gap-5">
                  <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} transition-transform group-hover:scale-110 duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Minimal */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-center">
            {[
              { label: "Students", value: "4,000+" },
              { label: "Departments", value: "12" },
              { label: "Years", value: "137+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-[var(--border)] mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>© 2024 UniBuddy. Built for students.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;