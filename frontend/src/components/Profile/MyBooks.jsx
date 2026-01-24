import React, { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch if needed for delete
import BookCard from "../Books/BookCard";
import Addbooks from "../Books/Addbooks";
import ConfirmModel from "../Common/ConfirmModel";
import {
  deleteBook,
} from "../../services/operations/booksApi";

const BooksPage = () => {
  const { user } = useSelector((state) => state.auth);
  // dispatch is needed if confirmDelete calls a redux action or thunk
  const dispatch = useDispatch();
  const books = user?.booksProfile || [];

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete Confirmation
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);

  // Edit Book
  const handleEditBook = (book) => {
    setEditData(book);
    setShowAddModal(true);
  };

  // Delete Book
  const handleDeleteBook = (bookId) => {
    setDeleteBookId(bookId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    // Assuming deleteBook is a thunk that handles API + redux update
    await dispatch(deleteBook(deleteBookId));
    setShowConfirmDelete(false);
    setDeleteBookId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Books</h1>
            <p className="text-[var(--text-muted)] mt-1">
              All books you have uploaded to your profile
            </p>
          </div>

          <button
            onClick={() => {
              setEditData(null);
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        </div>

        {/* BOOKS LIST */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
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
        ) : (
          <div className="text-center py-12 card bg-[var(--bg-card)] border border-[var(--border)]">
            <BookOpen className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)] text-lg mb-2">No books uploaded yet</p>
            <p className="text-[var(--text-muted)] text-sm">
              Click on <span className="text-[var(--accent)] font-medium">Add Book</span> to
              upload your first one
            </p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <Addbooks
          isEdit={!!editData}
          initialData={editData}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => console.log("Reload user books")}
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
          title="Delete Book"
          message="Are you sure you want to delete this book? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default BooksPage;
