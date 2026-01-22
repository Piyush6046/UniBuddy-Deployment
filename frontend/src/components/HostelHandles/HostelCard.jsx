
import React from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Phone, Wifi, Shield, Zap,
  UtensilsCrossed, Shirt, Bath, Droplets, Star, Edit, Trash2, Navigation
} from 'lucide-react';

const HostelCard = ({
  hostel,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  userType = 'user', // 'user' or 'admin'
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-vjti-gold text-vjti-gold" />);
    }
    if (rating % 1 !== 0) {
      stars.push(<Star key="half" className="w-3 h-3 fill-vjti-gold text-vjti-gold opacity-50" />);
    }
    return stars;
  };

  const handleEdit = () => {
    onEdit && onEdit(hostel);
  };

  const handleDelete = () => {
    onDelete && onDelete(hostel._id);
  };

  const handleNavigate = () => {
    // Open Google Maps with the hostel name and address
    const query = encodeURIComponent(`${hostel.name} ${hostel.address?.full || hostel.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="group bg-richblack-800 rounded-2xl border border-richblack-700 overflow-hidden hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-vjti-gold/50 transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        {/* Admin Edit/Delete buttons */}
        {userType === 'admin' && (
          <div className="absolute top-3 left-3 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-vjti-gold hover:bg-yellow-500 shadow-lg"
              title="Edit Hostel"
            >
              <Edit className="w-4 h-4 text-richblack-900" />
            </button>
            <button
              onClick={handleDelete}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 shadow-lg"
              title="Delete Hostel"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Hostel Image */}
        {hostel.images && hostel.images.length > 0 ? (
          <>
            <img
              src={hostel.images[currentImageIndex || 0]}
              alt={hostel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
              }}
            />

            {/* Carousel controls */}
            {hostel.images.length > 1 && (
              <>
                <button
                  onClick={() => onPrevImage(hostel._id)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onNextImage(hostel._id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {hostel.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === (currentImageIndex || 0)
                          ? 'w-4 bg-vjti-gold'
                          : 'w-1.5 bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-richblack-700 flex items-center justify-center">
            <span className="text-richblack-400">No image available</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg
            ${hostel.type === 'boys' ? 'bg-blue-600/90 text-white' : 'bg-pink-600/90 text-white'}`}>
            {hostel.type === 'boys' ? 'Boys' : 'Girls'}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-vjti-gold fill-vjti-gold" />
          <span className="text-xs font-bold text-white">{hostel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-vjti-gold transition-colors">
            {hostel.name}
          </h3>
          <div className="flex items-start gap-1.5 text-richblack-300 text-xs">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-vjti-red" />
            <span className="line-clamp-2 leading-relaxed">{hostel.address?.full || hostel.address}</span>
          </div>
        </div>

        {/* Services Chips */}
        {hostel.services && hostel.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 h-16 content-start">
            {hostel.services.slice(0, 5).map((service) => (
              <div
                key={service}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-richblack-700/50 border border-richblack-700 text-[10px] text-richblack-200"
              >
                {serviceIcons[service]}
                <span>{serviceNames[service]}</span>
              </div>
            ))}
            {hostel.services.length > 5 && (
              <span className="text-[10px] text-richblack-400 self-center">+{hostel.services.length - 5} more</span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-richblack-700">
          <div className="flex flex-col">
            <span className="text-xs text-richblack-400">Starting from</span>
            <span className="text-lg font-bold text-white">₹{String(hostel.rent).slice(0, 6)}<span className="text-xs font-normal text-richblack-400">/mo</span></span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = `tel:${hostel.contact}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-richblack-700 hover:bg-richblack-600 text-vjti-gold transition-colors"
              title={`Call: ${hostel.contact}`}
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 px-4 py-2 bg-vjti-gold hover:bg-yellow-500 text-richblack-900 font-bold rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
