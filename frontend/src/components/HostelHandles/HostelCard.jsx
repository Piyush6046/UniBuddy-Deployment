import React from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Phone, Wifi, Shield, Zap,
  UtensilsCrossed, Shirt, Bath, Droplets, Star, Edit, Trash2, Navigation,
  Home as HomeIcon
} from 'lucide-react';

const HostelCard = ({
  hostel,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  userType = 'user',
  onEdit,
  onDelete
}) => {
  const serviceIcons = {
    wifi: <Wifi className="w-3 h-3" />,
    security: <Shield className="w-3 h-3" />,
    electricity: <Zap className="w-3 h-3" />,
    food: <UtensilsCrossed className="w-3 h-3" />,
    washing: <Shirt className="w-3 h-3" />,
    washroom: <Bath className="w-3 h-3" />,
    personal_toilet: <Bath className="w-3 h-3" />,
    water_filter: <Droplets className="w-3 h-3" />
  };

  const serviceNames = {
    wifi: "Wi-Fi",
    security: "Security",
    electricity: "Electricity",
    food: "Food",
    washing: "Washing",
    washroom: "Washroom",
    personal_toilet: "Toilet",
    water_filter: "Filter"
  };

  const handleEdit = () => onEdit && onEdit(hostel);
  const handleDelete = () => onDelete && onDelete(hostel._id);

  const handleNavigate = () => {
    const query = encodeURIComponent(`${hostel.name} ${hostel.address?.full || hostel.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper to extract image URL safely (handles both string and object formats)
  const getImageUrl = (image) => {
    if (!image) return null;
    const url = typeof image === 'string' ? image : (image.url || null);
    if (!url) return null;
    return url.startsWith('http') ? url : `${backendUrl}/${url}`;
  };

  const currentImage = hostel.images && hostel.images.length > 0
    ? hostel.images[currentImageIndex || 0]
    : null;

  const imageSrc = getImageUrl(currentImage);

  return (
    <div className="card p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 border-[var(--border)]">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-[var(--bg-tertiary)]">
        {userType === 'admin' && (
          <div className="absolute top-3 left-3 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleEdit} className="p-2 rounded-lg bg-[var(--warning)] text-white shadow-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-lg bg-[var(--error)] text-white shadow-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={hostel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'; }}
            />

            {hostel.images.length > 1 && (
              <>
                <button
                  onClick={() => onPrevImage(hostel._id)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNextImage(hostel._id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {hostel.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === (currentImageIndex || 0) ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
            <HomeIcon className="w-12 h-12 opacity-20" />
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${hostel.type === 'boys' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
            }`}>
            {hostel.type === 'boys' ? 'Male' : 'Female'}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-white text-xs font-bold border border-white/10">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {hostel.rating || 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 truncate leading-tight group-hover:text-[var(--accent)] transition-colors">
            {hostel.name}
          </h3>
          <div className="flex items-start gap-1.5 text-[var(--text-secondary)] text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-500" />
            <span className="line-clamp-1">{hostel.address?.full || hostel.address}</span>
          </div>
        </div>

        {hostel.services && Array.isArray(hostel.services) && hostel.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 h-14 content-start">
            {hostel.services.slice(0, 4).map((service) => (
              <div
                key={service}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[9px] font-medium text-[var(--text-secondary)]"
              >
                {serviceIcons[service] || null}
                <span>{serviceNames[service] || service}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Rent / Mo.</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">₹{hostel.rent}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `tel:${hostel.contact}`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-secondary)] transition-all"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={handleNavigate}
              className="btn btn-primary btn-sm px-4 py-2 rounded-xl text-xs font-bold shadow-md h-10"
            >
              <Navigation className="w-3.5 h-3.5 mr-2" />
              Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
