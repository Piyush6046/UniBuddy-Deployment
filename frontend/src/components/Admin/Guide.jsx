
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllGuideApplicants,
  approveGuide,
  deleteGuide,
} from "../../services/operations/guideAPI";
import toast from "react-hot-toast";
import {
  Check,
  Eye,
  Trash2,
  RefreshCcw,
  Plus,
  Filter,
  Search,
  Users,
  UserCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Pagination from "../../components/Guide/Pagination";
import EditGuideModal from "../../components/Guide/EditGuideModal";
import ViewGuideModal from "../../components/Guide/ViewGuideModal";
import FilterPanel from "../../components/Guide/FilterPanel";
import { useNavigate } from "react-router-dom";
import ConfirmModel from "../Common/ConfirmModel";

const AdminGuidePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { guides, students, loading, error } = useSelector((state) => state.guide);

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("guides"); // "guides" or "students"
  const guidesPerPage = 6;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    year: "",
    gender: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Get current data based on active tab
  const currentData = activeTab === "guides" ? guides : students;

  // Fetch data
  const fetchData = () => {
    const payload = { ...filters };
    if (searchTerm) payload.search = searchTerm;
    dispatch(fetchAllGuideApplicants(payload));
  };

  useEffect(() => {
    fetchData();
  }, [filters, searchTerm, dispatch]);

  const handleApprove = (id) => {
    dispatch(
      approveGuide(id, () => {
        toast.success("Guide approved successfully");
        fetchData();
      })
    );
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    dispatch(
      deleteGuide(deleteId, () => {
        toast.success("Person deleted successfully");
        setShowConfirmDelete(false);
        setDeleteId(null);
        fetchData();
      })
    );
  };

  const handleResetFilters = () => {
    setFilters({ department: "", year: "", gender: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * guidesPerPage;
  const currentItems = currentData.slice(startIndex, startIndex + guidesPerPage);
  const totalPages = Math.ceil(currentData.length / guidesPerPage);

  const ActionButton = ({ onClick, className, icon: Icon, title, children }) => (
    <button
      onClick={onClick}
      className={`btn btn-sm ${className} flex items-center gap-1`}
      title={title}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden xl:inline">{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER - Consistent with other Admin pages */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Guide Management</h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage guides and student applications</p>
            </div>
            <button
              onClick={() => navigate("/guideapplication")}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Guide
            </button>
          </div>

          <div>
            <div className="flex gap-6 border-b border-[var(--border)]">
              <button
                onClick={() => handleTabChange("guides")}
                className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 ${activeTab === "guides"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Guides ({guides.length})</span>
              </button>
              <button
                onClick={() => handleTabChange("students")}
                className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 ${activeTab === "students"
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Applied Students ({students.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="card p-4 mb-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn btn-sm flex items-center gap-2 ${showFilters ? 'bg-[var(--accent)] text-black' : 'btn-ghost border border-[var(--border)]'}`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleResetFilters}
                className="btn btn-ghost btn-sm border border-[var(--border)] flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                showFilters={showFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-error mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="card border-[var(--border)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                <tr>
                  {["Person", "Contact", "Academic", "Role", "Actions"].map((head) => (
                    <th key={head} className="px-6 py-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                      <div className="loader mx-auto"></div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((person) => (
                    <tr key={person._id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={person.image || "/default-avatar.png"}
                            alt={person.name}
                            className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{person.name}</p>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-1">{person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--text-primary)]">{person.phone || "-"}</p>
                        <p className="text-xs text-[var(--text-muted)]">{person.city || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[var(--text-primary)]">{person.department || "-"}</p>
                        <p className="text-xs text-[var(--text-muted)]">Year {person.year || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${person.role === "guide"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}>
                          {person.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {activeTab === "students" && (
                            <button
                              onClick={() => handleApprove(person._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                              title="Approve as Guide"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedGuide(person);
                              setViewMode(true);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all shadow-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(person._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No {activeTab} found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedGuide && (
        viewMode ? (
          <ViewGuideModal
            guide={selectedGuide}
            onClose={() => setSelectedGuide(null)}
          />
        ) : (
          <EditGuideModal
            guide={selectedGuide}
            onClose={() => setSelectedGuide(null)}
          />
        )
      )}

      {showConfirmDelete && (
        <ConfirmModel
          isOpen={showConfirmDelete}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          title="Delete Selection"
          message="Are you sure you want to delete this applicant? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default AdminGuidePage;
