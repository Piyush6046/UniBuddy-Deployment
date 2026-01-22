import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHostels } from "../services/operations/hostelAPI";
import SearchAndFilterBar from "../components/Admin/Parts/Searchfillter"; // Note: Typo in original file name 'Searchfillter' preserved to avoid break
import HostelCard from "../components/HostelHandles/HostelCard";
import Pagination from "../components/HostelHandles/Paganation";
import ErrorMessage from "../components/HostelHandles/Error";
import NoResults from "../components/HostelHandles/Noresult";
import Footer from "../components/Common/Footer";
import { Home, Filter } from "lucide-react";

const HostelPage = () => {
  const dispatch = useDispatch();
  const { hostels, pagination, loading, error } = useSelector(
    (state) => state.hostel
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [userType, setUserType] = useState("user"); // 'user' or 'admin'

  const hostelsPerPage = 6;

  // Initialize image indices for hostels
  useEffect(() => {
    const initialIndices = {};
    if (hostels && hostels.length > 0) {
      hostels.forEach((h) => {
        initialIndices[h._id] = 0;
      });
      setCurrentImageIndex(initialIndices);
    }
  }, [hostels]);

  // Initial fetch
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

  // Fetch when searchTerm or filters change
  useEffect(() => {
    setCurrentPage(1);
    loadHostels(1, searchTerm, filters);
  }, [searchTerm, filters]);

  // Reset filters
  const handleResetFilters = () => {
    const reset = { gender: "all" };
    setFilters(reset);
    setSearchTerm("");
    setCurrentPage(1);
    loadHostels(1, "", reset);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadHostels(page, searchTerm, filters);
  };

  // Image navigation
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

  // Admin actions
  const handleEdit = (hostel) => {
    console.log("Edit hostel:", hostel);
  };

  const handleDelete = (hostelId) => {
    console.log("Delete hostel:", hostelId);
  };

  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-richblack-900 text-white font-inter">
      {/* VJTI Themed Banner */}
      <div className="bg-gradient-to-r from-richblack-900 to-richblack-800 border-b border-richblack-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-richblack-800 rounded-full mb-4 shadow-lg border border-richblack-700">
            <Home className="w-6 h-6 text-vjti-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Find Your <span className="text-vjti-gold">Ideal Stay</span>
          </h1>
          <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
            Discover verified hostels near VJTI campus with real reviews, service details, and direct contact options.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* Stats Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-richblack-800/50 p-4 rounded-xl border border-richblack-700 backdrop-blur-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Available Hostels <span className="bg-vjti-gold text-richblack-900 px-2 py-0.5 rounded text-sm font-bold">{total}</span>
          </h2>
          {/* <div className="text-sm text-richblack-400">Showing page {currentPage} of {totalPages}</div> */}
        </div>

        {/* SEARCH & FILTER */}
        <div className="mb-10">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleResetFilters={handleResetFilters}
            filterKeys={["gender"]}
            options={{
              gender: ["girls", "boys"]
            }}
            debounceDelay={400}
          />
        </div>

        {/* Error Message */}
        <ErrorMessage error={error} />

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* No results message */}
        <NoResults loading={loading} hostelsLength={hostels.length} />

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostelPage;
