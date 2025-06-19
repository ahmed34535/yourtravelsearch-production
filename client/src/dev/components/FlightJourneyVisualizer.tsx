import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plane, Clock, MapPin } from 'lucide-react';

export interface FlightSegment {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departing_at: string;
  arriving_at: string;
  duration: string;
  marketing_carrier: {
    iata_code: string;
    name: string;
  };
  operating_carrier: {
    iata_code: string;
    name: string;
  };
  flight_number: string;
  aircraft: {
    name: string;
  };
}

export interface FlightSlice {
  id: string;
  origin: {
    iata_code: string;
    name: string;
  };
  destination: {
    iata_code: string;
    name: string;
  };
  departure_date: string;
  arrival_date: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  slices: FlightSlice[];
  total_amount: string;
  total_currency: string;
  trip_type: 'one_way' | 'return' | 'multi_city';
}

interface FlightJourneyVisualizerProps {
  offer: FlightOffer;
  showSegmentDetails?: boolean;
}

export function FlightJourneyVisualizer({ offer, showSegmentDetails = false }: FlightJourneyVisualizerProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getSliceColor = (index: number) => {
    const colors = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-green-50 border-green-200'];
    return colors[index % colors.length];
  };

  const getSegmentIndicator = (segmentIndex: number, totalSegments: number) => {
    if (totalSegments === 1) return 'Direct';
    if (segmentIndex === 0) return 'Departure';
    if (segmentIndex === totalSegments - 1) return 'Arrival';
    return 'Connection';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Journey Visualization
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {offer.trip_type.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary">
              {offer.total_currency} {offer.total_amount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {offer.slices.map((slice, sliceIndex) => (
          <div key={slice.id} className={`p-4 rounded-lg border ${getSliceColor(sliceIndex)}`}>
            {/* Slice Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-white">
                  Slice {sliceIndex + 1}
                </Badge>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{slice.origin.iata_code}</span>
                  <Plane className="h-4 w-4 text-gray-400" />
                  <span>{slice.destination.iata_code}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(slice.departure_date)}
                {slice.departure_date !== slice.arrival_date && (
                  <span> - {formatDate(slice.arrival_date)}</span>
                )}
              </div>
            </div>

            {/* Journey Visualization */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {/* Origin */}
                <div className="flex flex-col items-center bg-white p-3 rounded-lg border min-w-[120px]">
                  <div className="font-bold text-lg">{slice.origin.iata_code}</div>
                  <div className="text-xs text-gray-600 text-center">ORIGIN</div>
                </div>

                {/* Segments Visualization */}
                <div className="flex-1 flex items-center justify-center px-4">
                  {slice.segments.length === 1 ? (
                    /* Direct Flight */
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-blue-300 flex-1"></div>
                      <div className="bg-blue-100 border border-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                        SEGMENT
                      </div>
                      <div className="h-px bg-blue-300 flex-1"></div>
                    </div>
                  ) : (
                    /* Multi-segment with connections */
                    <div className="flex items-center gap-1 w-full">
                      {slice.segments.map((segment, segmentIndex) => (
                        <div key={segment.id} className="flex items-center flex-1">
                          <div className="h-px bg-blue-300 flex-1"></div>
                          <div className="bg-blue-100 border border-blue-300 px-2 py-1 rounded-full text-xs font-medium mx-1">
                            SEGMENT
                          </div>
                          <div className="h-px bg-blue-300 flex-1"></div>
                          {segmentIndex < slice.segments.length - 1 && (
                            <div className="flex flex-col items-center mx-2">
                              <div className="bg-yellow-100 border border-yellow-300 p-2 rounded-lg text-center">
                                <div className="font-bold text-sm">
                                  {segment.destination.iata_code}
                                </div>
                                <div className="text-xs text-gray-600">LAYOVER</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div className="flex flex-col items-center bg-white p-3 rounded-lg border min-w-[120px]">
                  <div className="font-bold text-lg">{slice.destination.iata_code}</div>
                  <div className="text-xs text-gray-600 text-center">DESTINATION</div>
                </div>
              </div>
            </div>

            {/* Segment Details */}
            {showSegmentDetails && (
              <div className="mt-4 space-y-3">
                <Separator />
                <div className="grid gap-3">
                  {slice.segments.map((segment, segmentIndex) => (
                    <div key={segment.id} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getSegmentIndicator(segmentIndex, slice.segments.length)}
                          </Badge>
                          <span className="font-medium">
                            {segment.marketing_carrier.iata_code} {segment.flight_number}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{segment.aircraft.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{segment.origin.iata_code}</div>
                            <div className="text-gray-600">{formatTime(segment.departing_at)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{segment.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 justify-end">
                          <div className="text-right">
                            <div className="font-medium">{segment.destination.iata_code}</div>
                            <div className="text-gray-600">{formatTime(segment.arriving_at)}</div>
                          </div>
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      {segment.marketing_carrier.iata_code !== segment.operating_carrier.iata_code && (
                        <div className="mt-2 text-xs text-gray-500">
                          Operated by {segment.operating_carrier.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Demo component showing all journey types
export function FlightJourneyTypesDemo() {
  const oneWayDirect: FlightOffer = {
    id: 'off_onewaydirect',
    trip_type: 'one_way',
    total_amount: '1532.00',
    total_currency: 'GBP',
    slices: [{
      id: 'sli_oneway',
      origin: { iata_code: 'LHR', name: 'London Heathrow' },
      destination: { iata_code: 'JFK', name: 'John F Kennedy' },
      departure_date: '2024-05-01',
      arrival_date: '2024-05-01',
      segments: [{
        id: 'seg_ba117',
        origin: { iata_code: 'LHR', name: 'London Heathrow' },
        destination: { iata_code: 'JFK', name: 'John F Kennedy' },
        departing_at: '2024-05-01T08:30:00Z',
        arriving_at: '2024-05-01T16:45:00Z',
        duration: 'PT8H15M',
        marketing_carrier: { iata_code: 'BA', name: 'British Airways' },
        operating_carrier: { iata_code: 'BA', name: 'British Airways' },
        flight_number: 'BA117',
        aircraft: { name: 'Boeing 777-300ER' }
      }]
    }]
  };

  const oneWayIndirect: FlightOffer = {
    id: 'off_onewayindirect',
    trip_type: 'one_way',
    total_amount: '482.00',
    total_currency: 'GBP',
    slices: [{
      id: 'sli_oneway_indirect',
      origin: { iata_code: 'LHR', name: 'London Heathrow' },
      destination: { iata_code: 'LGA', name: 'LaGuardia' },
      departure_date: '2024-05-01',
      arrival_date: '2024-05-01',
      segments: [{
        id: 'seg_vs4011',
        origin: { iata_code: 'LHR', name: 'London Heathrow' },
        destination: { iata_code: 'BOS', name: 'Boston Logan' },
        departing_at: '2024-05-01T09:40:00Z',
        arriving_at: '2024-05-01T13:30:00Z',
        duration: 'PT7H50M',
        marketing_carrier: { iata_code: 'VS', name: 'Virgin Atlantic' },
        operating_carrier: { iata_code: 'DL', name: 'Delta Air Lines' },
        flight_number: 'VS4011',
        aircraft: { name: 'Airbus A330-300' }
      }, {
        id: 'seg_vs3277',
        origin: { iata_code: 'BOS', name: 'Boston Logan' },
        destination: { iata_code: 'LGA', name: 'LaGuardia' },
        departing_at: '2024-05-01T14:00:00Z',
        arriving_at: '2024-05-01T15:45:00Z',
        duration: 'PT1H45M',
        marketing_carrier: { iata_code: 'VS', name: 'Virgin Atlantic' },
        operating_carrier: { iata_code: 'DL', name: 'Delta Connection' },
        flight_number: 'VS3277',
        aircraft: { name: 'Embraer 175' }
      }]
    }]
  };

  const returnDirect: FlightOffer = {
    id: 'off_returndirect',
    trip_type: 'return',
    total_amount: '431.00',
    total_currency: 'GBP',
    slices: [{
      id: 'sli_outbound',
      origin: { iata_code: 'LGW', name: 'London Gatwick' },
      destination: { iata_code: 'YYZ', name: 'Toronto Pearson' },
      departure_date: '2024-05-01',
      arrival_date: '2024-05-01',
      segments: [{
        id: 'seg_ws4',
        origin: { iata_code: 'LGW', name: 'London Gatwick' },
        destination: { iata_code: 'YYZ', name: 'Toronto Pearson' },
        departing_at: '2024-05-01T12:50:00Z',
        arriving_at: '2024-05-01T21:30:00Z',
        duration: 'PT9H40M',
        marketing_carrier: { iata_code: 'WS', name: 'WestJet' },
        operating_carrier: { iata_code: 'WS', name: 'WestJet' },
        flight_number: 'WS4',
        aircraft: { name: 'Boeing 787-9' }
      }]
    }, {
      id: 'sli_return',
      origin: { iata_code: 'YYZ', name: 'Toronto Pearson' },
      destination: { iata_code: 'LGW', name: 'London Gatwick' },
      departure_date: '2024-05-08',
      arrival_date: '2024-05-09',
      segments: [{
        id: 'seg_ws3',
        origin: { iata_code: 'YYZ', name: 'Toronto Pearson' },
        destination: { iata_code: 'LGW', name: 'London Gatwick' },
        departing_at: '2024-05-08T20:40:00Z',
        arriving_at: '2024-05-09T08:15:00Z',
        duration: 'PT8H35M',
        marketing_carrier: { iata_code: 'WS', name: 'WestJet' },
        operating_carrier: { iata_code: 'WS', name: 'WestJet' },
        flight_number: 'WS3',
        aircraft: { name: 'Boeing 787-9' }
      }]
    }]
  };

  const multiCity: FlightOffer = {
    id: 'off_multicity',
    trip_type: 'multi_city',
    total_amount: '763.00',
    total_currency: 'GBP',
    slices: [{
      id: 'sli_leg1',
      origin: { iata_code: 'LHR', name: 'London Heathrow' },
      destination: { iata_code: 'JFK', name: 'John F Kennedy' },
      departure_date: '2024-05-01',
      arrival_date: '2024-05-01',
      segments: [{
        id: 'seg_ba183',
        origin: { iata_code: 'LHR', name: 'London Heathrow' },
        destination: { iata_code: 'JFK', name: 'John F Kennedy' },
        departing_at: '2024-05-01T19:50:00Z',
        arriving_at: '2024-05-02T03:45:00Z',
        duration: 'PT8H55M',
        marketing_carrier: { iata_code: 'BA', name: 'British Airways' },
        operating_carrier: { iata_code: 'BA', name: 'British Airways' },
        flight_number: 'BA183',
        aircraft: { name: 'Boeing 747-400' }
      }]
    }, {
      id: 'sli_leg2',
      origin: { iata_code: 'JFK', name: 'John F Kennedy' },
      destination: { iata_code: 'SFO', name: 'San Francisco' },
      departure_date: '2024-05-04',
      arrival_date: '2024-05-04',
      segments: [{
        id: 'seg_ay76',
        origin: { iata_code: 'JFK', name: 'John F Kennedy' },
        destination: { iata_code: 'SFO', name: 'San Francisco' },
        departing_at: '2024-05-04T07:00:00Z',
        arriving_at: '2024-05-04T13:30:00Z',
        duration: 'PT6H30M',
        marketing_carrier: { iata_code: 'AY', name: 'Finnair' },
        operating_carrier: { iata_code: 'AA', name: 'American Airlines' },
        flight_number: 'AY76',
        aircraft: { name: 'Airbus A321' }
      }]
    }, {
      id: 'sli_leg3',
      origin: { iata_code: 'SFO', name: 'San Francisco' },
      destination: { iata_code: 'LHR', name: 'London Heathrow' },
      departure_date: '2024-05-08',
      arrival_date: '2024-05-09',
      segments: [{
        id: 'seg_ba284',
        origin: { iata_code: 'SFO', name: 'San Francisco' },
        destination: { iata_code: 'LHR', name: 'London Heathrow' },
        departing_at: '2024-05-08T16:35:00Z',
        arriving_at: '2024-05-09T11:20:00Z',
        duration: 'PT10H45M',
        marketing_carrier: { iata_code: 'BA', name: 'British Airways' },
        operating_carrier: { iata_code: 'BA', name: 'British Airways' },
        flight_number: 'BA284',
        aircraft: { name: 'Boeing 777-300ER' }
      }]
    }]
  };

  const examples = [
    { title: 'One-way Direct Trip', offer: oneWayDirect },
    { title: 'One-way Indirect Trip (with layover)', offer: oneWayIndirect },
    { title: 'Return Direct Trip', offer: returnDirect },
    { title: 'Multi-city Trip', offer: multiCity }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Flight Journey Types</h2>
        <p className="text-gray-600">
          Visual representation of slices and segments according to official Duffel API specifications
        </p>
      </div>
      
      {examples.map((example, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-xl font-semibold">{example.title}</h3>
          <FlightJourneyVisualizer offer={example.offer} showSegmentDetails={true} />
        </div>
      ))}
    </div>
  );
}