import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Plane, Users, Coffee, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatElement {
  designator: string;
  type: 'seat' | 'exit_row' | 'lavatory' | 'galley' | 'blocked';
  name?: string;
  disclosures: string[];
  available_services: Array<{
    id: string;
    passenger_id: string;
    total_amount: string;
    total_currency: string;
  }>;
}

interface SeatMapProps {
  seatMap: {
    id: string;
    segment_id: string;
    cabins: Array<{
      aisles: number;
      cabin_class: 'first' | 'business' | 'premium_economy' | 'economy';
      deck: number;
      rows: Array<{
        sections: Array<{
          elements: SeatElement[];
        }>;
      }>;
    }>;
  };
  passengers: Array<{ id: string; name: string }>;
  selectedSeats: Array<{ seatId: string; passengerId: string; serviceId: string }>;
  onSeatSelect: (seatElement: SeatElement, passengerId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  currentPassenger: string;
  onPassengerChange: (passengerId: string) => void;
  className?: string;
}

export function SeatMap({
  seatMap,
  passengers,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  currentPassenger,
  onPassengerChange,
  className = ""
}: SeatMapProps) {
  const [currentCabin, setCurrentCabin] = useState(0);

  const cabin = seatMap.cabins[currentCabin];
  const currentPassengerName = passengers.find(p => p.id === currentPassenger)?.name || 'Unknown';

  const getSeatStatus = (seatElement: SeatElement) => {
    const selected = selectedSeats.find(s => s.seatId === seatElement.designator);
    
    if (selected) {
      return selected.passengerId === currentPassenger ? 'selected' : 'occupied';
    }
    
    if (seatElement.available_services.length === 0) {
      return 'unavailable';
    }
    
    const service = seatElement.available_services.find(s => s.passenger_id === currentPassenger);
    if (!service) {
      return 'unavailable';
    }
    
    return parseFloat(service.total_amount) > 0 ? 'additional_cost' : 'included';
  };

  const getSeatPrice = (seatElement: SeatElement) => {
    const service = seatElement.available_services.find(s => s.passenger_id === currentPassenger);
    return service ? { amount: service.total_amount, currency: service.total_currency } : null;
  };

  const handleSeatClick = (seatElement: SeatElement) => {
    const selected = selectedSeats.find(s => s.seatId === seatElement.designator);
    
    if (selected) {
      if (selected.passengerId === currentPassenger) {
        onSeatDeselect(seatElement.designator);
      }
      return; // Can't select seat occupied by another passenger
    }
    
    const service = seatElement.available_services.find(s => s.passenger_id === currentPassenger);
    if (service) {
      onSeatSelect(seatElement, currentPassenger);
    }
  };

  const renderSeatElement = (element: SeatElement, sectionIndex: number, elementIndex: number) => {
    if (element.type === 'exit_row') {
      return (
        <div key={`exit-${sectionIndex}-${elementIndex}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 border border-gray-200 bg-gray-50">
          EXIT
        </div>
      );
    }
    
    if (element.type === 'lavatory') {
      return (
        <div key={`lavatory-${sectionIndex}-${elementIndex}`} className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded border">
          <Users className="h-4 w-4 text-blue-600" />
        </div>
      );
    }
    
    if (element.type === 'galley') {
      return (
        <div key={`galley-${sectionIndex}-${elementIndex}`} className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded border">
          <Coffee className="h-4 w-4 text-orange-600" />
        </div>
      );
    }
    
    if (element.type === 'blocked') {
      return (
        <div key={`blocked-${sectionIndex}-${elementIndex}`} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded border">
          <X className="h-4 w-4 text-gray-500" />
        </div>
      );
    }

    const status = getSeatStatus(element);
    const price = getSeatPrice(element);
    const isClickable = status !== 'unavailable' && (status !== 'occupied' || selectedSeats.find(s => s.seatId === element.designator)?.passengerId === currentPassenger);

    return (
      <button
        key={element.designator}
        onClick={() => handleSeatClick(element)}
        disabled={!isClickable}
        className={cn(
          "w-8 h-8 text-xs font-medium rounded border-2 transition-all duration-200 flex items-center justify-center relative",
          {
            'bg-blue-600 text-white border-blue-700': status === 'selected',
            'bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed': status === 'unavailable',
            'bg-red-100 text-red-800 border-red-300': status === 'occupied',
            'bg-green-100 text-green-800 border-green-300 hover:bg-green-200': status === 'included' && isClickable,
            'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200': status === 'additional_cost' && isClickable,
          }
        )}
        title={`Seat ${element.designator}${price && parseFloat(price.amount) > 0 ? ` - ${price.currency} ${price.amount}` : ''}`}
      >
        {element.designator.replace(/^\d+/, '')}
        {status === 'additional_cost' && price && parseFloat(price.amount) > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full text-[8px] text-white flex items-center justify-center">
            £
          </div>
        )}
      </button>
    );
  };

  const renderRow = (row: any, rowIndex: number) => {
    const hasSeats = row.sections.some((section: any) => 
      section.elements.some((element: SeatElement) => element.type === 'seat')
    );
    
    if (!hasSeats) {
      return (
        <div key={`row-${rowIndex}`} className="flex items-center justify-center py-2">
          {row.sections.map((section: any, sectionIndex: number) => (
            <div key={`section-${sectionIndex}`} className="flex gap-1 mx-2">
              {section.elements.map((element: SeatElement, elementIndex: number) =>
                renderSeatElement(element, sectionIndex, elementIndex)
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div key={`row-${rowIndex}`} className="flex items-center justify-between py-1">
        <div className="w-6 text-xs text-gray-500 text-center">
          {rowIndex + 28} {/* Assuming rows start at 28 based on the images */}
        </div>
        <div className="flex-1 flex justify-center items-center gap-4">
          {row.sections.map((section: any, sectionIndex: number) => (
            <div key={`section-${sectionIndex}`} className="flex gap-1">
              {section.elements.map((element: SeatElement, elementIndex: number) =>
                renderSeatElement(element, sectionIndex, elementIndex)
              )}
            </div>
          ))}
        </div>
        <div className="w-6 text-xs text-gray-500 text-center">
          {rowIndex + 28}
        </div>
      </div>
    );
  };

  const getTotalCost = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatElement = cabin.rows.flatMap(row => 
        row.sections.flatMap(section => section.elements)
      ).find(element => element.designator === seat.seatId);
      
      if (seatElement) {
        const service = seatElement.available_services.find(s => s.passenger_id === seat.passengerId);
        if (service) {
          total += parseFloat(service.total_amount);
        }
      }
      return total;
    }, 0);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Select Your Seats</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">for</span>
          <Badge variant="outline">{currentPassengerName}</Badge>
        </div>
      </div>

      {/* Passenger Selector */}
      <div className="flex gap-2">
        {passengers.map(passenger => (
          <Button
            key={passenger.id}
            variant={currentPassenger === passenger.id ? "default" : "outline"}
            size="sm"
            onClick={() => onPassengerChange(passenger.id)}
          >
            {passenger.name}
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Included</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
          <span>Additional Cost</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 border border-blue-700 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span>Lavatory</span>
        </div>
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-orange-600" />
          <span>Galley</span>
        </div>
      </div>

      {/* Seat Map */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">
              {cabin.cabin_class.charAt(0).toUpperCase() + cabin.cabin_class.slice(1)} Class
            </CardTitle>
            {seatMap.cabins.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentCabin(Math.max(0, currentCabin - 1))}
                  disabled={currentCabin === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-600">
                  Cabin {currentCabin + 1} of {seatMap.cabins.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentCabin(Math.min(seatMap.cabins.length - 1, currentCabin + 1))}
                  disabled={currentCabin === seatMap.cabins.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {cabin.rows.map((row, index) => renderRow(row, index))}
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Selected Seats</h4>
                <p className="text-sm text-blue-700">
                  {selectedSeats.length} seat(s) selected for {passengers.length} passenger(s)
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-900">
                  £{getTotalCost().toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Total seat cost</div>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-2">
              {passengers.map(passenger => {
                const passengerSeat = selectedSeats.find(s => s.passengerId === passenger.id);
                return (
                  <div key={passenger.id} className="flex justify-between text-sm">
                    <span>{passenger.name}</span>
                    <span className="font-medium">
                      {passengerSeat ? passengerSeat.seatId : 'No seat selected'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
        <strong>Note:</strong> Seat selection is available for American Airlines and select airlines. 
        Seats will be automatically assigned if not selected during booking.
      </div>
    </div>
  );
}