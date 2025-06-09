import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h1 className="mb-2 text-9xl font-bold text-primary-500">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="max-w-md mb-8 text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            className="flex items-center px-6 py-3 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;