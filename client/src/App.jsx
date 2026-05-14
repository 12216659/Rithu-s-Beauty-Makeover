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
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-brandPink/5 rounded-full blur-xl"
          animate={{
            x: [Math.random() * 100, Math.random() * 500 - 250],
            y: [Math.random() * 100, Math.random() * 500 - 250],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white relative">
        <AnimatedBackground />
        <ConditionalNavbar />
        <main className="flex-grow pt-20 relative z-10">
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
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
