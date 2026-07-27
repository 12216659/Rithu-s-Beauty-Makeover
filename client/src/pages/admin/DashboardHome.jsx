import { useState, useEffect } from 'react';
import { Users, LayoutDashboard, FileImage, Briefcase, Loader2 } from 'lucide-react';
import axios from 'axios';
import Loader from '../../components/Loader';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    { title: 'Total Bookings', value: '0', icon: <Briefcase size={24} className="text-brandBlack" /> },
    { title: 'Total Services', value: '0', icon: <Users size={24} className="text-brandBlack" /> },
    { title: 'Gallery Images', value: '0', icon: <FileImage size={24} className="text-brandBlack" /> },
    { title: 'Pending Bookings', value: '0', icon: <LayoutDashboard size={24} className="text-brandBlack" /> }
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
          const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services`);
          servicesData = res.data;
        } catch (e) { console.error("Services fetch failed", e); }

        // Fetch Gallery
        let galleryData = [];
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/gallery`);
          galleryData = res.data;
        } catch (e) { console.error("Gallery fetch failed", e); }

        // Fetch Bookings
        let bookingsData = [];
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings`, { headers });
          bookingsData = res.data;
        } catch (e) { console.error("Bookings fetch failed", e); }

        const pendingBookings = bookingsData.filter(b => b.status === 'Pending');

        setStats([
          { title: 'Total Bookings', value: bookingsData.length.toString(), icon: <Briefcase size={24} className="text-brandBlack" /> },
          { title: 'Total Services', value: servicesData.length.toString(), icon: <Users size={24} className="text-brandBlack" /> },
          { title: 'Gallery Images', value: galleryData.length.toString(), icon: <FileImage size={24} className="text-brandBlack" /> },
          { title: 'Pending Bookings', value: pendingBookings.length.toString(), icon: <LayoutDashboard size={24} className="text-brandBlack" /> }
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
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-serif text-brandBlack mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 group">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-brandBlack group-hover:text-white transition-colors duration-300">
              {/* Clone icon to allow color transition */}
              <div className="text-brandBlack group-hover:text-white transition-colors">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl font-serif text-gray-900 mb-1">{stat.value}</p>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-xl font-serif text-gray-900 mb-6 flex items-center gap-2">
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-widest bg-gray-50/50">
                <th className="py-4 px-4 font-bold rounded-tl-lg">Client</th>
                <th className="py-4 px-4 font-bold">Service</th>
                <th className="py-4 px-4 font-bold">Date</th>
                <th className="py-4 px-4 font-bold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-4 text-gray-900 font-bold group-hover:text-brandBlack">{b.name}</td>
                  <td className="py-4 px-4 text-gray-600 font-medium">{b.service}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      b.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      b.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-green-50 text-green-700 border-green-200'
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
