import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "Software Engineer, SF",
    text: "Kayak showed $180, then wanted $240 at checkout. This site showed $195 from the start and that's exactly what I paid. Finally.",
    rating: 5,
    route: "SFO → PDX",
    context: "Last-minute work trip"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    location: "Dad of 3, Miami",
    text: "Booked family flights for Disney. Kids were asking 'are we there yet' while I was still trying to figure out baggage fees on other sites. This was so much cleaner.",
    rating: 5,
    route: "MIA → MCO",
    context: "Family vacation"
  },
  {
    id: 3,
    name: "Jennifer Walsh",
    location: "Consultant, Chicago",
    text: "Had to change my flight when a client meeting moved. Lisa from support got back to me in 20 minutes and walked me through the airline's change process.",
    rating: 5,
    route: "ORD → DFW",
    context: "Business travel"
  },
  {
    id: 4,
    name: "David Kim",
    location: "Freelancer, Seattle",
    text: "Mobile site actually works. Booked on my phone during a coffee break. Confirmation came through immediately, boarding passes downloaded fine.",
    rating: 5,
    route: "SEA → JFK",
    context: "Client meeting"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 section-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
            Why People Switch to Us
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">
            Stories from travelers tired of booking site shenanigans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className={`testimonial-card card-hover ${index % 2 === 1 ? 'md:mt-12' : ''}`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-blue-300" />
                </div>
                
                <blockquote className="text-gray-700 text-base mb-6 leading-relaxed font-medium italic">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600 text-sm font-medium">
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 text-sm font-bold">
                        {testimonial.route}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {testimonial.context}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}