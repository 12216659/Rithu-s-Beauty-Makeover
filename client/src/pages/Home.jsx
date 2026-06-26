import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, servicesRes] = await Promise.all([
          axios.get('https://rithusbackend.onrender.com/api/reviews'),
          axios.get('https://rithusbackend.onrender.com/api/services')
        ]);
        setReviews(reviewsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoadingReviews(false);
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-brandLightPink pt-20">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-brandPink/10 rounded-full blur-2xl"
              animate={{
                x: [Math.random() * 100, Math.random() * 500 - 250],
                y: [Math.random() * 100, Math.random() * 500 - 250],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{
                width: `${150 + Math.random() * 250}px`,
                height: `${150 + Math.random() * 250}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div 
          className="absolute inset-y-0 right-0 w-full md:w-[55%] z-0 hidden md:block"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)', maskImage: 'linear-gradient(to right, transparent, black 30%)' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1000" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center mix-blend-multiply opacity-90"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-xl text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-sans text-brandPink mb-6 leading-tight font-bold">
              It's your time to <br/>Shine Brighter
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-10 font-medium">
              Book your Professional Bridal Makeup
            </p>
            <div className="flex justify-center md:justify-start">
              <Link to="/book" className="btn-primary">
                BOOK NOW
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quotation Section */}
      <section className="py-16 bg-brandPink text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-x-10 translate-y-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-6xl font-serif text-white/30 absolute -top-8 left-1/2 -translate-x-1/2">"</span>
            <h3 className="text-white text-3xl md:text-4xl font-serif leading-relaxed font-medium mb-6 relative z-10">
              Beauty begins the moment you decide to be yourself. We are just here to add a little magic.
            </h3>
            <p className="text-pink-100 uppercase tracking-widest text-sm font-bold">— Rithu's Makeover</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <motion.div {...fadeInUp} className="flex flex-col items-center">
              <h3 className="text-5xl font-bold text-brandPink mb-2">+9</h3>
              <p className="text-gray-600 font-medium text-sm tracking-wider uppercase">Years in Business</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              <h3 className="text-5xl font-bold text-brandPink mb-2">+5k</h3>
              <p className="text-gray-600 font-medium text-sm tracking-wider uppercase">Happy Clients</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="flex flex-col items-center">
              <h3 className="text-5xl font-bold text-brandPink mb-2">+500</h3>
              <p className="text-gray-600 font-medium text-sm tracking-wider uppercase">Students Trained</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              {...fadeInUp}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-brandLightPink to-pink-100 rounded-2xl opacity-50 blur-lg"></div>
              <img 
                src="/about-image.png" 
                alt="Bridal Makeup Services" 
                className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full border-4 border-white"
              />
              <div className="absolute -bottom-6 -right-6 bg-brandPink text-white p-6 rounded-2xl shadow-xl hidden sm:block">
                <p className="text-3xl font-serif font-bold">100%</p>
                <p className="text-sm uppercase tracking-wider font-medium">Client Satisfaction</p>
              </div>
            </motion.div>
            <motion.div {...fadeInUp}>
              <h4 className="text-brandPink tracking-widest uppercase text-sm font-bold mb-2">About Us</h4>
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Expert Touch for Your Special Day</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At Rithu's Beauty Makeover, we believe every bride deserves to look and feel absolute perfection. With years of expertise in professional bridal makeup, we use only premium international products to ensure a flawless, long-lasting finish.
              </p>
              <ul className="space-y-4 mb-8">
                {['Premium International Products', 'Expert Bridal Artists', 'Customized Looks', 'On-venue Services Available'].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 font-medium">
                    <CheckCircle className="text-brandPink mr-3" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-brandLightPink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-brandPink tracking-widest uppercase text-sm font-bold mb-2">What We Offer</h4>
            <h2 className="text-4xl font-serif text-gray-900">Our Premium Services</h2>
          </div>
          
          {loadingServices ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-brandPink" size={48} />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 glass-card max-w-2xl mx-auto">
              <p className="text-gray-500">Our premium services will be listed here soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="glass-card overflow-hidden group cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-brandBlack/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 relative">
                    <h3 className="text-2xl font-serif text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <Link to="/services" className="text-brandPink flex items-center hover:text-pink-600 transition-colors text-sm font-bold uppercase tracking-wider">
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/services" className="btn-outline inline-block">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-brandPink tracking-widest uppercase text-sm font-bold mb-2">Testimonials</h4>
            <h2 className="text-4xl font-serif text-gray-900">What Our Clients Say</h2>
          </div>

          {loadingReviews ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-brandPink" size={48} />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <p className="text-gray-500">No reviews yet. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, idx) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="glass-card p-8 flex flex-col items-center text-center relative shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white outline outline-brandPink shadow-xl mb-6"
                  />
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 leading-relaxed flex-grow">
                    "{review.message}"
                  </p>
                  <h4 className="text-gray-900 font-serif tracking-wider font-bold uppercase text-xs">{review.name}</h4>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
