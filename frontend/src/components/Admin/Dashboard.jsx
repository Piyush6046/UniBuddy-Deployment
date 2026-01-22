import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3,
  Users,
  Building,
  UtensilsCrossed,
  BookOpen,
  ShoppingCart,
  MapPin,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { fetchHostels } from '../../services/operations/hostelAPI';
import { fetchFoods } from '../../services/operations/foodAPI';
import { fetchAllBooks } from '../../services/operations/booksApi';
import { fetchMentors } from '../../services/operations/mentorAPI';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Fetch all data on mount to get counts
  useEffect(() => {
    dispatch(fetchHostels({ page: 1, limit: 1 }));
    dispatch(fetchFoods({ page: 1, limit: 1 }));
    dispatch(fetchAllBooks({ page: 1, limit: 1 }));
    dispatch(fetchMentors({ page: 1, limit: 1 }));
  }, [dispatch]);

  // Select data from Redux
  // Note: Ensure your slice names match rootReducer keys (hostel, food, books, mentor)
  const { pagination: hostelPag } = useSelector((state) => state.hostel || {});
  const { pagination: foodPag } = useSelector((state) => state.food || {});
  const { pagination: bookPag } = useSelector((state) => state.books || {}); // 'books' slice
  const { pagination: mentorPag } = useSelector((state) => state.mentor || {});

  // Real Stats from DB
  const stats = {
    totalHostels: hostelPag?.total || 0,
    totalFoodVendors: foodPag?.total || 0,
    totalBooks: bookPag?.total || 0,
    totalMentors: mentorPag?.total || 0,
    // totalStudents: 'N/A', // No API yet
    // totalColleges: 1,     // VJTI hardcoded
    // totalGuides: 'N/A'
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Real-time statistics from VJTI Database.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hostels"
          value={stats.totalHostels}
          icon={Building}
          color="bg-blue-600"
        />
        <StatCard
          title="Food Spots"
          value={stats.totalFoodVendors}
          icon={UtensilsCrossed}
          color="bg-green-600"
        />
        <StatCard
          title="Books Listed"
          value={stats.totalBooks}
          icon={BookOpen}
          color="bg-yellow-600"
        />
        <StatCard
          title="Active Mentors"
          value={stats.totalMentors}
          icon={UserCheck}
          color="bg-purple-600"
        />
      </div>

      {/* Empty State / Info */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 text-center mt-10">
        <h3 className="text-xl font-medium text-white mb-2">System Status: Online</h3>
        <p className="text-gray-400">Database connected. displaying real-time counts.</p>
      </div>
    </div>
  );
};

export default Dashboard;