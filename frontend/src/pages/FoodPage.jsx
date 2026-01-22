import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods, deleteFood } from "../services/operations/foodAPI";
import SearchAndFilterBar from "../components/Admin/Parts/Searchfillter"; // Retaining typo to avoid build error
import FoodCard from "../components/Food/FoodCard";
import Pagination from "../components/HostelHandles/Paganation";
import ErrorMessage from "../components/HostelHandles/Error";
import NoResults from "../components/HostelHandles/Noresult";
import Footer from "../components/Common/Footer";
import { Utensils, Coffee } from "lucide-react";

const FoodPage = () => {
  const dispatch = useDispatch();
  const { foods, pagination, loading, error } = useSelector((state) => state.food);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [userType, setUserType] = useState("user"); // 'user' or 'admin'

  const itemsPerPage = 6;

  // Initialize image indices
  useEffect(() => {
    const initialIndices = {};
    if (foods && foods.length > 0) {
      foods.forEach((f) => {
        initialIndices[f._id] = 0;
      });
      setCurrentImageIndex(initialIndices);
    }
  }, [foods]);

  // Initial fetch
  useEffect(() => {
    loadFoods(1, searchTerm, filters);
  }, [dispatch]);

  const loadFoods = (page = 1, search = "", appliedFilters = filters) => {
    dispatch(
      fetchFoods({
        page,
        limit: itemsPerPage,
        search,
        type: appliedFilters.type,
      })
    );
  };

  // Fetch when params change
  useEffect(() => {
    setCurrentPage(1);
    loadFoods(1, searchTerm, filters);
  }, [searchTerm, filters]);

  const handleResetFilters = () => {
    const reset = { type: "all" };
    setFilters(reset);
    setSearchTerm("");
    setCurrentPage(1);
    loadFoods(1, "", reset);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadFoods(page, searchTerm, filters);
  };

  const nextImage = (id) => {
    const food = foods.find((f) => f._id === id);
    if (!food || !food.images.length) return;
    const total = food.images.length;
    setCurrentImageIndex((prev) => ({ ...prev, [id]: (prev[id] + 1) % total }));
  };

  const prevImage = (id) => {
    const food = foods.find((f) => f._id === id);
    if (!food || !food.images.length) return;
    const total = food.images.length;
    setCurrentImageIndex((prev) => ({ ...prev, [id]: prev[id] === 0 ? total - 1 : prev[id] - 1 }));
  };

  const handleEdit = (food) => { console.log("Edit:", food); };

  const handleDelete = (id) => {
    dispatch(deleteFood(id, () => loadFoods(currentPage, searchTerm, filters)));
  };

  const totalPages = pagination?.totalPages || 0;
  const total = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-richblack-900 text-white font-inter">
      {/* VJTI Food Header */}
      <div className="bg-gradient-to-r from-richblack-900 to-richblack-800 border-b border-richblack-800 py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Coffee size={200} />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-richblack-800 rounded-full mb-4 shadow-lg border border-richblack-700">
            <Utensils className="w-6 h-6 text-vjti-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Campus <span className="text-vjti-gold">Dining & Mess</span>
          </h1>
          <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
            Discover the best student-friendly food spots, tiffins, and canteens near VJTI Matunga.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* Stats Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-richblack-800/50 p-4 rounded-xl border border-richblack-700 backdrop-blur-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Nearby Spots <span className="bg-vjti-gold text-richblack-900 px-2 py-0.5 rounded text-sm font-bold">{total}</span>
          </h2>
        </div>

        {/* Search & Filter */}
        <div className="mb-10">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleResetFilters={handleResetFilters}
            filterKeys={["type"]}
            options={{
              type: ["veg", "non-veg", "both"]
            }}
            debounceDelay={400}
          />
        </div>

        {/* Error */}
        <ErrorMessage error={error} />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              hotel={food}
              currentImageIndex={currentImageIndex[food._id]}
              onNextImage={nextImage}
              onPrevImage={prevImage}
              userType={userType}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* No Results */}
        <NoResults loading={loading} hostelsLength={foods.length} />

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

export default FoodPage;
