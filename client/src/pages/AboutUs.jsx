import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">About <span className="text-brandPink">Rithu's Makeover</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium">Your trusted partner in uncovering your true beauty for your most special moments.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div {...fadeInUp} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-brandLightPink to-pink-100 rounded-2xl opacity-50 blur-lg"></div>
            <img 
              src="/about-image.png" 
              alt="Bridal Makeup Services" 
              className="relative rounded-2xl shadow-xl object-cover h-[500px] w-full"
            />
          </motion.div>
          <motion.div {...fadeInUp}>
            <h4 className="text-brandPink tracking-widest uppercase text-sm font-bold mb-2">Our Story</h4>
            <h2 className="text-4xl font-serif text-gray-900 mb-6">Expert Touch for Your Special Day</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Rithu's Makeover, we believe every bride deserves to look and feel absolute perfection. With years of expertise in professional bridal makeup, we use only premium international products to ensure a flawless, long-lasting finish.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our journey began with a simple passion: to make women feel empowered and beautiful. Today, we are proud to have served thousands of happy clients, delivering personalized styles that match their unique personalities and visions.
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

        <motion.div 
          {...fadeInUp}
          className="bg-brandLightPink rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-serif text-brandPink mb-4">Ready to Shine Brighter?</h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Let us be a part of your journey. Book your appointment today and experience the magic of professional makeup styling.
          </p>
          <a href="/book" className="btn-primary inline-block">Book an Appointment</a>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
