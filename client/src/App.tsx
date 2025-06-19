import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { LiveChatButton } from "@/components/LiveChat";
import { useEffect } from "react";

// Global click tracking for user interaction monitoring
function setupGlobalClickTracking() {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const clickData = {
      timestamp: new Date().toISOString(),
      elementType: target.tagName,
      elementText: target.textContent?.slice(0, 100) || '',
      elementId: target.id || '',
      elementClass: target.className || '',
      href: target.getAttribute('href') || '',
      currentPage: window.location.pathname,
      coordinates: { x: event.clientX, y: event.clientY }
    };
    console.log('[User Click Tracked]', clickData);
  });

  // Track navigation changes
  window.addEventListener('popstate', () => {
    console.log('[Navigation Change]', {
      timestamp: new Date().toISOString(),
      newPath: window.location.pathname,
      search: window.location.search
    });
  });

  // Track form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    console.log('[Form Submission]', {
      timestamp: new Date().toISOString(),
      formId: form.id || '',
      formAction: form.action || '',
      currentPage: window.location.pathname
    });
  });
}
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Flights from "@/pages/flights";
import Hotels from "@/pages/hotels";
import Cars from "@/pages/cars";
import Packages from "@/pages/packages";
import FlightDetails from "@/pages/flight-details";
import HotelDetails from "@/pages/hotel-details";
import DestinationDetails from "@/pages/destination-details";
import SearchResults from "@/pages/search-results";
import FlightResults from "@/pages/flight-results";
import Booking from "@/pages/booking";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import BookingCheckout from "@/pages/booking-checkout";
import BookingConfirmation from "@/pages/booking-confirmation";
import AdminDashboard from "@/pages/admin-dashboard";
import GettingStarted from "@/pages/getting-started";
import GroupTravel from "@/pages/group-travel";
import TravelPlanning from "@/pages/travel-planning";
import HelpCenter from "@/pages/help-center";
import ContactUs from "@/pages/contact-us";
import ManageBooking from "@/pages/manage-booking";
import LiveAPITest from "@/pages/live-api-test";
import CancellationPolicy from "@/pages/cancellation-policy";
import TravelAdvisories from "@/pages/travel-advisories";
import AboutUs from "@/pages/about-us";
import Careers from "@/pages/careers";
import Press from "@/pages/press";
import Support from "@/pages/support";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CheckoutTestEnvironment } from "@/dev/checkout-test";
import CorporateCheckoutEnvironment from "@/dev/corporate-checkout";
import WebhookManagement from "@/pages/webhook-management";
import OperationsDashboard from "@/pages/operations-dashboard";
import FlightRoute from "@/pages/FlightRoute";
import CheapFlightsTo from "@/pages/CheapFlightsTo";
import FlightDealDetails from "@/pages/flight-deal-details";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import PassengerDetails from "@/pages/passenger-details";
import BookingReview from "@/pages/booking-review";
import SEODashboard from "@/pages/seo-dashboard";
import SEODemo from "@/pages/seo-demo";
import GoogleSEODashboard from "@/pages/google-seo-dashboard";
import SEOSurfDashboard from "@/pages/seosurf-dashboard";
import SEOAutomation from "@/pages/seo-automation";
import CustomSEODashboard from "@/pages/custom-seo-dashboard";
import GapAnalysis from "@/pages/gap-analysis";
import AhrefsDashboard from "@/pages/ahrefs-dashboard";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/getting-started" component={GettingStarted} />
          <Route path="/flights" component={Flights} />
          <Route path="/hotels" component={Hotels} />
          <Route path="/cars" component={Cars} />
          <Route path="/packages" component={Packages} />
          <Route path="/flights/:id" component={FlightDetails} />
          <Route path="/hotels/:id" component={HotelDetails} />
          <Route path="/destinations/:id" component={DestinationDetails} />
          <Route path="/search-results" component={SearchResults} />
          <Route path="/flight-results" component={FlightResults} />
          <Route path="/booking" component={Booking} />
          <Route path="/passenger-details" component={PassengerDetails} />
          <Route path="/booking-review" component={BookingReview} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/booking-confirmation" component={BookingConfirmation} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
          <Route path="/checkout/:type/:id" component={BookingCheckout} />
          <Route path="/booking-confirmation/:reference" component={BookingConfirmation} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          <Route path="/group-travel" component={GroupTravel} />
          <Route path="/travel-planning" component={TravelPlanning} />
          <Route path="/help-center" component={HelpCenter} />
          <Route path="/contact-us" component={ContactUs} />
          <Route path="/manage-booking" component={ManageBooking} />
          <Route path="/live-api-test" component={LiveAPITest} />
          <Route path="/cancellation-policy" component={CancellationPolicy} />
          <Route path="/travel-advisories" component={TravelAdvisories} />
          <Route path="/about-us" component={AboutUs} />
          <Route path="/careers" component={Careers} />
          <Route path="/press" component={Press} />
          <Route path="/support" component={Support} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/webhooks" component={WebhookManagement} />
          <Route path="/operations" component={OperationsDashboard} />
          <Route path="/seo-dashboard" component={SEODashboard} />
          <Route path="/google-seo" component={GoogleSEODashboard} />
          <Route path="/seosurf" component={SEOSurfDashboard} />
          <Route path="/seo-automation" component={SEOAutomation} />
          <Route path="/custom-seo" component={CustomSEODashboard} />
          <Route path="/gap-analysis" component={GapAnalysis} />
          <Route path="/ahrefs-dashboard" component={AhrefsDashboard} />
          <Route path="/dev/checkout-test" component={CheckoutTestEnvironment} />
          <Route path="/dev/corporate-checkout" component={CorporateCheckoutEnvironment} />
          <Route path="/flight-deal-details" component={FlightDealDetails} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          {/* SEO-optimized flight route pages */}
          <Route path="/flights-from-:from-to-:to" component={FlightRoute} />
          <Route path="/cheap-flights-to-:destination" component={CheapFlightsTo} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <LiveChatButton />
    </div>
  );
}

function App() {
  useEffect(() => {
    setupGlobalClickTracking();
    console.log('[User Tracking] Global click tracking initialized');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
