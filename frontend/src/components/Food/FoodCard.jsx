import React from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Phone, Star, Edit, Trash2, Navigation, Utensils
} from 'lucide-react';
import { toast } from "react-hot-toast";

const FoodCard = ({
  hotel,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  userType = 'user', // 'user' or 'admin'
  onEdit,
  onDelete
}) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-vjti-gold text-vjti-gold" />);
    }
    if (rating % 1 !== 0) {
      stars.push(<Star key="half" className="w-3.5 h-3.5 fill-vjti-gold text-vjti-gold opacity-50" />);
    }
    return stars;
  };

  const handleEdit = () => onEdit && onEdit(hotel);
  const handleDelete = () => onDelete && onDelete(hotel._id);

  const handleNavigate = () => {
    const query = encodeURIComponent(`${hotel.name} ${hotel.address?.full || hotel.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${hotel.contact}`;
  };

  return (
    <div className="group bg-richblack-800 rounded-2xl border border-richblack-700 overflow-hidden hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-vjti-gold/30">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        {/* Type Badge */}
        {hotel.type && (
          <div className={`absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg z-10 backdrop-blur-md border border-white/10
            ${hotel.type === "veg" ? "bg-green-600/90 text-white" : ""}
            ${hotel.type === "non-veg" ? "bg-red-600/90 text-white" : ""}
            ${hotel.type === "both" ? "bg-orange-500/90 text-white" : ""}`}>
            {hotel.type === "veg" && "Pure Veg"}
            {hotel.type === "non-veg" && "Non-Veg"}
            {hotel.type === "both" && "Multi-Cuisine"}
          </div>
        )}

        {/* Admin actions */}
        {userType === 'admin' && (
          <div className="absolute top-3 left-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleEdit} className="w-8 h-8 flex items-center justify-center rounded-lg bg-vjti-gold hover:bg-yellow-500 text-richblack-900 shadow-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image */}
        {hotel.images && hotel.images.length > 0 ? (
          <>
            <img
              src={hotel.images[currentImageIndex || 0]}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop'; }}
            />
            {hotel.images.length > 1 && (
              <>
                <button onClick={() => onPrevImage(hotel._id)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => onNextImage(hotel._id)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-richblack-700 flex items-center justify-center">
            <Utensils className="w-12 h-12 text-richblack-500" />
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-vjti-gold fill-vjti-gold" />
          <span className="text-xs font-bold text-white">{hotel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-vjti-gold transition-colors">{hotel.name}</h3>
            <div className="flex items-start gap-1.5 text-richblack-300 text-xs">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-vjti-red" />
              <span className="line-clamp-1">{hotel.address?.full || hotel.address}</span>
            </div>
          </div>
        </div>

        {/* Popular Items (Mini Menu) */}
        {hotel.menu && hotel.menu.length > 0 && (
          <div className="mt-4 mb-4 bg-richblack-900/50 rounded-lg p-3 border border-richblack-700/50">
            <h4 className="text-[10px] uppercase font-bold text-richblack-400 mb-2 tracking-wider">Student Favorites</h4>
            <div className="space-y-2">
              {hotel.menu.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-richblack-100 line-clamp-1 flex-1 pr-2">{item.item}</span>
                  <span className="text-vjti-gold font-bold whitespace-nowrap">₹{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleCall}
            className="flex-1 py-2.5 rounded-lg border border-richblack-600 hover:bg-richblack-700 text-richblack-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call
          </button>
          <button
            onClick={handleNavigate}
            className="flex-[2] py-2.5 rounded-lg bg-vjti-gold hover:bg-yellow-500 text-richblack-900 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Navigate
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
