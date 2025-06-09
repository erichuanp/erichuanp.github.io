import React from 'react';
import SearchBar from '../components/common/SearchBar';
import ToolCard from '../components/tools/ToolCard';
import PageTransition from '../components/common/PageTransition';
import { generateTools } from '../utils/generateToolData';

const ToolsPage: React.FC = () => {
  const tools = generateTools(28);

  return (
    <PageTransition>
      <div className="container py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4">Development Tools</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Discover the essential tools that can enhance your development workflow and boost productivity.
          </p>
        </div>
        
        <SearchBar placeholder="Search tools..." />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default ToolsPage;