import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import Members from './components/Members';
import Transactions from './components/Transactions';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <Books />;
      case 'members':
        return <Members />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;