import HeroSection from "@/components/hero-section";
import FlightDeals from "@/components/flight-deals";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import CTASection from "@/components/cta-section";
import { SEOHead } from "@/components/SEOHead";

export default function Home() {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "YourTravelSearch",
    "description": "Find and book cheap flights, hotels, and vacation packages. Compare prices from major airlines and travel providers worldwide.",
    "url": "https://yourtravelsearch.com",
    "logo": "https://yourtravelsearch.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-TRAVEL-1",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://facebook.com/yourtravelsearch",
      "https://twitter.com/yourtravelsearch",
      "https://instagram.com/yourtravelsearch"
    ],
    "offers": {
      "@type": "AggregateOffer",
      "category": "Travel Services",
      "description": "Flight bookings, hotel reservations, and vacation packages"
    }
  };

  return (
    <div>
      <SEOHead
        title="YourTravelSearch - Book Cheap Flights, Hotels & Vacation Packages"
        description="Find and book the best deals on flights, hotels, and vacation packages. Compare prices from major airlines and travel providers. Best price guarantee and instant confirmation."
        canonicalUrl="https://yourtravelsearch.com/"
        structuredData={homeStructuredData}
        ogImage="https://yourtravelsearch.com/og-home.jpg"
      />
      <HeroSection />
      <FlightDeals />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}
