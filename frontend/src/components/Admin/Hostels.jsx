
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostels, deleteHostel } from "../../services/operations/hostelAPI";

// Components
import SearchAndFilterBar from "./Parts/Searchfillter";
import HostelCard from "../HostelHandles/HostelCard";
import Pagination from "../HostelHandles/Paganation";
import AddHostel from "../HostelHandles/AddEdit";
import ConfirmModel from "../Common/ConfirmModel";
import { Plus, Home, Search } from "lucide-react";

const HostelPage = () => {
  const dispatch = useDispatch();
  const { hostels, pagination, loading, error } = useSelector(
    (state) => state.hostel
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ gender: "all" });

  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 6;

  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [userType] = useState("admin");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const initialIndices = {};
    if (hostels) {
      hostels.forEach((h) => {
        initialIndices[h._id] = 0;
      });
      setCurrentImageIndex(initialIndices);
    }
  }, [hostels]);

  useEffect(() => {
    loadHostels(1, searchTerm, filters);
  }, [dispatch]);

  const loadHostels = (page = 1, search = "", appliedFilters = filters) => {
    dispatch(
      fetchHostels({
        page,
        limit: hostelsPerPage,
        search,
        type: appliedFilters.gender,
      })
    );
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      loadHostels(1, searchTerm, filters);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, filters]);

  const handleResetFilters = () => {
    setFilters({ gender: "all" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadHostels(page, searchTerm, filters);
  };

  const nextImage = (hostelId) => {
    const hostel = hostels.find((h) => h._id === hostelId);
    if (!hostel || !hostel.images.length) return;
    const total = hostel.images.length;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hostelId]: (prev[hostelId] + 1) % total,
    }));
  };

  const prevImage = (hostelId) => {
    const hostel = hostels.find((h) => h._id === hostelId);
    if (!hostel || !hostel.images.length) return;
    const total = hostel.images.length;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hostelId]: prev[hostelId] === 0 ? total - 1 : prev[hostelId] - 1,
    }));
  };

  const handleEdit = (hostel) => {
    setEditData(hostel);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    dispatch(deleteHostel(deleteId, () => loadHostels(currentPage, searchTerm, filters)));
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const total = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER - Matches User Preference Structure */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Hostel Management</h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage hostel listings and details</p>
            </div>
            <button
              onClick={() => {
                setEditData(null);
                setShowAddModal(true);
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Hostel
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Listings <span className="text-[var(--accent)]">({total})</span>
            </h2>
            <div className="border-b border-[var(--border)] mt-2"></div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Search hostels..."
                className="input w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input select flex-1 max-w-[200px]"
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
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

        {/* GRID */}
        {!loading && !error && hostels && hostels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <HostelCard
                key={hostel._id}
                hostel={hostel}
                currentImageIndex={currentImageIndex[hostel._id]}
                onNextImage={nextImage}
                onPrevImage={prevImage}
                userType={userType}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && (!hostels || hostels.length === 0) && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No hostels found.
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && hostels && hostels.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination?.totalPages || 0}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {showAddModal && (
        <AddHostel
          isEdit={!!editData}
          initialData={editData}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => loadHostels(currentPage, searchTerm, filters)}
        />
      )}

      {showConfirmDelete && (
        <ConfirmModel
          isOpen={showConfirmDelete}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
          title="Delete Hostel"
          message="Are you sure you want to delete this hostel?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default HostelPage;
