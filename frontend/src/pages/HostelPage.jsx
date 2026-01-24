
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostels } from "../services/operations/hostelAPI";
import HostelCard from "../components/HostelHandles/HostelCard";
import Pagination from "../components/HostelHandles/Paganation";
import ErrorMessage from "../components/HostelHandles/Error";
import NoResults from "../components/HostelHandles/Noresult";
import Footer from "../components/Common/Footer";
import { Search, Home as HomeIcon } from "lucide-react";

/**
 * Hostel Page - Optimized & Simplified
 */
const HostelPage = () => {
  const dispatch = useDispatch();

  const hostelState = useSelector((state) => state.hostel) || {};
  const { hostels = [], pagination = {}, loading = false, error = null } = hostelState;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [userType, setUserType] = useState("user");

  const hostelsPerPage = 9;

  useEffect(() => {
    const initialIndices = {};
    if (hostels && Array.isArray(hostels)) {
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
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, filters]);

  const handleResetFilters = () => {
    setFilters({ gender: "all" });
    setSearchTerm("");
    setCurrentPage(1);
    loadHostels(1, "", { gender: "all" });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadHostels(page, searchTerm, filters);
  };

  const nextImage = (hostelId) => {
    const hostel = Array.isArray(hostels) ? hostels.find((h) => h._id === hostelId) : null;
    if (!hostel || !hostel.images?.length) return;
    const total = hostel.images.length;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hostelId]: (prev[hostelId] + 1) % total,
    }));
  };

  const prevImage = (hostelId) => {
    const hostel = Array.isArray(hostels) ? hostels.find((h) => h._id === hostelId) : null;
    if (!hostel || !hostel.images?.length) return;
    const total = hostel.images.length;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [hostelId]: prev[hostelId] === 0 ? total - 1 : prev[hostelId] - 1,
    }));
  };

  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-inter">
      <div className="container py-8">

        {/* Simplified Header Styled like Food Page */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Accommodations</h1>
              <p className="text-[var(--text-secondary)] mt-1">Verified hostels and PGs near VJTI campus.</p>
            </div>
            <div className="text-sm font-medium px-4 py-2 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]">
              {total} stays available
            </div>
          </div>

          {/* Search & Filter */}
          <div className="card p-4 shadow-sm border-[var(--border)]">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by name, landmark or area..."
                  className="input pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="input select h-11 min-w-[140px]"
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                >
                  <option value="all">Any Gender</option>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                </select>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-ghost h-11 px-6 border border-[var(--border)]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
            <ErrorMessage error={typeof error === 'string' ? error : (error.message || "Something went wrong")} />
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="loader loader-lg"></div>
            <p className="text-[var(--text-muted)] font-medium animate-pulse">Scanning nearby stays...</p>
          </div>
        ) : Array.isArray(hostels) && hostels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <HostelCard
                  key={hostel._id}
                  hostel={hostel}
                  currentImageIndex={currentImageIndex[hostel._id]}
                  onNextImage={nextImage}
                  onPrevImage={prevImage}
                  userType={userType}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <NoResults loading={false} hostelsLength={0} />
            <button
              onClick={handleResetFilters}
              className="mt-6 btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HostelPage;
