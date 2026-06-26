import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        phone: user.phone || ''
      }));
    }
  }, []);

  const servicesList = [
    "Bridal Makeup",
    "Engagement Makeup",
    "Party Makeup",
    "Simple Bridal",
    "Professional Bridal",
    "Glassy Look Makeup",
    "HD Makeup",
    "Saree Draping",
    "Hair Style",
    "Sider Makeup",
    "Baby Shower Makeup"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to book an appointment.');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Save booking to DB
      await axios.post('https://rithusbackend.onrender.com/api/bookings', {
        ...formData,
        status: 'Pending'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to WhatsApp after saving to DB
      const waNumber = '919515229043';
      const message = `Hello Rithu's Beauty Makeover,%0A%0AI want to book:%0A*Service:* ${formData.service}%0A*Date:* ${formData.date}%0A*Time:* ${formData.time}%0A*Name:* ${formData.name}%0A*Message:* ${formData.message}`;
      
      window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
      alert('Booking request received! Redirecting to WhatsApp for confirmation.');
    } catch (err) {
      console.error('Error saving booking:', err);
      alert(err.response?.data?.message || 'Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandLightPink py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Book an <span className="text-brandPink">Appointment</span></h1>
          <p className="text-gray-600 font-medium">Fill out the form below and we'll confirm your appointment via WhatsApp.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative z-10 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Select Service</label>
              <select 
                name="service" 
                required
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors appearance-none"
              >
                <option value="">Choose a service...</option>
                {servicesList.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Preferred Date</label>
                <input 
                  type="date" 
                  name="date" 
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors [color-scheme:light]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Preferred Time</label>
                <input 
                  type="time" 
                  name="time" 
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors [color-scheme:light]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Additional Message (Optional)</label>
              <textarea 
                name="message" 
                rows="4"
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-brandPink focus:bg-white transition-colors resize-none"
                placeholder="Any special requests or details..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </>
              ) : 'Book via WhatsApp'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
