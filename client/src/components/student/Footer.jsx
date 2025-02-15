import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full mt-10 px-6 md:px-12 lg:px-36 py-10">
      {/* Footer Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-y-8 md:gap-y-10 gap-x-6 md:gap-x-12 border-b border-white/20 pb-8">
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <img src={assets.logo_dark} alt="logo" className="w-28" />
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            Edemy empowers students with expert-led courses to learn and grow in various fields. Join us and unlock your potential today!
          </p>
        </div>

        <div className="flex flex-col items-center ">
          <h2 className="font-semibold text-lg mb-3 text-cyan-400">Company</h2>
          <ul className="text-sm space-y-2 text-white/80">
            <li><a href="#" className="hover:text-cyan-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Careers</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-lg mb-3 text-cyan-400">Resources</h2>
          <ul className="text-sm space-y-2 text-white/80">
            <li><a href="#" className="hover:text-cyan-400 transition">Blog</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Community</a></li>
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h2 className="font-semibold text-lg mb-3 text-cyan-400">Subscribe</h2>
          <p className="text-sm text-white/80 leading-relaxed text-center sm:text-left">
            Get the latest updates on new courses and offers.
          </p>
          <div className="flex items-center w-full mt-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="border border-cyan-500 bg-gray-800 text-gray-400 placeholder-gray-500 outline-none w-full max-w-full h-10 rounded-l-md px-3 text-sm"
            />
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 sm:px-5 py-2 h-10 text-sm max-w-full rounded-r-md transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-white/60 pt-6">
        <p>© Edemy 2025. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-cyan-400 transition">Terms of Service</a>
          <a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
