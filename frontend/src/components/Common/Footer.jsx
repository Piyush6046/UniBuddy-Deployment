/**
 * Footer - Clean Design
 */

import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border)] py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            UniBuddy
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-[var(--text-muted)]">
            <a href="/hostels" className="hover:text-[var(--text-primary)] transition-colors">Hostels</a>
            <a href="/food" className="hover:text-[var(--text-primary)] transition-colors">Food</a>
            <a href="/books" className="hover:text-[var(--text-primary)] transition-colors">Books</a>
            <a href="/mentor" className="hover:text-[var(--text-primary)] transition-colors">Mentors</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">© 2024 UniBuddy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;