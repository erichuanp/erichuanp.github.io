import React from 'react';
import SearchBar from '../components/common/SearchBar';
import ToolCard from '../components/tools/ToolCard';
import PageTransition from '../components/common/PageTransition';
import { generateCategorizedTools } from '../utils/generateToolData';
import { motion } from 'framer-motion';

const ToolsPage: React.FC = () => {
  const toolCategories = generateCategorizedTools();

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4">效率工具</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            探索提高生产力的小工具
          </p>
        </div>
        
        <SearchBar placeholder="Search tools..." />
        
        <div className="space-y-12">
          {toolCategories.map((category, categoryIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="space-y-6"
            >
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {category.tools.map((tool, toolIndex) => (
                  <ToolCard
                    key={tool.id}
                    name={tool.name}
                    description={tool.description}
                    index={toolIndex}
                    toolPath={tool.toolPath}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default ToolsPage;