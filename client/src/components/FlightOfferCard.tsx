import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Clock, MapPin, Luggage, ArrowRight } from "lucide-react";
import { FareConditions } from "./FareConditions";

interface FlightSegment {
  id: string;
  origin: { iata_code: string; name: string };
  destination: { iata_code: string; name: string };
  departing_at: string;
  arriving_at: string;
  duration: string;
  marketing_carrier: { iata_code: string; name: string };
  operating_carrier: { iata_code: string; name: string };
  flight_number: string;
  aircraft: { name: string };
  stops?: Array<{
    id: string;
    duration: string;
    departing_at: string;
    airport: {
      iata_code: string;
      name: string;
      city_name: string;
    };
  }>;
}

interface FlightOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    id: string;
    origin: { iata_code: string; name: string };
    destination: { iata_code: string; name: string };
    departure_date: string;
    arrival_date: string;
    segments: FlightSegment[];
  }>;
  conditions: {
    change_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
    refund_before_departure?: {
      allowed: boolean;
      penalty_amount?: string;
      penalty_currency?: string;
    };
  };
  fare_brand?: { name: string };
}

interface FlightOfferCardProps {
  offer: FlightOffer;
  onSelect?: (offerId: string) => void;
  showConditions?: boolean;
  compact?: boolean;
}

export function FlightOfferCard({ 
  offer, 
  onSelect, 
  showConditions = false,
  compact = false 
}: FlightOfferCardProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration (PT2H35M) to readable format
    const hours = duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)M/)?.[1] || '0';
    return `${hours}h ${minutes}m`;
  };

  const getStopsText = (segments: FlightSegment[]) => {
    const totalStops = segments.reduce((acc, segment) => acc + (segment.stops?.length || 0), 0);
    if (totalStops === 0) return "Direct";
    return `${totalStops} stop${totalStops > 1 ? 's' : ''}`;
  };

  const getStopDetails = (segments: FlightSegment[]) => {
    const stops: string[] = [];
    segments.forEach(segment => {
      segment.stops?.forEach(stop => {
        stops.push(`${formatDuration(stop.duration)} ${stop.airport.iata_code}`);
      });
    });
    return stops.join(', ');
  };

  const mainSlice = offer.slices[0];
  const segment = mainSlice.segments[0];
  const isDirectFlight = getStopsText(mainSlice.segments) === "Direct";

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex items-center gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {formatTime(segment.departing_at)} – {formatTime(segment.arriving_at)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Economy {offer.fare_brand?.name || 'Basic'} • {segment.marketing_carrier.name}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-medium">
                    {formatDuration(mainSlice.segments[0].duration)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {mainSlice.origin.iata_code} – {mainSlice.destination.iata_code}
                  </div>
                </div>

                <div className="text-center">
                  <Badge variant={isDirectFlight ? "secondary" : "outline"}>
                    {getStopsText(mainSlice.segments)}
                  </Badge>
                  {!isDirectFlight && (
                    <div className="text-xs text-gray-500 mt-1">
                      {getStopDetails(mainSlice.segments)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {mainSlice.segments.some(s => s.stops && s.stops.length > 0) && (
                <div className="flex items-center gap-1">
                  <Luggage className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Includes 1 checked bag</span>
                </div>
              )}
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  £{offer.total_amount}
                </div>
                <Button 
                  onClick={() => onSelect?.(offer.id)}
                  className="mt-2"
                >
                  Select <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          {offer.slices.map((slice, sliceIndex) => (
            <div key={slice.id} className={sliceIndex > 0 ? "mt-6 pt-6 border-t" : ""}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {formatDate(slice.departure_date)} {formatTime(segment.departing_at)} – {formatTime(segment.arriving_at)}
                      <span className="text-xs text-gray-500 ml-2">+1</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {offer.fare_brand?.name || 'Basic'} • {segment.marketing_carrier.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {formatDuration(slice.segments[0].duration)}
                  </div>
                  <Badge variant={isDirectFlight ? "secondary" : "outline"}>
                    {getStopsText(slice.segments)}
                  </Badge>
                </div>
              </div>

              {slice.segments.map((segment, segmentIndex) => (
                <div key={segment.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 border-2 border-gray-300 rounded-full bg-white"></div>
                      {segmentIndex < slice.segments.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 my-2"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {formatDate(segment.departing_at)}, {formatTime(segment.departing_at)} 
                            Depart at {segment.origin.name} ({segment.origin.iata_code})
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Flight duration: {formatDuration(segment.duration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical stops display */}
                  {segment.stops?.map((stop) => (
                    <div key={stop.id} className="flex items-center gap-4 ml-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <div className="w-0.5 h-8 bg-gray-200"></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium text-orange-600">Technical Stop</div>
                        <div>
                          {formatTime(stop.departing_at)} at {stop.airport.name} ({stop.airport.iata_code})
                        </div>
                        <div>Stop duration: {formatDuration(stop.duration)}</div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 border-2 border-gray-300 rounded-full bg-white"></div>
                    </div>

                    <div className="flex-1">
                      <div className="font-medium">
                        {formatDate(segment.arriving_at)}, {formatTime(segment.arriving_at)} 
                        Arrive at {segment.destination.name} ({segment.destination.iata_code})
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Economy</span>
                        <span>{segment.marketing_carrier.name}</span>
                        <span>{segment.aircraft.name}</span>
                        <span>{segment.flight_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {showConditions && (
        <FareConditions
          conditions={offer.conditions}
          totalAmount={offer.total_amount}
          currency="£"
          fareType={offer.fare_brand?.name?.toLowerCase().includes('flexible') ? 'flexible' : 
                   offer.fare_brand?.name?.toLowerCase().includes('comfort') ? 'comfort' : 'basic'}
        />
      )}
    </div>
  );
}

// Component for displaying multiple offers in a list
export function FlightOffersList({ 
  offers, 
  onSelectOffer,
  compact = true 
}: { 
  offers: FlightOffer[];
  onSelectOffer?: (offerId: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <FlightOfferCard
          key={offer.id}
          offer={offer}
          onSelect={onSelectOffer}
          compact={compact}
        />
      ))}
    </div>
  );
}