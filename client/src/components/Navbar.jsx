import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
      <nav className={`w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : (location.pathname === '/' ? 'bg-transparent py-6' : 'bg-white py-6')}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative">
            
            {/* Desktop Nav - Left */}
            <div className="hidden md:flex items-center space-x-8 w-1/3">
              <Link to="/" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-brandPink' : 'text-gray-800 hover:text-brandPink'}`}>Home</Link>
              <Link to="/about" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/about' ? 'text-brandPink' : 'text-gray-800 hover:text-brandPink'}`}>About Us</Link>
              <Link to="/services" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/services' ? 'text-brandPink' : 'text-gray-800 hover:text-brandPink'}`}>Services</Link>
            </div>

            {/* Logo - Center */}
            <div className="w-1/3 flex justify-center">
              <Link to="/" className="text-3xl font-serif text-brandPink font-bold flex items-center gap-2">
                Rithu's Makeover
              </Link>
            </div>

            {/* Desktop Nav - Right */}
            <div className="hidden md:flex items-center justify-end space-x-8 w-1/3">
              <Link to="/gallery" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/gallery' ? 'text-brandPink' : 'text-gray-800 hover:text-brandPink'}`}>Gallery</Link>
              <Link to="/book" className={`text-sm font-semibold uppercase tracking-widest transition-colors ${location.pathname === '/book' ? 'text-brandPink' : 'text-gray-800 hover:text-brandPink'}`}>Book Appointment</Link>
              
              {token ? (
                <button onClick={handleLogout} className="text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-brandPink transition-colors">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold uppercase tracking-widest text-gray-800 hover:text-brandPink transition-colors">Login</Link>
                  <Link to="/signup" className="text-sm font-semibold uppercase tracking-widest text-brandPink hover:text-pink-600 transition-colors">Sign Up</Link>
                </>
              )}
              

            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center absolute right-0">
              <button onClick={() => setIsOpen(!isOpen)} className="text-brandPink focus:outline-none">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 py-4 px-4 shadow-xl">
            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Home</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">About Us</Link>
              <Link to="/services" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Services</Link>
              <Link to="/gallery" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Gallery</Link>
              <Link to="/book" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Book Appointment</Link>
              
              {token ? (
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="text-left text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-gray-800 hover:text-brandPink">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="text-base uppercase font-semibold text-brandPink hover:text-pink-600">Sign Up</Link>
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
