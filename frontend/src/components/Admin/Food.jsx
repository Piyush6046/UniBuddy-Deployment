
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestaurantModal from "./Parts/RestaurantModal";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Utensils,
  Search
} from 'lucide-react';
import { fetchFoods, createFood, updateFood, deleteFood } from '../../services/operations/foodAPI';
import ConfirmModel from "../Common/ConfirmModel";

const Backend_url = import.meta.env.VITE_BACKEND_URL;

const FoodManagement = () => {
  const dispatch = useDispatch();
  const { foods, loading, pagination, error } = useSelector(state => state.food);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchFoods({ page: currentPage, limit: 6, search: searchTerm, type: filterType }));
  }, [dispatch, currentPage, searchTerm, filterType]);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(1);
      dispatch(fetchFoods({ page: 1, limit: 6, search: searchTerm, type: filterType }));
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, filterType]);

  const handlePageChange = (page) => setCurrentPage(page);

  const openModal = (type, food = null) => {
    setModalType(type);
    setSelectedFood(food);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFood(null);
    setModalType('');
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteFood(deleteId, () => {
      setShowDeleteConfirm(false);
      setDeleteId(null);
      dispatch(fetchFoods({ page: currentPage, limit: 6, search: searchTerm, type: filterType }));
    }));
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'veg':
        return <span className="badge badge-success">Veg Only</span>;
      case 'non-veg':
        return <span className="badge badge-danger">Non-Veg</span>;
      case 'both':
        return <span className="badge badge-warning">Both</span>;
      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-[var(--text-muted)]" />);
    }

    return stars;
  };

  const handleSave = (formData) => {
    if (modalType === 'add') {
      dispatch(createFood(formData, closeModal));
    } else {
      dispatch(updateFood(selectedFood._id, formData, closeModal));
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const total = pagination?.totalPages || 1;
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* HEADER - Consistent Structure */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Food Management</h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage restaurants and menus</p>
            </div>
            <button
              onClick={() => openModal('add')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Restaurant
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Listings <span className="text-[var(--accent)]">({pagination?.total || 0})</span>
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
                placeholder="Search by name or location..."
                className="input w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="input select flex-1 max-w-[200px]"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="both">Both</option>
              </select>
              <button
                onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                className="btn btn-ghost"
              >
                Reset
              </button>
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
        {!loading && !error && foods?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="card group overflow-hidden hover:shadow-lg transition-all border border-[var(--border)] bg-[var(--bg-card)]">
                {/* Image */}
                <div className="relative h-48 bg-[var(--bg-tertiary)]">
                  {food.images && food.images[0] ? (
                    <img
                      src={`${Backend_url}/${food.images[0]}`}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils className="w-16 h-16 text-[var(--text-muted)]" />
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 shadow-sm">
                    {getTypeBadge(food.type)}
                  </div>

                  {/* Admin Actions Overlay */}
                  <div className="absolute top-2 left-2 flex gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('edit', food)} className="bg-yellow-500 p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg">
                      <Edit className="w-4 h-4 text-black" />
                    </button>
                    <button onClick={() => handleDelete(food._id)} className="bg-red-500 p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">{food.name}</h3>
                    <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                      <div className="flex">
                        {renderStars(food.rating)}
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">({food.rating})</span>
                    </div>
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2 min-h-[40px]">{food.description || 'No description provided.'}</p>

                  <div className="flex items-start gap-2 text-sm text-[var(--text-muted)] mt-auto pt-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{food.address?.full || food.address}</span>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Phone className="w-4 h-4" />
                      <span>{food.contact}</span>
                    </div>
                    <button className="btn btn-ghost btn-xs text-[var(--accent)]">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && (!foods || foods.length === 0) && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No restaurants found.
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-ghost p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {generatePageNumbers().map(num => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${num === currentPage
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="btn btn-ghost p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showModal && modalType !== 'view' && (
        <RestaurantModal
          type={modalType}
          isOpen={showModal}
          onClose={closeModal}
          initialData={selectedFood}
          onSave={handleSave}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModel
          isOpen={showDeleteConfirm}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          title="Delete Restaurant"
          message="Are you sure you want to delete this restaurant?"
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default FoodManagement;