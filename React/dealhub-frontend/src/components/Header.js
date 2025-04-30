import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-slate-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400 mb-4 md:mb-0">
          DealHub
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/deals" className="hover:text-yellow-400 transition">All Deals</Link>
          <Link to="/lightning-deals" className="hover:text-yellow-400 transition">Lightning Deals</Link>
          <Link to="/top-deals" className="hover:text-yellow-400 transition">Top Deals</Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex-grow max-w-md ml-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search deals..."
              className="w-full py-2 px-4 pr-10 rounded-lg text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-full px-3 bg-yellow-400 rounded-r-lg text-black"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;