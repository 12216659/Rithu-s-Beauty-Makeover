import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image as ImageIcon, X, UploadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    _id: null, 
    title: '', 
    price: '', 
    duration: '', 
    description: '', 
    image: '', 
    category: 'General' 
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services`);
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({ 
        _id: null, 
        title: '', 
        price: '', 
        duration: '', 
        description: '', 
        image: '', 
        category: 'General' 
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return alert('Image size too large. Please use an image under 10MB.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (formData._id) {
        await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services/${formData._id}`, formData, { headers });
      } else {
        const { _id, ...newServiceData } = formData;
        await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services`, newServiceData, { headers });
      }
      
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      alert(err.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this service?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(services.filter(s => s._id !== id));
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Failed to delete service');
      }
    }
  };

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-brandBlack">Service Management</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brandBlack" size={48} />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <p className="text-gray-500 font-medium">No services found. Add your first service!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Service Name</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Price (₹)</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Duration</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Category</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5 text-gray-900 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-gray-300 transition-colors">
                        {service.image ? (
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                      <span className="font-bold group-hover:text-brandBlack transition-colors">{service.title}</span>
                    </td>
                    <td className="p-5 text-gray-600 font-medium font-mono text-sm">₹{service.price}</td>
                    <td className="p-5 text-gray-500 text-sm">{service.duration}</td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-gray-200">{service.category}</span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button onClick={() => handleOpenModal(service)} className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(service._id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
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
              {formData._id ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Service Name</label>
                <input 
                  required type="text" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandRoseGold outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price (₹)</label>
                  <input 
                    required type="number" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandRoseGold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Duration</label>
                  <input 
                    required type="text" placeholder="e.g., 2 hours"
                    value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandRoseGold outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <input 
                  required type="text" 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandRoseGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea 
                  required rows="2"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandRoseGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Service Image</label>
                <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-brandRoseGold transition-colors cursor-pointer bg-gray-50">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <UploadCloud className="text-gray-600 mb-2" size={24} />
                  )}
                  <span className="text-sm text-gray-900 font-medium relative z-10 drop-shadow-md">
                    {formData.image ? 'Change Image' : 'Click to Upload Image'}
                  </span>
                  <input 
                    type="file" accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 px-4 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 btn-primary py-2 px-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (formData._id ? 'Update' : 'Save') + ' Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
