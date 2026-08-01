import React from 'react';
import { ShoppingCart } from 'lucide-react';
import {  FaFacebook, FaInstagram, FaTwitter} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0f1423] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-8 h-8 text-[#e91e63]" strokeWidth={2.5} />
              <span className="text-[#e91e63] font-bold text-2xl tracking-wide">KART</span>
            </div>
            <p className="text-sm mb-6 text-gray-300">
              Powering Your World with the Best in Electronics.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>123 Electronics St, Style City, NY 10001</p>
              <p>Email: <a href="mailto:support@Zaptro.com" className="hover:text-white transition-colors">support@Zaptro.com</a></p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-[#e91e63] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#e91e63] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#e91e63] transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-[#e91e63] transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-[#e91e63] transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-6">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-[#e91e63] transition-colors" aria-label="Facebook">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[#e91e63] transition-colors" aria-label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[#e91e63] transition-colors" aria-label="Twitter">
                <FaTwitter className="h-5 w-5" />
              </a>
              
              <a href="#" className="text-white hover:text-[#e91e63] transition-colors" aria-label="Pinterest">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.437 2.977 7.437 6.945 0 4.156-2.616 7.502-6.248 7.502-1.22 0-2.367-.634-2.758-1.381s-.603 2.296-.75 2.853c-.225.856-.832 1.927-1.24 2.582 1.144.35 2.348.539 3.595.539 6.621 0 11.988-5.368 11.988-11.987C24.004 5.367 18.638 0 12.017 0z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">Stay in the Loop</h3>
            <p className="text-sm mb-4 text-gray-300">
              Subscribe to get special offers, free giveaways, and more
            </p>
            <form className="flex w-full mt-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-transparent rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#e91e63]"
                required
              />
              <button 
                type="submit" 
                className="px-5 py-2 text-sm font-medium text-white bg-[#e91e63] rounded-r-md hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:ring-offset-2 focus:ring-offset-[#0f1423]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        
        <div className="mt-12 pt-8 border-t border-gray-800 flex justify-center items-center">
          <p className="text-sm text-gray-400">
            © 2025 <span className="text-[#e91e63] font-medium">EKart</span>. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;