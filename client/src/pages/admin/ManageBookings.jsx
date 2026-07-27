import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Loader from '../../components/Loader';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Makeup Services', date: '', time: '', address: '', status: 'Pending' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchBookings = async (showLoader = true) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      if (showLoader) setFetching(false);
    }
  };

  useEffect(() => {
    fetchBookings(true);
    const interval = setInterval(() => fetchBookings(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchBookings();
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', service: 'Makeup Services', date: '', time: '', address: '', status: 'Pending' });
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this booking?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookings.filter(b => b._id !== id));
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Confirmed': return 'text-blue-600 bg-blue-50';
      case 'Completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-brandBlack">Booking Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> New Booking
        </button>
      </div>

      {fetching ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Client Name</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Phone</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Service</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Address</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Date & Time</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5 text-gray-900 font-bold">{booking.name}</td>
                    <td className="p-5 text-gray-500 font-mono text-sm">{booking.phone || 'N/A'}</td>
                    <td className="p-5 text-gray-600 font-medium">{booking.service}</td>
                    <td className="p-5 text-gray-500 text-sm">
                      {booking.address ? (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {booking.address.substring(0, 20)}...
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td className="p-5 text-gray-500 text-sm">
                      <div className="flex flex-col">
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{booking.time}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative inline-block w-full max-w-[120px]">
                        <select 
                          className={`w-full px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold border outline-none cursor-pointer transition-colors appearance-none text-center ${
                            booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            booking.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }`}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDelete(booking._id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-500 font-medium">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif text-brandBlack mb-8">
              Create New Booking
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Client Name</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Phone Number</label>
                <input 
                  required type="tel" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Service Type</label>
                <select 
                  required
                  value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none appearance-none cursor-pointer"
                >
                  <option value="Makeup Services">Makeup Services</option>
                  <option value="Saree Draping">Saree Draping</option>
                  <option value="Hair Style">Hair Style</option>
                  <option value="Party Makeup">Party Makeup</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Date</label>
                  <input 
                    required type="date" 
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Time</label>
                  <input 
                    required type="time" 
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Address</label>
                <input 
                  required type="text" 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Status</label>
                <select 
                  required
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandBlack outline-none appearance-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 btn-primary py-3 px-4 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
