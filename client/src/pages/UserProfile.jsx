import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Clock, MapPin, CheckCircle, Clock3, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', phone: '', address: '' });
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserData = async (showLoader = true) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        }

        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/bookings/mybookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
        if (showLoader) setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data', err);
        if (showLoader) {
            setError('Failed to load profile data.');
            setLoading(false);
        }
      }
    };
    fetchUserData(true);
    
    const interval = setInterval(() => {
        fetchUserData(false);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('user', JSON.stringify(res.data));
      if (res.data.token) {
          localStorage.setItem('token', res.data.token);
      }
      setUser(res.data);
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brandBlack mb-4">My Profile</h1>
        <div className="w-24 h-1 bg-brandBlack mx-auto"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 h-fit"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-8"></div>
            <div className="w-24 h-24 rounded-full bg-brandBlack text-white flex items-center justify-center text-4xl font-bold uppercase shadow-lg mb-2 mx-auto">
              {user?.fullName ? user.fullName[0] : 'U'}
            </div>
            <button 
              onClick={() => {
                if (isEditing) {
                  // Cancel
                  setEditData({
                    fullName: user?.fullName || '',
                    phone: user?.phone || '',
                    address: user?.address || ''
                  });
                  setIsEditing(false);
                } else {
                  setEditData({
                    fullName: user?.fullName || '',
                    phone: user?.phone || '',
                    address: user?.address || ''
                  });
                  setIsEditing(true);
                }
              }}
              className="text-gray-500 hover:text-brandBlack transition-colors"
              title={isEditing ? "Cancel Edit" : "Edit Profile"}
            >
              {isEditing ? <X size={20} /> : <Edit2 size={20} />}
            </button>
          </div>
          
          <h2 className="text-2xl font-serif text-brandBlack text-center">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest mt-1 text-center mb-8">Customer</p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-brandGray/10 flex items-center justify-center text-brandBlack shrink-0">
                <User size={20} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Full Name</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    className="w-full mt-1 border-b border-gray-300 focus:border-brandBlack outline-none bg-transparent py-1 text-gray-800"
                  />
                ) : (
                  <p className="text-gray-800 font-medium truncate">{user?.fullName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-brandGray/10 flex items-center justify-center text-brandBlack shrink-0">
                <Mail size={20} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-gray-800 font-medium truncate mt-1">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-brandGray/10 flex items-center justify-center text-brandBlack shrink-0">
                <Phone size={20} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Phone</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full mt-1 border-b border-gray-300 focus:border-brandBlack outline-none bg-transparent py-1 text-gray-800"
                  />
                ) : (
                  <p className="text-gray-800 font-medium truncate mt-1">{user?.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-brandGray/10 flex items-center justify-center text-brandBlack shrink-0">
                <MapPin size={20} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Address</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full mt-1 border-b border-gray-300 focus:border-brandBlack outline-none bg-transparent py-1 text-gray-800"
                  />
                ) : (
                  <p className="text-gray-800 font-medium truncate mt-1">{user?.address || 'Not provided'}</p>
                )}
              </div>
            </div>

          </div>
          
          {isEditing && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleEditSubmit}
                className="flex items-center space-x-2 bg-brandBlack text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-brandBlack/10 flex justify-center">
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors py-2 px-4 rounded hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <h3 className="text-2xl font-serif text-brandBlack mb-6 border-b border-brandBlack/20 pb-2">Booking History</h3>
          
          {bookings.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center border border-white/50 shadow-sm">
              <p className="text-gray-600 mb-4">You have no bookings yet.</p>
              <button 
                onClick={() => navigate('/book')}
                className="bg-brandBlack text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-white/50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brandBlack transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-gray-800">{booking.service}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span className="truncate max-w-[150px]" title={booking.address}>{booking.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2
                        ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                          'bg-orange-100 text-orange-700'}`}
                      >
                        {booking.status === 'Completed' && <CheckCircle size={14} />}
                        {booking.status === 'Pending' && <Clock3 size={14} />}
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default UserProfile;
