import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setToken(localStorage.getItem('token'));
      const u = localStorage.getItem('user');
      if (u) {
        try { setUser(JSON.parse(u)); } catch(e) { setUser(null); }
      } else {
        setUser(null);
      }
    };
    handleUpdate();
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Book Now', path: '/book' },
  ];

  return (
    <div className="fixed w-full z-50 transition-all duration-300">
      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : (location.pathname === '/' ? 'bg-transparent py-4' : 'bg-white py-4')}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative">
            
            {/* Desktop Nav - Left */}
            <div className="hidden md:flex items-center space-x-6 w-1/3">
              <Link to="/" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-brandBlack' : 'text-gray-800 hover:text-brandBlack'}`}>Home</Link>
              <Link to="/about" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/about' ? 'text-brandBlack' : 'text-gray-800 hover:text-brandBlack'}`}>About Us</Link>
              <Link to="/services" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/services' ? 'text-brandBlack' : 'text-gray-800 hover:text-brandBlack'}`}>Services</Link>
            </div>

            {/* Mobile Menu Button - Left */}
            <div className="md:hidden flex items-center absolute left-0 z-10">
              <button onClick={() => setIsOpen(!isOpen)} className="text-brandBlack focus:outline-none p-1">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Logo - Center */}
            <div className="w-full md:w-1/3 flex justify-center py-1">
              <Link to="/" className="flex items-center gap-3 group select-none">
                {/* 3D Animated Logo Image */}
                <motion.div 
                  className="w-12 h-12 mix-blend-multiply"
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img src="/logo.png" alt="Rithus Beauty Hub Logo" className="w-full h-full object-contain" />
                </motion.div>
                
                {/* Separator line */}
                <div className="h-7 w-px bg-gray-200"></div>
                
                {/* Text */}
                <div className="flex flex-col justify-center text-left">
                  <span className="text-lg font-serif text-brandBlack font-bold tracking-[0.1em] leading-none mb-0.5 group-hover:text-brandBlack transition-colors">
                    RITHUS
                  </span>
                  <span className="text-[9px] font-sans tracking-[0.2em] text-gray-500 font-semibold uppercase leading-none">
                    BEAUTY HUB
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav - Right */}
            <div className="hidden md:flex items-center justify-end space-x-6 w-1/3">
              <Link to="/gallery" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/gallery' ? 'text-brandBlack' : 'text-gray-800 hover:text-brandBlack'}`}>Gallery</Link>
              <Link to="/book" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/book' ? 'text-brandBlack' : 'text-gray-800 hover:text-brandBlack'}`}>Book Now</Link>
              
              {token && user ? (
                <div className="flex items-center space-x-4">
                  <Link to={user.role === 'admin' ? "/admin/dashboard" : "/profile"} title="My Profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-brandBlack text-white font-bold uppercase text-lg shadow-md hover:scale-105 transition-transform">
                    {user.fullName ? user.fullName[0] : 'U'}
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-brandBlack transition-colors">Login</Link>
                  <Link to="/signup" className="text-sm font-semibold uppercase tracking-widest text-brandBlack hover:text-brandGray transition-colors">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile User Icon / Login - Right */}
            <div className="md:hidden flex items-center absolute right-0 z-10">
              {token && user ? (
                <Link to={user.role === 'admin' ? "/admin/dashboard" : "/profile"} title="My Profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-brandBlack text-white font-bold uppercase text-sm shadow-md">
                  {user.fullName ? user.fullName[0] : 'U'}
                </Link>
              ) : (
                <Link to="/login" className="text-xs font-semibold uppercase tracking-widest text-brandBlack border border-brandBlack px-3 py-1.5 rounded-full hover:bg-brandBlack hover:text-white transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 py-4 px-4 shadow-xl">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">Home</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">About Us</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">Services</Link>
              <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">Gallery</Link>
              <Link to="/book" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">Book Appointment</Link>
              
              {token && user ? (
                <>
                  <Link to={user.role === 'admin' ? "/admin/dashboard" : "/profile"} onClick={() => setIsOpen(false)} className="flex items-center space-x-3 text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brandBlack text-white font-bold uppercase text-sm shadow-md">
                      {user.fullName ? user.fullName[0] : 'U'}
                    </div>
                    <span>My Profile</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandBlack">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-brandBlack hover:text-brandGray">Sign Up</Link>
                </>
              )}
              

            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
