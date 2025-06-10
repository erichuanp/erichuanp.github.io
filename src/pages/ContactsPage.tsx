import React from 'react';
import PageTransition from '../components/common/PageTransition';
import UnderConstruction from '../components/common/UnderConstruction';

const ContactsPage: React.FC = () => {
  return (
    <PageTransition>
      <UnderConstruction 
        title="Contact Us" 
        message="建设中"
      />
    </PageTransition>
  );
};

export default ContactsPage;