import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code size={24} />
            <span className="text-xl font-bold">TechHub</span>
          </div>
          <p className="text-gray-400">&copy; {currentYear} TechHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;