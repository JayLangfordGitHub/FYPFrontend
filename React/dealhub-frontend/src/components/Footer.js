import React from 'react';
import { Mail, Instagram, Twitter, Facebook, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-amazon-blue text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About DealHub</h3>
            <p className="text-gray-300 mb-4">
              DealHub aggregates the best Amazon deals in one place, 
              helping you save money with real-time tracking and alerts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Code size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">Home</a>
              </li>
              <li>
                <a href="/deals" className="text-gray-300 hover:text-white">All Deals</a>
              </li>
              <li>
                <a href="/categories" className="text-gray-300 hover:text-white">Categories</a>
              </li>
              <li>
                <a href="/top-deals" className="text-gray-300 hover:text-white">Top Deals</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/category/electronics" className="text-gray-300 hover:text-white">Electronics</a>
              </li>
              <li>
                <a href="/category/home-kitchen" className="text-gray-300 hover:text-white">Home & Kitchen</a>
              </li>
              <li>
                <a href="/category/fashion" className="text-gray-300 hover:text-white">Fashion</a>
              </li>
              <li>
                <a href="/category/books" className="text-gray-300 hover:text-white">Books</a>
              </li>
              <li>
                <a href="/category/toys" className="text-gray-300 hover:text-white">Toys & Games</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="flex items-center text-gray-300 mb-2">
              <Mail size={16} className="mr-2" />
              support@dealhub.com
            </p>
            <p className="text-gray-300">
              Have suggestions or feedback? We'd love to hear from you!
            </p>
            <a href="/contact" className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded">
              Contact Us
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} DealHub. All rights reserved.</p>
          <p className="mt-2 text-sm">
            DealHub is not affiliated with Amazon. Amazon and the Amazon logo are trademarks of Amazon.com, Inc.
          </p>
          <div className="mt-4 space-x-4">
            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;