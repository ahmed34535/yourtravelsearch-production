import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-heading text-3xl font-bold text-travel-blue mb-6">YourTravelSearch</h3>
            <p className="text-body text-gray-300 mb-6 leading-relaxed">Your trusted partner for unforgettable travel experiences worldwide with transparent pricing and no hidden fees.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-travel-blue transition-all duration-200 transform hover:scale-110">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue transition-all duration-200 transform hover:scale-110">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue transition-all duration-200 transform hover:scale-110">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue transition-all duration-200 transform hover:scale-110">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-subheading text-xl font-semibold mb-6 text-white">Services</h4>
            <ul className="space-y-4">
              <li><Link href="/flights" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Flight Booking</Link></li>
              <li><Link href="/hotels" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Hotel Reservations</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Vacation Packages</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Group Travel</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Travel Planning</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-subheading text-xl font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Help Center</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Contact Us</Link></li>
              <li><Link href="/profile?tab=bookings" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Manage Booking</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Cancellation Policy</Link></li>
              <li><Link href="/support" className="text-body text-gray-300 hover:text-travel-blue transition-all duration-200 hover:translate-x-1">Travel Advisories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-travel-blue transition-colors">About Us</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-travel-blue transition-colors">Careers</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-travel-blue transition-colors">Press</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-travel-blue transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-travel-blue transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">© 2024 YourTravelSearch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
