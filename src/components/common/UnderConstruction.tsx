import React from 'react';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnderConstructionProps {
  title?: string;
  message?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ 
  title = 'Under Construction',
  message = 'We are currently working on this page. Please check back soon for updates!'
}) => {
  return (
    <div className="under-construction">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center"
      >
        <Construction size={80} className="mb-4 text-primary-500 animate-bounce-slow" />
        <h1 className="mb-4 text-4xl font-bold text-gray-800">{title}</h1>
        <p className="max-w-md text-xl text-gray-600">{message}</p>
      </motion.div>
    </div>
  );
};

export default UnderConstruction;