import React from 'react';
import { toast } from 'react-hot-toast';

const MentorCard = ({ mentor }) => {
  const defaultImage = "https://via.placeholder.com/150x150?text=Mentor";

  const handleDownloadResume = () => {
    if (!mentor.resume?.url) {
      toast.error("Resume not available");
      return;
    }
    window.open(mentor.resume.url, "_blank");
    toast.success("Opening Resume");
  };

  const handleContact = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    if (mentor.phone) {
      window.open(`tel:${mentor.phone}`);
    }
  };

  return (
    <div className="card group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[var(--bg-tertiary)] rounded-lg overflow-hidden mb-4 -mx-1 -mt-1">
        <img
          src={mentor.image?.url || defaultImage}
          alt={mentor.name}
          className="w-full h-full object-cover object-top"
        />
        <span className="absolute top-2 right-2 badge badge-primary">Mentor</span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="text-center">
          <h3 className="font-semibold text-[var(--text-primary)]">{mentor.name}</h3>
          <p className="text-sm text-[var(--text-muted)]">{mentor.email}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5">
          <span className="badge badge-primary">{mentor.domain}</span>
          <span className="badge badge-default">{mentor.department}</span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-sm text-center">
          <p className="text-[var(--text-secondary)]">
            <span className="text-[var(--text-muted)]">Passout Year:</span> {mentor.passoutYear}
          </p>
        </div>

        {/* Companies */}
        {mentor.companies && mentor.companies.length > 0 && (
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">Companies</p>
            <div className="flex flex-wrap justify-center gap-1">
              {mentor.companies.slice(0, 3).map((company, i) => (
                <span key={i} className="text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded text-[var(--text-secondary)]">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]">
        <button onClick={handleDownloadResume} className="btn btn-secondary btn-sm">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Resume
        </button>
        <button onClick={handleContact} className="btn btn-primary btn-sm">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Contact
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
