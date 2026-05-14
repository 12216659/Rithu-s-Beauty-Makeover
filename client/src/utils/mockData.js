export const initialServices = [
  { id: 1, title: "Makeup Services", description: "Professional makeup services for any special occasion.", price: 5000, duration: "1.5 hours", image: "/images/makeup_services.png" },
  { id: 2, title: "Saree Draping", description: "Professional saree draping in various elegant traditional and modern styles.", price: 1500, duration: "45 mins", image: "/images/saree_draping.png" },
  { id: 3, title: "Hair Style", description: "Advanced hair styling including elegant floral settings and braids.", price: 2500, duration: "1 hour", image: "/images/hair_style.png" },
  { id: 4, title: "Sider Makeup", description: "Subtle and elegant makeup designed specifically for bridesmaids.", price: 4000, duration: "1.5 hours", image: "/images/sider_makeup.png" },
  { id: 5, title: "Party Makeup", description: "Glamorous look perfect for evening parties and receptions.", price: 5000, duration: "1.5 hours", image: "/images/party_makeup.png" },
  { id: 6, title: "Baby Shower Makeup", description: "Gentle and glowing makeup to make your baby shower memorable.", price: 8000, duration: "2 hours", image: "/images/baby_shower.png" }
];

export const initialGallery = [
  { id: 1, url: '/images/makeup_services.png', category: 'Makeup Services' },
  { id: 2, url: '/images/saree_draping.png', category: 'Saree Draping' },
  { id: 3, url: '/images/hair_style.png', category: 'Hairstyles' },
  { id: 4, url: '/images/sider_makeup.png', category: 'Sider Makeup' },
  { id: 5, url: '/images/party_makeup.png', category: 'Party Makeup' },
  { id: 6, url: '/images/baby_shower.png', category: 'Baby Shower Makeup' },
];

export const initialBookings = [
  { id: 'BKG-1001', name: 'Priya Sharma', service: 'Makeup Services', date: '2026-06-15', status: 'Pending' },
  { id: 'BKG-1002', name: 'Anjali Desai', service: 'Party Makeup', date: '2026-05-20', status: 'Confirmed' },
  { id: 'BKG-1003', name: 'Neha Reddy', service: 'Saree Draping', date: '2026-05-12', status: 'Completed' },
];

export const initialReviews = [
  { id: 1, name: 'Kavya Rao', rating: 5, message: 'Absolutely loved my bridal makeup! It lasted all night and looked flawless.', image: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Smriti Mandhana', rating: 5, message: 'Best party makeup I have ever had. The glassy look was stunning.', image: 'https://i.pravatar.cc/150?img=5' },
];

export const getStoredData = (key, initialData) => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

export const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
