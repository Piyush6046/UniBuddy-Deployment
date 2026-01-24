/**
 * Books Page - Clean Design
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllBooks } from "../services/operations/booksApi";
import Pagination from "../components/Books/Pagination";
import BookCard from "../components/Books/BookCard";
import Addbooks from "../components/Books/Addbooks";

const BooksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, pagination, loading } = useSelector((state) => state.book);
  const token = useSelector((state) => state.auth.token);

  const [filters, setFilters] = useState({ department: "", year: "", semister: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadBooks = (page = 1) => {
    dispatch(fetchAllBooks({
      page,
      limit: 9,
      department: filters.department || undefined,
      year: filters.year || undefined,
      semister: filters.semister || undefined,
      search: searchTerm || undefined,
    }));
  };

  useEffect(() => {
    loadBooks(1);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => loadBooks(1), 400);
    return () => clearTimeout(delay);
  }, [filters, searchTerm]);

  const handleResetFilters = () => {
    setFilters({ department: "", year: "", semister: "" });
    setSearchTerm("");
    loadBooks(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Book Exchange</h1>
              <p className="text-[var(--text-muted)] mt-1">Buy and sell books with fellow students</p>
            </div>
            <button
              onClick={() => token ? (setEditData(null), setShowModal(true)) : navigate("/login")}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Sell Your Book
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[var(--text-primary)] font-medium">
              {pagination?.totalBooks || 0} books available
            </span>
          </div>

          {/* Search & Filter */}
          <div className="card p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>

              {/* Reset */}
              <button onClick={handleResetFilters} className="btn btn-ghost">
                Reset
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  className="input select"
                >
                  <option value="">All Departments</option>
                  {["CSE", "IT", "ECE", "EEE", "MECH"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="input select"
                >
                  <option value="">All Years</option>
                  {["1", "2", "3", "4"].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
                <select
                  value={filters.semister}
                  onChange={(e) => setFilters({ ...filters, semister: e.target.value })}
                  className="input select"
                >
                  <option value="">All Semesters</option>
                  {["1", "2"].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
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
        ) : books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => {
                  loadBooks(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h3 className="empty-state-title">No books found</h3>
            <p className="empty-state-desc">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Addbooks
          isEdit={!!editData}
          initialData={editData}
          onClose={() => setShowModal(false)}
          onSuccess={() => loadBooks(pagination.currentPage)}
        />
      )}
    </div>
  );
};

export default BooksPage;
