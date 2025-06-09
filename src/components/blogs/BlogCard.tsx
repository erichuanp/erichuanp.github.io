import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  delay?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, description, image, category, delay = 0 }) => {
  return (
    <Link to={`/blogs/${category.toLowerCase().replace(/ /g, '_')}`}>
      <motion.div 
        className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          />
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;