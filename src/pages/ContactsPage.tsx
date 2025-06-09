import React from 'react';
import PageTransition from '../components/common/PageTransition';
import UnderConstruction from '../components/common/UnderConstruction';

const ContactsPage: React.FC = () => {
  return (
    <PageTransition>
      <UnderConstruction 
        title="Contact Us" 
        message="Our contact page is coming soon. In the meantime, you can reach us through our social media channels."
      />
    </PageTransition>
  );
};

export default ContactsPage;