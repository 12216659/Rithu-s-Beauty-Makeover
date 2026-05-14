import { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scissors, Image as ImageIcon, CalendarCheck, Star, LogOut, Menu, X } from 'lucide-react';

import DashboardHome from './DashboardHome';
import ManageServices from './ManageServices';
import ManageGallery from './ManageGallery';
import ManageBookings from './ManageBookings';
import ManageReviews from './ManageReviews';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Services', path: '/admin/dashboard/services', icon: <Scissors size={20} /> },
    { name: 'Gallery', path: '/admin/dashboard/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Bookings', path: '/admin/dashboard/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Reviews', path: '/admin/dashboard/reviews', icon: <Star size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-brandLightPink flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 text-gray-900 p-2 glass-card rounded-full"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 glass-card border-l-0 border-t-0 border-b-0 rounded-none transform ${sidebarOpen ? 'translate-x-0 pt-32' : '-translate-x-full pt-6'} lg:translate-x-0 transition-transform duration-300 flex flex-col`}>
        <div className="px-6 mb-10 hidden lg:block">
          <h2 className="text-xl font-serif text-brandPink">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-brandPink text-white font-semibold shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-brandPink'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden pt-20 lg:pt-0">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/bookings" element={<ManageBookings />} />
          <Route path="/reviews" element={<ManageReviews />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
