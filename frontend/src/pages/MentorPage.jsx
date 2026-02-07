/**
 * Mentor Page - Clean Design
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchMentors } from "../services/operations/mentorAPI";
import MentorCard from "../components/Mentor/MentorCard";
import Pagination from "../components/Mentor/Paganation";

const MentorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mentors, pagination, loading } = useSelector((state) => state.mentor);
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({ department: "", company: "", domain: "", year: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const loadMentors = (page = 1) => {
    dispatch(searchMentors({
      page,
      limit: 9,
      department: filters.department || undefined,
      company: filters.company || undefined,
      domain: filters.domain || undefined,
      year: filters.year || undefined,
      keyword: searchTerm || undefined,
    }));
  };

  useEffect(() => {
    loadMentors(1);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => loadMentors(1), 400);
    return () => clearTimeout(delay);
  }, [filters, searchTerm]);

  const handleResetFilters = () => {
    setFilters({ department: "", company: "", domain: "", year: "" });
    setSearchTerm("");
    loadMentors(1);
  };

  const departments = [
    "Computer Engineering", "Information Technology", "Electronics & Telecommunication",
    "Instrumentation", "Civil Engineering", "Mechanical Engineering"
  ];

  const domains = [
    "Web Development", "MERN", "AI/ML", "Cloud Computing", "Data Science",
    "Cybersecurity", "Mobile Development", "DevOps", "UI/UX Design"
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Find a Mentor</h1>
              <p className="text-[var(--text-muted)] mt-1">Connect with experienced seniors for guidance</p>
            </div>
            <button
              onClick={() => token ? navigate("/ApplyMentorForm") : navigate("/login")}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Become a Mentor
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[var(--text-primary)] font-medium">
              {pagination?.total || 0} mentors available
            </span>
          </div>

          {/* Search & Filter */}
          <div className="card p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
              <button onClick={handleResetFilters} className="btn btn-ghost">Reset</button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="input select"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={filters.domain}
                  onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                  className="input select"
                >
                  <option value="">All Domains</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Company..."
                  value={filters.company}
                  onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                  className="input"
                />
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="input select"
                >
                  <option value="">Passout Year</option>
                  {["2021", "2022", "2023", "2024", "2025"].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="loader loader-lg"></div>
          </div>
        ) : mentors && mentors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((mentor) => (
                <MentorCard key={mentor._id} mentor={mentor} />
              ))}
            </div>
            {pagination?.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => {
                    loadMentors(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="empty-state flex flex-col items-center justify-center py-36">
            <svg className="empty-state-icon w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg> 
            <h3 className="empty-state-title">No mentors found</h3>
            <p className="empty-state-desc">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorPage;
