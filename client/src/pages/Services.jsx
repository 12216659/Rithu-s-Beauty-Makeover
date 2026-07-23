import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { Clock, IndianRupee, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services`);
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const navigate = useNavigate();

  const handleBookNow = (serviceName) => {
    navigate(`/book?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="min-h-screen bg-transparent py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Our <span className="text-brandBlack">Services</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">Discover our range of premium beauty services designed to make you look and feel extraordinary.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-brandBlack" size={48} />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative h-[28rem] rounded-2xl overflow-hidden group shadow-xl border border-white/10"
              >
                {/* Full Box Image */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Initial Gradient for Title Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>

                {/* Sliding Blur Container */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col translate-y-[calc(100%-5rem)] group-hover:translate-y-0 transition-all duration-500 ease-in-out bg-transparent group-hover:bg-white/95 group-hover:backdrop-blur-md border-t border-transparent group-hover:border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-serif text-brandBlack group-[&:not(:hover)]:text-white group-[&:not(:hover)]:drop-shadow-lg transition-colors">{service.title}</h3>
                    <span className="bg-brandSilver text-brandBlack px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{service.category}</span>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-col">
                    <p className="text-gray-600 text-sm mb-6 font-medium">{service.description}</p>
                    
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-gray-800">
                        <IndianRupee size={16} className="text-brandBlack mr-1" />
                        <span className="font-bold">{service.price}</span>
                      </div>
                      <div className="flex items-center text-gray-800">
                        <Clock size={16} className="text-brandBlack mr-1" />
                        <span className="text-sm font-bold">{service.duration}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleBookNow(service.title)}
                      className="w-full py-3 px-4 bg-brandBlack hover:bg-gray-800 text-white rounded-xl flex items-center justify-center space-x-2 transition-colors font-medium shadow-lg"
                    >
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
