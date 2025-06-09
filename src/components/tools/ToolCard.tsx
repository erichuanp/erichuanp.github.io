import React from 'react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  name: string;
  description: string;
  index: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ name, description, index }) => {
  const handleClick = () => {
    // 这里可以添加点击后的逻辑，比如跳转到工具详情页
    console.log(`Clicked on ${name}`);
  };

  return (
    <motion.div 
      className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <div className="p-6">
        <h3 className="mb-2 text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </motion.div>
  );
};

export default ToolCard;