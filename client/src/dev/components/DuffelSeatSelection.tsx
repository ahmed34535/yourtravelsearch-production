import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plane, 
  User, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Info,
  MapPin
} from 'lucide-react';

// Duffel Seat Map Types
export interface DuffelSeatMap {
  id: string;
  segment_id: string;
  slice_id: string;
  cabins: DuffelCabin[];
}

export interface DuffelCabin {
  aisles: number;
  cabin_class: 'economy' | 'premium_economy' | 'business' | 'first';
  deck: number;
  rows: DuffelRow[];
}

export interface DuffelRow {
  sections: DuffelSection[];
}

export interface DuffelSection {
  elements: DuffelSeatElement[];
}

export interface DuffelSeatElement {
  type: 'seat' | 'empty' | 'bassinet' | 'exit_row' | 'lavatory' | 'galley';
  designator?: string;
  name?: string;
  disclosures?: string[];
  available_services?: DuffelSeatService[];
}

export interface DuffelSeatService {
  id: string;
  passenger_id: string;
  total_amount: string;
  total_currency: string;
}

export interface SelectedSeat {
  passenger_id: string;
  passenger_name: string;
  seat_designator: string;
  service_id: string;
  amount: string;
  currency: string;
}

// Seat Map Component
export function SeatMapVisualization({ seatMap, passengers, onSeatSelect }: {
  seatMap: DuffelSeatMap;
  passengers: Array<{ id: string; name: string }>;
  onSeatSelect: (selection: SelectedSeat) => void;
}) {
  const [selectedSeats, setSelectedSeats] = useState<Record<string, SelectedSeat>>({});
  const [currentPassenger, setCurrentPassenger] = useState<string>(passengers[0]?.id || '');

  const handleSeatClick = (element: DuffelSeatElement, cabin: DuffelCabin) => {
    if (element.type !== 'seat' || !element.designator || !element.available_services?.length) {
      return;
    }

    const service = element.available_services.find(s => s.passenger_id === currentPassenger);
    if (!service) return;

    const passenger = passengers.find(p => p.id === currentPassenger);
    if (!passenger) return;

    // Check if seat is already taken by another passenger
    const seatTaken = Object.values(selectedSeats).some(
      selected => selected.seat_designator === element.designator && selected.passenger_id !== currentPassenger
    );
    if (seatTaken) return;

    const selection: SelectedSeat = {
      passenger_id: currentPassenger,
      passenger_name: passenger.name,
      seat_designator: element.designator,
      service_id: service.id,
      amount: service.total_amount,
      currency: service.total_currency
    };

    setSelectedSeats(prev => ({
      ...prev,
      [currentPassenger]: selection
    }));

    onSeatSelect(selection);
  };

  const getSeatStatus = (element: DuffelSeatElement) => {
    if (element.type !== 'seat' || !element.designator) return 'disabled';
    
    const seatSelection = Object.values(selectedSeats).find(s => s.seat_designator === element.designator);
    if (seatSelection) {
      return seatSelection.passenger_id === currentPassenger ? 'selected' : 'taken';
    }

    const hasService = element.available_services?.some(s => s.passenger_id === currentPassenger);
    return hasService ? 'available' : 'unavailable';
  };

  const getSeatColor = (status: string, cabinClass: string) => {
    const baseColors = {
      economy: 'bg-blue-50 border-blue-200',
      premium_economy: 'bg-purple-50 border-purple-200',
      business: 'bg-green-50 border-green-200',
      first: 'bg-yellow-50 border-yellow-200'
    };

    const statusColors = {
      available: 'hover:bg-blue-100 cursor-pointer border-2',
      selected: 'bg-blue-600 text-white border-blue-600 border-2',
      taken: 'bg-red-100 border-red-300 text-red-700 border-2',
      unavailable: 'bg-gray-100 border-gray-200 text-gray-400',
      disabled: 'bg-gray-50 border-gray-100'
    };

    return `${baseColors[cabinClass as keyof typeof baseColors] || baseColors.economy} ${statusColors[status as keyof typeof statusColors] || statusColors.disabled}`;
  };

  const renderSeatElement = (element: DuffelSeatElement, cabin: DuffelCabin, rowIndex: number, sectionIndex: number, elementIndex: number) => {
    const key = `${rowIndex}-${sectionIndex}-${elementIndex}`;
    
    if (element.type === 'seat') {
      const status = getSeatStatus(element);
      const seatColor = getSeatColor(status, cabin.cabin_class);
      const service = element.available_services?.find(s => s.passenger_id === currentPassenger);
      
      return (
        <div
          key={key}
          className={`w-8 h-8 rounded border text-xs flex items-center justify-center font-mono ${seatColor}`}
          onClick={() => handleSeatClick(element, cabin)}
          title={`${element.designator}${service ? ` - ${service.total_currency} ${service.total_amount}` : ''}`}
        >
          {element.designator}
        </div>
      );
    }

    if (element.type === 'empty') {
      return (
        <div key={key} className="w-8 h-8" />
      );
    }

    if (element.type === 'exit_row') {
      return (
        <div key={key} className="w-8 h-2 bg-red-200 rounded-sm flex items-center justify-center">
          <div className="text-xs text-red-700 font-bold">EXIT</div>
        </div>
      );
    }

    if (element.type === 'bassinet') {
      return (
        <div key={key} className="w-8 h-8 bg-pink-100 border border-pink-200 rounded text-xs flex items-center justify-center">
          👶
        </div>
      );
    }

    if (element.type === 'lavatory') {
      return (
        <div key={key} className="w-8 h-8 bg-gray-200 border border-gray-300 rounded text-xs flex items-center justify-center">
          🚻
        </div>
      );
    }

    if (element.type === 'galley') {
      return (
        <div key={key} className="w-8 h-8 bg-orange-100 border border-orange-200 rounded text-xs flex items-center justify-center">
          🍽️
        </div>
      );
    }

    return <div key={key} className="w-8 h-8" />;
  };

  return (
    <div className="space-y-6">
      {/* Passenger Selection */}
      <div className="space-y-2">
        <Label className="font-medium">Select seats for:</Label>
        <div className="flex gap-2">
          {passengers.map(passenger => (
            <Button
              key={passenger.id}
              variant={currentPassenger === passenger.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPassenger(passenger.id)}
            >
              <User className="h-4 w-4 mr-2" />
              {passenger.name}
              {selectedSeats[passenger.id] && (
                <Badge variant="secondary" className="ml-2">
                  {selectedSeats[passenger.id].seat_designator}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Seat Map */}
      <div className="space-y-8">
        {seatMap.cabins.map((cabin, cabinIndex) => (
          <Card key={cabinIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Plane className="h-4 w-4" />
                {cabin.cabin_class.replace('_', ' ').toUpperCase()} CLASS
                <Badge variant="outline">Deck {cabin.deck + 1}</Badge>
                <Badge variant="secondary">{cabin.aisles} Aisle{cabin.aisles > 1 ? 's' : ''}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {cabin.rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex items-center gap-2">
                    <div className="w-6 text-xs text-gray-500 text-right">
                      {rowIndex + 1}
                    </div>
                    <div className="flex gap-1">
                      {row.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="flex gap-1">
                          {section.elements.map((element, elementIndex) => 
                            renderSeatElement(element, cabin, rowIndex, sectionIndex, elementIndex)
                          )}
                          {sectionIndex < row.sections.length - 1 && (
                            <div className="w-4 flex items-center justify-center">
                              <div className="w-px h-6 bg-gray-300"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Seat Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-50 border-2 border-blue-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 border-2 border-blue-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
              <span>Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {Object.keys(selectedSeats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.values(selectedSeats).map((selection, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{selection.passenger_name}</span>
                    <Badge variant="outline">{selection.seat_designator}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selection.currency} {selection.amount}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedSeats(prev => {
                          const updated = { ...prev };
                          delete updated[selection.passenger_id];
                          return updated;
                        });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Seat Fees:</span>
                <span>
                  {selectedSeats[Object.keys(selectedSeats)[0]]?.currency} {' '}
                  {Object.values(selectedSeats).reduce((sum, seat) => sum + parseFloat(seat.amount), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main Seat Selection Demo
export function DuffelSeatSelectionDemo() {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  // Mock seat map data following Duffel specifications
  const mockSeatMap: DuffelSeatMap = {
    id: 'sea_00003hthlsHZ8W4LxXjkzo',
    segment_id: 'seg_00009htYpSCXrwaB9Dn456',
    slice_id: 'sli_00009htYpSCXrwaB9Dn123',
    cabins: [
      {
        aisles: 1,
        cabin_class: 'business',
        deck: 0,
        rows: [
          {
            sections: [
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '1A',
                    name: '',
                    disclosures: ['Extra legroom'],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA1A',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '50.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '1B',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA1B',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '50.00',
                        total_currency: 'GBP'
                      }
                    ]
                  }
                ]
              },
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '1C',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA1C',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '50.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '1D',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA1D',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '50.00',
                        total_currency: 'GBP'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            sections: [
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '2A',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA2A',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '45.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '2B',
                    name: '',
                    disclosures: [],
                    available_services: []
                  }
                ]
              },
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '2C',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA2C',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '45.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '2D',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA2D',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '45.00',
                        total_currency: 'GBP'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        aisles: 2,
        cabin_class: 'economy',
        deck: 0,
        rows: [
          {
            sections: [
              {
                elements: [
                  { type: 'exit_row' }
                ]
              },
              {
                elements: []
              },
              {
                elements: [
                  { type: 'exit_row' }
                ]
              }
            ]
          },
          {
            sections: [
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '10A',
                    name: '',
                    disclosures: ['Window seat'],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA10A',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '25.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '10B',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA10B',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '20.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '10C',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA10C',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '20.00',
                        total_currency: 'GBP'
                      }
                    ]
                  }
                ]
              },
              {
                elements: [
                  {
                    type: 'seat',
                    designator: '10D',
                    name: '',
                    disclosures: [],
                    available_services: []
                  },
                  {
                    type: 'seat',
                    designator: '10E',
                    name: '',
                    disclosures: [],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA10E',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '20.00',
                        total_currency: 'GBP'
                      }
                    ]
                  },
                  {
                    type: 'seat',
                    designator: '10F',
                    name: '',
                    disclosures: ['Window seat'],
                    available_services: [
                      {
                        id: 'ase_00009UhD4ongolulWAAA10F',
                        passenger_id: 'pas_00009hj8USM7Ncg31cAAA',
                        total_amount: '25.00',
                        total_currency: 'GBP'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const mockPassengers = [
    { id: 'pas_00009hj8USM7Ncg31cAAA', name: 'Amelia Earhart' },
    { id: 'pas_00009hj8USM7Ncg31cBBB', name: 'Charles Lindbergh' }
  ];

  const handleSeatSelection = (selection: SelectedSeat) => {
    setSelectedSeats(prev => {
      const filtered = prev.filter(s => s.passenger_id !== selection.passenger_id);
      return [...filtered, selection];
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Duffel Seat Selection Interface</h2>
        <p className="text-gray-600">
          Interactive seat maps with real-time pricing and availability
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This seat selection system follows Duffel's exact seat map specifications with support for 
          multiple cabin classes, aisles, special elements, and per-passenger pricing.
        </AlertDescription>
      </Alert>

      <SeatMapVisualization
        seatMap={mockSeatMap}
        passengers={mockPassengers}
        onSeatSelect={handleSeatSelection}
      />

      <Card>
        <CardHeader>
          <CardTitle>Implementation Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Duffel Compliance</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Complete seat map schema implementation</li>
                <li>• Multi-deck and multi-cabin support</li>
                <li>• Aisle separation visualization</li>
                <li>• Special element rendering (exit rows, lavatories)</li>
                <li>• Per-passenger service pricing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">User Experience</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Real-time seat availability checking</li>
                <li>• Visual seat status indicators</li>
                <li>• Multi-passenger selection workflow</li>
                <li>• Price calculation and display</li>
                <li>• Responsive design for all devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}