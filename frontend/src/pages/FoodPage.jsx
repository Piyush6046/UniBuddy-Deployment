
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods, deleteFood } from "../services/operations/foodAPI";
import FoodCard from "../components/Food/FoodCard";
import Pagination from "../components/HostelHandles/Paganation";
import ErrorMessage from "../components/HostelHandles/Error";
import NoResults from "../components/HostelHandles/Noresult";
import { Utensils, Search } from "lucide-react";

/**
 * Food Page - Updated to match Hostel Page UI
 */
const FoodPage = () => {
  const dispatch = useDispatch();
  const foodState = useSelector((state) => state.food) || {};
  const { foods = [], pagination = {}, loading = false, error = null } = foodState;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [userType, setUserType] = useState("user"); // 'user' or 'admin'

  const itemsPerPage = 9;

  // Initialize image indices
  useEffect(() => {
    const initialIndices = {};
    if (foods && Array.isArray(foods)) {
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
    const delay = setTimeout(() => {
      setCurrentPage(1);
      loadFoods(1, searchTerm, filters);
    }, 400);
    return () => clearTimeout(delay);
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
    const food = Array.isArray(foods) ? foods.find((f) => f._id === id) : null;
    if (!food || !food.images?.length) return;
    const total = food.images.length;
    setCurrentImageIndex((prev) => ({ ...prev, [id]: (prev[id] + 1) % total }));
  };

  const prevImage = (id) => {
    const food = Array.isArray(foods) ? foods.find((f) => f._id === id) : null;
    if (!food || !food.images?.length) return;
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-inter">
      <div className="container py-8">

        {/* Header - Matching Hostel Page UI */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campus Dining</h1>
              <p className="text-[var(--text-secondary)] mt-1">Discover food spots, tiffins, and canteens near VJTI.</p>
            </div>
            <div className="text-sm font-medium px-4 py-2 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]">
              {total} spots available
            </div>
          </div>

          {/* Search & Filter - Matching Hostel Page Style */}
          <div className="card p-4 shadow-sm border-[var(--border)]">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search by name, menu or location..."
                  className="input pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="input select h-11 min-w-[140px]"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">Any Cuisine</option>
                  <option value="veg">Pure Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="both">Multi-Cuisine</option>
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
            <p className="text-[var(--text-muted)] font-medium animate-pulse">Sourcing the best spots...</p>
          </div>
        ) : Array.isArray(foods) && foods.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Utensils className="w-10 h-10 text-[var(--text-muted)]" />
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
    </div>
  );
};

export default FoodPage;
