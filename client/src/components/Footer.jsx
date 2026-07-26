import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-brandSilver border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col mb-6 select-none">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 mix-blend-multiply group-hover:scale-110 transition-transform duration-300">
                  <img src="/logo.png" alt="Rithus Beauty Hub Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-serif text-brandBlack font-bold tracking-wider leading-none">Rithus</span>
                  <span className="text-[9px] font-sans tracking-[0.2em] text-gray-500 font-semibold uppercase leading-none mt-0.5">Beauty Hub</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
              Premium luxury bridal makeup and beauty parlour services. 
              Elevate your beauty. Embrace your luxury.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/rithus_beauty_hub" className="text-gray-400 hover:text-brandBlack transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://wa.me/919515229043" className="text-gray-400 hover:text-[#25D366] transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif text-gray-900 font-bold mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 font-medium hover:text-brandBlack text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 font-medium hover:text-brandBlack text-sm transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-600 font-medium hover:text-brandBlack text-sm transition-colors">Our Services</Link></li>
              <li><Link to="/gallery" className="text-gray-600 font-medium hover:text-brandBlack text-sm transition-colors">Bridal Gallery</Link></li>
              <li><Link to="/book" className="text-gray-600 font-medium hover:text-brandBlack text-sm transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif text-gray-900 font-bold mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-600 font-medium hover:text-brandBlack transition-colors">
                <MapPin size={18} className="text-brandBlack shrink-0 mt-0.5" />
                <a href="https://share.google/nQpj20WeOgvFs4Uas" target="_blank" rel="noopener noreferrer">
                  <span>Visit our studio for a premium beauty experience. (Click for Map)</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                <Phone size={18} className="text-brandBlack shrink-0" />
                <span>+91 95152 29043</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                <Mail size={18} className="text-brandBlack shrink-0" />
                <span>info@rithusbeautyhub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Rithus Beauty Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
