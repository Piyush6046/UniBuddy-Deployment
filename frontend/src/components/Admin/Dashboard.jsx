import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building,
  UtensilsCrossed,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { fetchHostels } from '../../services/operations/hostelAPI';
import { fetchFoods } from '../../services/operations/foodAPI';
import { fetchAllBooks } from '../../services/operations/booksApi';
import { fetchMentors } from '../../services/operations/mentorAPI';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHostels({ page: 1, limit: 1 }));
    dispatch(fetchFoods({ page: 1, limit: 1 }));
    dispatch(fetchAllBooks({ page: 1, limit: 1 }));
    dispatch(fetchMentors({ page: 1, limit: 1 }));
  }, [dispatch]);

  const { pagination: hostelPag } = useSelector((state) => state.hostel || {});
  const { pagination: foodPag } = useSelector((state) => state.food || {});
  const { pagination: bookPag } = useSelector((state) => state.books || {});
  const { pagination: mentorPag } = useSelector((state) => state.mentor || {});

  const stats = {
    totalHostels: hostelPag?.total || 0,
    totalFoodVendors: foodPag?.total || 0,
    totalBooks: bookPag?.total || 0,
    totalMentors: mentorPag?.total || 0,
  };

  const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="stat-card hover:border-[var(--accent)] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard Overview</h2>
        <p className="text-[var(--text-secondary)] mt-1">Real-time statistics from VJTI Database.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hostels"
          value={stats.totalHostels}
          icon={Building}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard
          title="Food Spots"
          value={stats.totalFoodVendors}
          icon={UtensilsCrossed}
          color="text-green-500"
          bg="bg-green-500/10"
        />
        <StatCard
          title="Books Listed"
          value={stats.totalBooks}
          icon={BookOpen}
          color="text-yellow-500"
          bg="bg-yellow-500/10"
        />
        <StatCard
          title="Active Mentors"
          value={stats.totalMentors}
          icon={UserCheck}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
      </div>

      {/* System Status */}
      <div className="card p-8 text-center bg-[var(--bg-secondary)] border-dashed border-2">
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">System Status: Online</h3>
        <p className="text-[var(--text-muted)] text-sm">Database connected. displaying real-time counts.</p>
      </div>
    </div>
  );
};

export default Dashboard;