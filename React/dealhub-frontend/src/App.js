import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import NavigationTabs from './components/NavigationTabs';
import FeaturedDeals from './components/FeaturedDeals';
import HomePage from './pages/HomePage';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LightningDealsPage from './pages/LightningDealsPage';
import TopDealsPage from './pages/TopDealsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deal/:dealId" element={<DealDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/lightning-deals" element={<LightningDealsPage />} />
            <Route path="/top-deals" element={<TopDealsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;