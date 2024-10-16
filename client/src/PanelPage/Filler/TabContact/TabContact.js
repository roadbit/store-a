import React, { useState } from 'react';

import FooterLinks from './FooterLink'

const TabContact = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const renderContent = () => {
    switch (activeTab) {
      case 'tab1':
        return <div><FooterLinks /></div>;
      default:
        return <div>Виберіть таб для перегляду контенту</div>;
    }
  };

  return (
    <div className="tab_container-adm">
      <div className="tab_buttons-adm">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>Додати соц-мережі\телефони (футер)</button>
      </div>
      <div className="tab_content-adm">
        {renderContent()}
      </div>
    </div>
  );
};

export default TabContact;