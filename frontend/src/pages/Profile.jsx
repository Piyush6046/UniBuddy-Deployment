
import React, { useState } from "react";
import {
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

// Import your components
import MyProfile from "../components/Profile/MyProfile";
import MyBooks from "../components/Profile/MyBooks";
import ProfileSettings from "../components/Profile/Settings";
import { logoutauth } from "../services/operations/authAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar navigation items
  const navItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "books", label: "My Books", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyProfile />;
      case "books":
        return <MyBooks />;
      case "settings":
        return <ProfileSettings />;
      case "logout":
        dispatch(logoutauth(navigate));
        return null;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between font-inter">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-lg">U</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">
                <span>My</span>
                <span className="text-[var(--accent)] ml-1">Profile</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100-72px)]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-card)] border-r border-[var(--border)] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-[var(--border)]">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar nav */}
          <nav className="mt-8 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    dispatch(logoutauth(navigate));
                  } else {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === item.id && item.id !== 'logout'
                    ? "bg-[var(--accent)] text-black font-bold shadow-md transform scale-[1.02]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-black' : ''}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 lg:ml-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfilePanel;
