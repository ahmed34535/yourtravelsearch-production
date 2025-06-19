import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Luggage, Package } from "lucide-react";

interface BaggageService {
  id: string;
  type: 'checked' | 'carry_on';
  total_amount: string;
  total_currency: string;
  maximum_quantity: number;
  segment_ids: string[];
  passenger_ids: string[];
  metadata: {
    type: 'checked' | 'carry_on';
    maximum_weight_kg?: number;
    maximum_dimensions_cm?: {
      length: number;
      width: number;
      height: number;
    };
  };
}

interface BaggageSelectorProps {
  availableServices: BaggageService[];
  passengers: Array<{ id: string; name: string }>;
  selectedServices: Array<{ id: string; quantity: number }>;
  onServiceChange: (serviceId: string, quantity: number) => void;
  className?: string;
}

export function BaggageSelector({ 
  availableServices, 
  passengers, 
  selectedServices, 
  onServiceChange,
  className = "" 
}: BaggageSelectorProps) {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const getSelectedQuantity = (serviceId: string) => {
    const selected = selectedServices.find(s => s.id === serviceId);
    return selected ? selected.quantity : 0;
  };

  const updateQuantity = (serviceId: string, change: number) => {
    const currentQuantity = getSelectedQuantity(serviceId);
    const newQuantity = Math.max(0, currentQuantity + change);
    const service = availableServices.find(s => s.id === serviceId);
    
    if (service && newQuantity <= service.maximum_quantity) {
      onServiceChange(serviceId, newQuantity);
    }
  };

  const calculateTotalCost = () => {
    return selectedServices.reduce((total, selected) => {
      const service = availableServices.find(s => s.id === selected.id);
      if (service) {
        return total + (parseFloat(service.total_amount) * selected.quantity);
      }
      return total;
    }, 0);
  };

  const getPassengerNames = (passengerIds: string[]) => {
    return passengerIds
      .map(id => passengers.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  if (availableServices.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Luggage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No additional baggage options available for this flight.</p>
          <p className="text-sm text-gray-500 mt-2">
            Baggage booking is currently supported for British Airways and select airlines.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Extra Baggage</h3>
        {selectedServices.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Total: £{calculateTotalCost().toFixed(2)}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {availableServices.map((service) => {
          const quantity = getSelectedQuantity(service.id);
          const isExpanded = expandedService === service.id;

          return (
            <Card key={service.id} className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.metadata.type === 'checked' ? (
                      <Luggage className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Package className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        {service.metadata.type === 'checked' ? 'Checked Baggage' : 'Carry-on Baggage'}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {service.metadata.maximum_weight_kg && `Up to ${service.metadata.maximum_weight_kg}kg`}
                        {service.metadata.maximum_dimensions_cm && 
                          ` • ${service.metadata.maximum_dimensions_cm.length}×${service.metadata.maximum_dimensions_cm.width}×${service.metadata.maximum_dimensions_cm.height}cm`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">
                      {service.total_currency} {service.total_amount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    >
                      {isExpanded ? 'Less' : 'Details'}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <strong>Applies to passengers:</strong>
                        <p className="text-gray-600 mt-1">{getPassengerNames(service.passenger_ids)}</p>
                      </div>
                      <div>
                        <strong>Valid for segments:</strong>
                        <p className="text-gray-600 mt-1">{service.segment_ids.length} flight segment(s)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(service.id, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(service.id, 1)}
                      disabled={quantity >= service.maximum_quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {quantity > 0 && (
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">
                        {service.total_currency} {(parseFloat(service.total_amount) * quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quantity} × {service.total_currency} {service.total_amount}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900">Baggage Summary</h4>
                <p className="text-sm text-blue-700">
                  {selectedServices.reduce((sum, s) => sum + s.quantity, 0)} additional bag(s) selected
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-900">
                  £{calculateTotalCost().toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Total baggage cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
        <strong>Note:</strong> Baggage booking is currently available for British Airways and select airlines. 
        Additional bags will be automatically included in your booking and confirmed via Electronic Miscellaneous Document (EMD).
      </div>
    </div>
  );
}