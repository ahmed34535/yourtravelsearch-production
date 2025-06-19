import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { useLocation } from "wouter";
import TravelSelector from "@/components/travel-selector-fixed";

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero Background */}
      <div 
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        


        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center space-y-10">
            <div className="space-y-6 max-w-5xl mx-auto">
              <h1 className="text-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight text-white font-black" style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)'
              }}>
                Find Flights
                <br />
                That Actually Work
              </h1>
              <p className="text-body-medium text-lg sm:text-xl md:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium" style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)'
              }}>
                We built this platform because we got tired of booking sites that show one price, 
                then add fees at checkout. Here's what you see upfront is what you pay.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="btn-premium text-white px-12 py-5 text-lg font-bold rounded-2xl h-auto min-w-[220px] shadow-2xl"
              >
                Search Flights
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-secondary px-12 py-5 text-lg font-bold rounded-2xl h-auto min-w-[220px] backdrop-blur-sm border-2 border-white/40 text-white hover:text-travel-blue"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>


      </div>
      
      {/* Search Interface */}
      <div className="absolute bottom-0 left-0 right-0 pb-20 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="search-container rounded-3xl shadow-2xl">
            <TravelSelector />
          </div>
        </div>
      </div>
    </section>
  );
}
