import { useState, useEffect } from 'react';
import { Users, LayoutDashboard, FileImage, Briefcase, Loader2 } from 'lucide-react';
import axios from 'axios';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    { title: 'Total Bookings', value: '0', icon: <Briefcase size={24} className="text-brandPink" /> },
    { title: 'Total Services', value: '0', icon: <Users size={24} className="text-brandPink" /> },
    { title: 'Gallery Images', value: '0', icon: <FileImage size={24} className="text-brandPink" /> },
    { title: 'Pending Bookings', value: '0', icon: <LayoutDashboard size={24} className="text-brandPink" /> }
  ]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Services
        let servicesData = [];
        try {
          const res = await axios.get('https://rithusbackend.onrender.com/api/services');
          servicesData = res.data;
        } catch (e) { console.error("Services fetch failed", e); }

        // Fetch Gallery
        let galleryData = [];
        try {
          const res = await axios.get('https://rithusbackend.onrender.com/api/gallery');
          galleryData = res.data;
        } catch (e) { console.error("Gallery fetch failed", e); }

        // Fetch Bookings
        let bookingsData = [];
        try {
          const res = await axios.get('https://rithusbackend.onrender.com/api/bookings', { headers });
          bookingsData = res.data;
        } catch (e) { console.error("Bookings fetch failed", e); }

        const pendingBookings = bookingsData.filter(b => b.status === 'Pending');

        setStats([
          { title: 'Total Bookings', value: bookingsData.length.toString(), icon: <Briefcase size={24} className="text-brandPink" /> },
          { title: 'Total Services', value: servicesData.length.toString(), icon: <Users size={24} className="text-brandPink" /> },
          { title: 'Gallery Images', value: galleryData.length.toString(), icon: <FileImage size={24} className="text-brandPink" /> },
          { title: 'Pending Bookings', value: pendingBookings.length.toString(), icon: <LayoutDashboard size={24} className="text-brandPink" /> }
        ]);

        setRecentBookings(bookingsData.slice(0, 5));
      } catch (err) {
        console.error('Error in dashboard logic:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brandPink" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-serif text-brandPink mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300 shadow-lg border border-white/20">
            <div className="p-4 rounded-full bg-gray-50 border border-gray-100">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-serif text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 shadow-xl border border-white/20">
        <h3 className="text-xl font-serif text-gray-900 mb-6">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th className="pb-3 font-bold">Client</th>
                <th className="pb-3 font-bold">Service</th>
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-gray-800 font-bold">{b.name}</td>
                  <td className="py-4 text-brandPink font-medium">{b.service}</td>
                  <td className="py-4 text-gray-500 text-sm">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                      b.status === 'Confirmed' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400 font-medium">No recent bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
