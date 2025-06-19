import { Shield, Clock, Medal } from "lucide-react";

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-travel-blue bg-opacity-10 p-4 rounded-full mb-4">
              <Shield className="w-8 h-8 text-travel-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Booking</h3>
            <p className="text-gray-600">Your personal and payment information is protected with industry-leading security</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-travel-blue bg-opacity-10 p-4 rounded-full mb-4">
              <Clock className="w-8 h-8 text-travel-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our travel experts are available around the clock to assist with your journey</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-travel-blue bg-opacity-10 p-4 rounded-full mb-4">
              <Medal className="w-8 h-8 text-travel-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
            <p className="text-gray-600">Found a lower price? We'll match it and give you an additional discount</p>
          </div>
        </div>
      </div>
    </section>
  );
}
