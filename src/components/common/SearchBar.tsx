import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...' }) => {
  return (
    <motion.div 
      className="relative max-w-3xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center h-12 px-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full h-full px-3 bg-transparent border-none outline-none focus:outline-none focus:ring-0"
        />
      </div>
    </motion.div>
  );
};

export default SearchBar;