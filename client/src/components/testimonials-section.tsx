import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "San Francisco, CA",
      avatar: "SC",
      rating: 5,
      text: "YourTravelSearch made planning our European vacation effortless. The interface is intuitive, prices are competitive, and customer service was exceptional when we needed to make changes.",
      trip: "3-week Europe Tour"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      location: "Miami, FL",
      avatar: "MR",
      rating: 5,
      text: "I travel frequently for business and YourTravelSearch has become my go-to platform. The booking process is quick, and I love the detailed flight information and seat selection options.",
      trip: "Business Travel"
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "London, UK",
      avatar: "ET",
      rating: 5,
      text: "Found an amazing last-minute deal for our anniversary trip to Japan. The package included flights, hotels, and even some activities. Everything was perfectly organized.",
      trip: "Anniversary Getaway"
    },
    {
      id: 4,
      name: "David Kim",
      location: "Toronto, Canada",
      avatar: "DK",
      rating: 5,
      text: "The family package deals are incredible. We saved over $2,000 on our Disney World vacation compared to booking separately. The kids were thrilled!",
      trip: "Family Vacation"
    },
    {
      id: 5,
      name: "Isabella Santos",
      location: "São Paulo, Brazil",
      avatar: "IS",
      rating: 5,
      text: "As a solo female traveler, I appreciate the detailed hotel reviews and safety information. YourTravelSearch helps me feel confident about my destination choices.",
      trip: "Solo Adventure"
    },
    {
      id: 6,
      name: "James Wilson",
      location: "Sydney, Australia",
      avatar: "JW",
      rating: 5,
      text: "The mobile app is fantastic for managing bookings on the go. Had to change our flight during a layover, and it was done in minutes through the app.",
      trip: "Honeymoon Trip"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join millions of satisfied customers who have discovered the world through YourTravelSearch. 
            Read their stories and experiences.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300 relative">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Trip Type */}
                <div className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full inline-block mb-4">
                  {testimonial.trip}
                </div>

                {/* User Info */}
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${testimonial.avatar}&background=3b82f6&color=ffffff`} />
                    <AvatarFallback className="bg-blue-600 text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted & Certified
            </h3>
            <p className="text-gray-600">
              We maintain the highest standards of security and service quality
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b2/IATA_logo.svg" 
                  alt="IATA Certified" 
                  className="h-8 mx-auto grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="text-sm text-gray-600">IATA Certified</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <div className="h-8 flex items-center justify-center text-green-600 font-bold text-sm">
                  SSL SECURE
                </div>
              </div>
              <div className="text-sm text-gray-600">SSL Protected</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <div className="h-8 flex items-center justify-center text-blue-600 font-bold text-sm">
                  PCI DSS
                </div>
              </div>
              <div className="text-sm text-gray-600">Payment Secure</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                <div className="h-8 flex items-center justify-center text-purple-600 font-bold text-sm">
                  24/7 SUPPORT
                </div>
              </div>
              <div className="text-sm text-gray-600">Always Available</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}