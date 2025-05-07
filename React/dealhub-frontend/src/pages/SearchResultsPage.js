import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DealCard from '../components/DealCard';
import { Search, Loader, AlertCircle } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/deals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        
        const allDeals = await response.json();
        
        // Filter deals that match the search query
        const filteredDeals = allDeals.filter(deal => 
          deal.deal_title.toLowerCase().includes(query.toLowerCase()) ||
          deal.deal_type.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(filteredDeals);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search Results for "${query}"` : 'Search Results'}
      </h1>

      {/* Search form for refining search */}
      <div className="mb-8 max-w-md">
        <form action="/search" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search deals..."
            className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300"
          />
          <button 
            type="submit"
            className="absolute right-0 top-0 h-full px-3 bg-yellow-400 rounded-r-lg text-black"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={36} />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-blue-600" size={36} />
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-gray-600 mb-6">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </p>

          {/* No results */}
          {results.length === 0 && !loading && !error && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found</h2>
              <p className="text-gray-500 mb-4">
                We couldn't find any deals matching "{query}".
              </p>
              <Link 
                to="/deals" 
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded"
              >
                Browse All Deals
              </Link>
            </div>
          )}

          {/* Results grid */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((deal) => (
                <DealCard
                  key={deal.deal_id}
                  id={deal.deal_id}
                  title={deal.deal_title}
                  description={deal.deal_type}
                  originalPrice={deal.list_price}
                  dealPrice={deal.deal_price}
                  discount={deal.savings_percentage}
                  imageUrl={deal.deal_photo}
                  timeRemaining={deal.deal_ends_at}
                  dealType={deal.deal_type?.toLowerCase().includes('flash') 
                    ? 'flash' 
                    : deal.deal_type?.toLowerCase().includes('daily') 
                      ? 'daily' 
                      : 'trending'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;