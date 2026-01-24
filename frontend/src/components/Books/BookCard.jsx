/**
 * Book Card - Clean Design
 */

import React, { useState } from "react";
import { toast } from "react-hot-toast";

const BookCard = ({ book, user, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const defaultImage = "https://via.placeholder.com/300x200?text=Book";

  const images = book.images && Array.isArray(book.images) && book.images.length > 0
    ? book.images
    : [{ url: defaultImage }];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleContact = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    if (book.contact) {
      window.open(`tel:${book.contact}`);
    }
  };

  return (
    <div className="card group">
      {/* Admin Controls */}
      {user?.role === "admin" && (
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          <button onClick={() => onEdit?.(book)} className="btn btn-sm btn-secondary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button onClick={() => onDelete?.(book._id)} className="btn btn-sm btn-danger">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-[var(--bg-tertiary)] rounded-lg overflow-hidden mb-4 -mx-1 -mt-1">
        <img
          src={images[currentImageIndex]?.url || defaultImage}
          alt={book.name}
          className="w-full h-full object-cover"
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">{book.name}</h3>
          {book.email && (
            <p className="text-xs text-[var(--text-muted)] truncate">{book.email}</p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-primary">{book.department}</span>
          <span className="badge badge-default">Year {book.year}</span>
          <span className="badge badge-default">Sem {book.semister}</span>
        </div>

        {/* Books List */}
        {book.booksname && book.booksname.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-[var(--text-muted)]">Books included:</p>
            <div className="flex flex-wrap gap-1">
              {book.booksname.slice(0, 3).map((name, i) => (
                <span key={i} className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                  {name}
                </span>
              ))}
              {book.booksname.length > 3 && (
                <span className="text-xs text-[var(--text-muted)]">+{book.booksname.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <span className="text-lg font-bold text-[var(--accent)]">₹{book.price}</span>
          <button onClick={handleContact} className="btn btn-primary btn-sm">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
