import React from 'react';
import PageTransition from '../components/common/PageTransition';
import UnderConstruction from '../components/common/UnderConstruction';

const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <UnderConstruction 
        title="Welcome to TechHub" 
        message="Our home page is currently under construction. We're working hard to bring you the best development resources. Stay tuned for our launch!"
      />
    </PageTransition>
  );
};

export default HomePage;