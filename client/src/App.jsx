import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Sparkles, Scissors, Droplet, Flower2, Heart, Crown, Gem, Star, Brush } from 'lucide-react';

const AnimatedBackground = () => {
  const location = useLocation();

  // Elegant makeup tones: Rose Gold, Soft Pink, Foundation Beige, Warm Peach, Lavender
  const makeupColors = [
    'bg-[#B76E79]/10', // Rose Gold
    'bg-[#FFB6C1]/10', // Soft Pink
    'bg-[#E8D5C4]/20', // Foundation Beige
    'bg-[#FFDAB9]/10', // Warm Peach
    'bg-[#E6E6FA]/10', // Soft Lavender
    'bg-[#F5F5DC]/20', // Beige Powder
  ];

  const BeautyIcons = [Scissors, Droplet, Flower2, Heart, Crown, Gem, Sparkles, Star, Brush];
  const iconColors = [
    'text-[#B76E79]/30', 
    'text-brandBlack/20', 
    'text-[#FFB6C1]/40', 
    'text-amber-500/30'
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Floating makeup powder puffs (blurry orbs) */}
      {makeupColors.map((colorClass, i) => (
        <motion.div
          key={`orb-${i}`}
          className={`absolute rounded-full blur-[90px] ${colorClass}`}
          animate={{
            x: [Math.random() * 250, Math.random() * -250, Math.random() * 250],
            y: [Math.random() * 250, Math.random() * -250, Math.random() * 250],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: `${300 + Math.random() * 300}px`,
            height: `${300 + Math.random() * 300}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Floating beauty icons */}
      {[...Array(40)].map((_, i) => {
        const Icon = BeautyIcons[i % BeautyIcons.length];
        const colorClass = iconColors[i % iconColors.length];
        
        // Randomize waypoints for organic drifting
        const y1 = Math.random() * 200 - 100;
        const y2 = Math.random() * 200 - 100;
        const x1 = Math.random() * 200 - 100;
        const x2 = Math.random() * 200 - 100;

        return (
          <motion.div
            key={`icon-${i}`}
            className={`absolute ${colorClass}`}
            animate={{
              y: [0, y1, y2, 0],
              x: [0, x1, x2, 0],
              rotate: [0, 120, 240, 360],
              opacity: [0.0, 0.5, 0.5, 0.0],
              scale: [0.6, 1, 1, 0.6]
            }}
            transition={{
              duration: 20 + Math.random() * 15, // Very slow, relaxing drift
              repeat: Infinity,
              ease: "linear", // Linear ease for constant speed, no yo-yo effect
              delay: Math.random() * 10 // Staggered start times
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Icon size={Math.random() * 20 + 20} strokeWidth={1.2} />
          </motion.div>
        );
      })}
    </div>
  );
};

const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Navbar />;
};

const ConditionalFooter = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Footer />;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <main className={`flex-grow ${isAdmin ? '' : 'pt-20'} relative z-10`}>
      {children}
    </main>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const IdleTimer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set timeout for 1 hour (3600000 ms)
      timeoutId = setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('storage'));
          navigate('/login');
        }
      }, 3600000);
    };

    // Events to track activity
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    // Throttle the event listeners slightly to improve performance
    let throttleTimer;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        resetTimer();
        throttleTimer = null;
      }, 500);
    };
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(throttleTimer);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);

  return null;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && !user) {
      axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('storage'));
        }
      });
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <IdleTimer />
      <div className="flex flex-col min-h-screen bg-transparent relative">
        <AnimatedBackground />
        <ConditionalNavbar />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route 
              path="/book" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin/dashboard/*" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </MainLayout>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
