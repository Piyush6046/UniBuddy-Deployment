
import React, { useEffect, useState } from "react";
import {
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../Books/BookCard";
import Addbooks from "../Books/Addbooks";
import ConfirmModel from "../Common/ConfirmModel";
import {
  fetchAllBooks,
  deleteBook,
} from "../../services/operations/booksApi";

const BooksPage = () => {
  const dispatch = useDispatch();
  const { books, pagination, loading, error } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    semister: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  const loadBooks = (page = 1) => {
    dispatch(
      fetchAllBooks({
        page,
        limit: 6,
        department: filters.department || undefined,
        year: filters.year || undefined,
        semister: filters.semister || undefined,
        search: searchTerm || undefined,
      })
    );
  };

  useEffect(() => {
    loadBooks(1);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      loadBooks(1);
    }, 400);
    return () => clearTimeout(delay);
  }, [filters, searchTerm]);

  const handleResetFilters = () => {
    setFilters({ department: "", year: "", semister: "" });
    setSearchTerm("");
    loadBooks(1);
  };

  const handleEditBook = (book) => {
    setEditData(book);
    setShowAddModal(true);
  };

  const handleDeleteBook = (bookId) => {
    setDeleteBookId(bookId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteBook(deleteBookId));
    setShowConfirmDelete(false);
    setDeleteBookId(null);
    loadBooks(pagination.currentPage);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const total = pagination?.totalPages || 1;
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER - Consistent Structure */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Books Management</h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage and browse student books</p>
            </div>
            <button
              onClick={() => {
                setEditData(null);
                setShowAddModal(true);
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Books
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Books <span className="text-[var(--accent)]">({pagination?.totalBooks || 0})</span>
            </h2>
            <div className="border-b border-[var(--border)] mt-2"></div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Search books by name or author..."
                className="input w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="input select flex-1 min-w-[120px]"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {["CSE", "IT", "ECE", "EEE", "MECH"].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                className="input select flex-1 min-w-[100px]"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <option value="">Year</option>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                className="input select flex-1 min-w-[100px]"
                value={filters.semister}
                onChange={(e) => setFilters({ ...filters, semister: e.target.value })}
              >
                <option value="">Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button onClick={handleResetFilters} className="btn btn-ghost">Reset</button>
            </div>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-error mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        )}

        {/* BOOKS GRID */}
        {!loading && !error && books?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                user={user}
                onEdit={() => handleEditBook(book)}
                onDelete={() => handleDeleteBook(book._id)}
                onView={() => console.log("View details:", book)}
              />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && (!books || books.length === 0) && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No books found. Try adjusting filters or search.</p>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => loadBooks(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-ghost p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {generatePageNumbers().map(num => (
              <button
                key={num}
                onClick={() => loadBooks(num)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${num === pagination.currentPage
                    ? 'bg-[var(--accent)] text-black'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => loadBooks(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-ghost p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <Addbooks
          isEdit={!!editData}
          initialData={editData}
          onClose={() => {
            setShowAddModal(false);
            loadBooks(pagination.currentPage);
          }}
        />
      )}

      {/* DELETE CONFIRMATION */}
      {showConfirmDelete && (
        <ConfirmModel
          isOpen={showConfirmDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirmDelete(false);
            setDeleteBookId(null);
          }}
          title="Delete Books"
          message="Are you sure you want to delete this book?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default BooksPage;
