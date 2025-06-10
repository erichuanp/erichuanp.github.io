import React from 'react';
import PageTransition from '../components/common/PageTransition';
import UnderConstruction from '../components/common/UnderConstruction';

const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <UnderConstruction 
        title="Welcome To Tendou" 
        message="施工中"
      />
    </PageTransition>
  );
};

export default HomePage;