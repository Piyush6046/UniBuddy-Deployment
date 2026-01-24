
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  searchMentors,
  deleteMentor,
} from "../../services/operations/mentorAPI";
import ConfirmModel from "../Common/ConfirmModel";
import Pagination from "../Mentor/Paganation";
import ViewMentorModal from "../Mentor/ViewMentorModal";
import EditMentorModal from "../Mentor/EditMentorModal";
import { Plus, Eye, Edit, Trash2, Users, Search } from "lucide-react";

const AdminMentorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mentors, loading, error, pagination } = useSelector(
    (state) => state.mentor
  );

  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 6;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ department: "", company: "", year: "", domain: "" });

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteMentorId, setDeleteMentorId] = useState(null);

  const fetchData = useCallback(() => {
    dispatch(
      searchMentors({
        page: currentPage,
        limit: mentorsPerPage,
        keyword: searchTerm.trim(),
        ...filters,
      })
    );
  }, [dispatch, currentPage, mentorsPerPage, searchTerm, filters]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(delay);
  }, [fetchData]);

  const handleResetFilters = () => {
    setFilters({ department: "", company: "", year: "", domain: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setDeleteMentorId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteMentorId) return;
    dispatch(
      deleteMentor(deleteMentorId, () => {
        toast.success("Mentor deleted successfully");
        setShowConfirmDelete(false);
        setDeleteMentorId(null);
        fetchData();
      })
    );
  };

  const departmentOptions = ["Agricultural Engineering", "Chemical Engineering", "Marine Engineering", "Mechanical Engineering", "Information Technology", "Robotics Engineering", "Industrial Engineering", "Computer Science Engineering"];
  const companyOptions = ["Google", "Microsoft", "Amazon", "TCS", "Infosys"];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER - Consistent Structure */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Mentor Management</h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage mentors and their information</p>
            </div>
            <button
              onClick={() => navigate("/ApplyMentorForm")}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Mentor
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Mentors <span className="text-[var(--accent)]">({pagination?.total || 0})</span>
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
                placeholder="Search mentors by name, email or domain..."
                className="input w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="input select flex-1 min-w-[150px]"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                className="input select flex-1 min-w-[150px]"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              >
                <option value="">All Companies</option>
                {companyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                className="input select flex-1 min-w-[100px]"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              >
                <option value="">Year</option>
                {["2023", "2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              <button onClick={handleResetFilters} className="btn btn-ghost">Reset</button>
            </div>
          </div>
        </div>

        {/* ERROR */}
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

        {/* GRID LAYOUT */}
        {!loading && !error && mentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor._id} className="card group bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all">
                {/* Image Section */}
                <div className="relative h-48 bg-[var(--bg-tertiary)]">
                  <img
                    src={mentor.image?.url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setSelectedMentor(mentor); setEditMode(true); }}
                      className="bg-yellow-500 p-1.5 rounded-full hover:scale-110 shadow-lg text-black"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mentor._id)}
                      className="bg-red-500 p-1.5 rounded-full hover:scale-110 shadow-lg text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute top-2 left-2">
                    <span className="badge badge-primary">{mentor.role === 'mentor' ? 'Mentor' : 'Pending'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col h-full">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1">{mentor.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{mentor.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="badge badge-outline text-[10px]">{mentor.department}</span>
                    <span className="badge badge-default text-[10px]">Passout: {mentor.passoutYear || '2024'}</span>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1">Experience</p>
                    <div className="flex flex-wrap gap-1">
                      {mentor.companies?.length > 0 ? mentor.companies.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] bg-[var(--bg-tertiary)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--text-secondary)]">
                          {c}
                        </span>
                      )) : <span className="text-[10px] text-[var(--text-muted)] italic">No company info</span>}
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-[var(--border)] flex justify-between items-center mt-4">
                    <span className="text-xs text-[var(--text-muted)]">{mentor.phone || "No Phone"}</span>
                    <button
                      onClick={() => { setSelectedMentor(mentor); setViewMode(true); }}
                      className="btn btn-sm btn-ghost text-[var(--accent)]"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && mentors.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No mentors found. Try adjusting filters.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedMentor && viewMode && (
        <ViewMentorModal
          mentor={selectedMentor}
          onClose={() => { setSelectedMentor(null); setViewMode(false); }}
        />
      )}

      {selectedMentor && editMode && (
        <EditMentorModal
          mentor={selectedMentor}
          onClose={() => { setSelectedMentor(null); setEditMode(false); }}
          onSuccess={fetchData}
        />
      )}

      {showConfirmDelete && (
        <ConfirmModel
          isOpen={showConfirmDelete}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          title="Delete Mentor"
          message="Are you sure you want to delete this mentor? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default AdminMentorPage;
