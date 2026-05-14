import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'Makeup Services', date: '', status: 'Pending' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://rithus-backend.onrender.com/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://rithus-backend.onrender.com/api/bookings', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchBookings();
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', service: 'Makeup Services', date: '', status: 'Pending' });
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
        await axios.delete(`https://rithus-backend.onrender.com/api/bookings/${id}`, {
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
      await axios.put(`https://rithus-backend.onrender.com/api/bookings/${id}`, { status: newStatus }, {
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
        <h2 className="text-3xl font-serif text-brandPink">Booking Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> New Booking
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brandPink" size={48} />
        </div>
      ) : (
        <div className="glass-card overflow-hidden shadow-xl border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Client Name</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Phone</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Service</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Date</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-bold text-gray-700 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-50 hover:bg-white/50 transition-colors">
                    <td className="p-4 text-gray-900 font-medium">{booking.name}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{booking.phone || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{booking.service}</td>
                    <td className="p-4 text-gray-600">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select 
                        className={`px-3 py-1 rounded-full text-xs font-bold border border-gray-200 outline-none cursor-pointer transition-colors ${getStatusColor(booking.status)}`}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-brandLightPink border border-gray-200 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-serif text-brandPink mb-6">
              Create New Booking
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Client Name</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Phone Number</label>
                <input 
                  required type="tel" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Service Type</label>
                <select 
                  required
                  value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none appearance-none cursor-pointer"
                >
                  <option value="Makeup Services">Makeup Services</option>
                  <option value="Saree Draping">Saree Draping</option>
                  <option value="Hair Style">Hair Style</option>
                  <option value="Party Makeup">Party Makeup</option>
                  <option value="Bridal Makeup">Bridal Makeup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Date</label>
                <input 
                  required type="date" 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Status</label>
                <select 
                  required
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none appearance-none cursor-pointer"
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
