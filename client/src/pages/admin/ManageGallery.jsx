import { useState, useEffect } from 'react';
import { Trash2, UploadCloud, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [formData, setFormData] = useState({ image: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('https://rithusbackend.onrender.com/api/gallery');
      setImages(data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const dynamicCategories = Array.from(new Set(images.map(img => img.category)));

  useEffect(() => {
    if (!formData.category && dynamicCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: dynamicCategories[0] }));
    }
  }, [images]);

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
    if (!formData.image) return alert('Please select an image to upload.');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://rithusbackend.onrender.com/api/gallery', {
        image: formData.image,
        category: formData.category || 'Uncategorized'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchImages();
      setIsModalOpen(false);
      setFormData({ image: '', category: dynamicCategories[0] || '' });
    } catch (err) {
      console.error('Error saving image:', err);
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this image from gallery?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://rithusbackend.onrender.com/api/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setImages(images.filter(i => i._id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Failed to delete image');
      }
    }
  };

  return (
    <div className="p-6 text-gray-900 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-brandPink">Gallery Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <UploadCloud size={16} /> Upload Images
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-brandPink" size={48} />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-500">No images in gallery yet. Start by uploading one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img._id} className="glass-card relative group overflow-hidden h-48">
              <img src={img.image} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <span className="bg-brandRoseGold text-brandBlack text-xs font-bold px-2 py-1 rounded w-max">{img.category}</span>
                <button onClick={() => handleDelete(img._id)} className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full self-end transition-colors shadow-lg">
                  <Trash2 size={16} />
                </button>
              </div>
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
              Upload New Image
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Category</label>
                {isCreatingNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      required
                      autoFocus
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Type new category..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-brandRoseGold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewCategory(false);
                        setFormData({ ...formData, category: dynamicCategories[0] || '' });
                      }}
                      className="px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.category}
                    onChange={e => {
                      if (e.target.value === '__NEW__') {
                        setIsCreatingNewCategory(true);
                        setFormData({ ...formData, category: '' });
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-brandRoseGold outline-none appearance-none cursor-pointer"
                  >
                    {dynamicCategories.length > 0 ? (
                      dynamicCategories.map(cat => (
                        <option key={cat} value={cat} className="bg-brandLightPink">{cat}</option>
                      ))
                    ) : (
                      <option value="" disabled className="bg-brandLightPink">No categories found</option>
                    )}
                    <option value="__NEW__" className="bg-brandLightPink text-brandPink font-bold">+ Create New Category...</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Upload Image</label>
                <div className="relative w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-brandRoseGold transition-colors cursor-pointer bg-gray-50">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <UploadCloud className="text-gray-600 mb-2" size={32} />
                  )}
                  <span className="text-sm text-gray-900 font-medium relative z-10 drop-shadow-md">
                    {formData.image ? 'Change Selected Image' : 'Click to Upload File'}
                  </span>
                  <input
                    type="file" accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary py-3 px-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
