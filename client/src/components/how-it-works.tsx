import { Card, CardContent } from "@/components/ui/card";
import { Search, DollarSign, CheckCircle, Plane } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-8 h-8 text-blue-600" />,
    title: "Search Once, See Everything",
    description: "We query multiple airline systems simultaneously. No need to check 10 different sites.",
    detail: "Our system connects to the same booking platforms airlines use, so you see live availability and pricing."
  },
  {
    icon: <DollarSign className="w-8 h-8 text-green-600" />,
    title: "Price is the Price",
    description: "What you see is what you pay. No hidden fees revealed at checkout.",
    detail: "We include taxes, fees, and charges upfront. The final price never changes unless you add extras."
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
    title: "Book Directly with Airlines", 
    description: "Your ticket comes from the airline, not a middleman. Same benefits, better service.",
    detail: "You get a real airline confirmation number. Changes and cancellations go through the airline directly."
  },
  {
    icon: <Plane className="w-8 h-8 text-orange-600" />,
    title: "Fly With Confidence",
    description: "If something goes wrong, we help fix it. No automated responses or phone trees.",
    detail: "Real people answer emails within 4 hours during business days. We escalate issues with airlines when needed."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 section-pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
            How We're Different
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Most booking sites make money by hiding fees and marking up prices. 
            We make money by being transparent and helping you book flights that work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className={`relative overflow-hidden card-hover ${index % 2 === 0 ? 'md:mt-8' : ''}`}>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 feature-gradient rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 mb-4 font-medium leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 feature-gradient rounded-3xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 organic-shape">
            <div className="text-center">
              <h3 className="text-3xl font-display font-bold text-gradient mb-6">
                The Bottom Line
              </h3>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                We built this platform for people who want to book flights without the games. 
                Clear pricing, real availability, and actual human support when you need it. 
                That's it. No gimmicks, no tricks, just travel booking that works the way it should.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}