import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ className = "h-64" }) => {
  return (
    <div className={`flex justify-center items-center w-full ${className}`}>
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center"
      >
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
        />
      </motion.div>
    </div>
  );
};

export default Loader;
