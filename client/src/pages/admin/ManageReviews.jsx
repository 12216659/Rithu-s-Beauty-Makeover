import { useState, useEffect } from 'react';
import { Trash2, Plus, Star, X, UploadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, message: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('https://rithusbackend.onrender.com/api/reviews');
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
    if (!formData.name || !formData.message) return alert("Please fill all fields.");
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fallback profile image if not uploaded
      const finalImage = formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;

      await axios.post('https://rithusbackend.onrender.com/api/reviews', {
        ...formData,
        image: finalImage,
        rating: Number(formData.rating)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchReviews();
      setIsModalOpen(false);
      setFormData({ name: '', rating: 5, message: '', image: '' });
    } catch (err) {
      console.error('Error saving review:', err);
      alert('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this review?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://rithusbackend.onrender.com/api/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(reviews.filter(r => r._id !== id));
      } catch (err) {
        console.error('Error deleting review:', err);
        alert('Failed to delete review');
      }
    }
  };

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-brandPink">Review Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <Plus size={16} /> Add Review
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brandPink" size={48} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-500">No reviews found. Add your first customer review!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="glass-card p-6 flex gap-4 relative group shadow-lg hover:shadow-xl transition-shadow border border-white/20">
              <img src={review.image} alt={review.name} className="w-16 h-16 rounded-full object-cover border-2 border-brandRoseGold shadow-md" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{review.name}</h3>
                  <div className="flex text-brandPink">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{review.message}"</p>
              </div>
              <button 
                onClick={() => handleDelete(review._id)} 
                className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
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
              Add Customer Review
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Customer Name</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Rating (1-5)</label>
                <select 
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Review Message</label>
                <textarea 
                  required rows="3"
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:border-brandPink outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1 font-medium">Profile Image (Optional)</label>
                <div className="relative w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-brandPink transition-colors cursor-pointer bg-gray-50">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <UploadCloud className="text-gray-400" size={24} />
                  )}
                  <span className="text-xs text-gray-600 mt-1 relative z-10 drop-shadow-md font-medium">
                    {formData.image ? 'Change Image' : 'Click to Upload Profile Pic'}
                  </span>
                  <input 
                    type="file" accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
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
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
