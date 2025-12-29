import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#fbf7f2] text-[#3b3b3b] py-12 border-t border-[#e6ddd2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-lg font-serif font-medium mb-4 text-[#9c7c3a] tracking-[2px]">About Us</h3>
            <p className="font-sans text-sm leading-relaxed">HOMEGROWN INDIAN BRAND</p>
            <p className="font-sans text-sm leading-relaxed">Over 6 Million Happy Customers</p>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium mb-4 text-[#9c7c3a] tracking-[2px]">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/men" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Men</a></li>
              <li><a href="/women" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Women</a></li>
              <li><a href="/kids" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Kids</a></li>
              <li><a href="/sneakers" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Sneakers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium mb-4 text-[#9c7c3a] tracking-[2px]">Support</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium mb-4 text-[#9c7c3a] tracking-[2px]">Seller</h3>
            <ul className="space-y-2">
              <li><a href="/seller-login" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Want to become a seller?</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium mb-4 text-[#9c7c3a] tracking-[2px]">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Facebook</a>
              <a href="#" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Instagram</a>
              <a href="#" className="font-sans text-sm hover:text-[#9c7c3a] transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[#e6ddd2] pt-8 text-center">
          <p className="font-sans text-sm text-[#3b3b3b]">&copy; 2025 The Souled Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;