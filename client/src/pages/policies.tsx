import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DuffelPoliciesManager } from '@/components/DuffelPoliciesManager';
import { HoldOrderManagement } from '@/components/DuffelHoldOrders';
import { ArrowLeft } from 'lucide-react';

function PoliciesPage() {
  const [, setLocation] = useLocation();
  const [offerId, setOfferId] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('offer_id');
    if (id) {
      setOfferId(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation('/flight-results')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Policies & Hold Orders</h1>
            <p className="text-gray-600">Complete overview of available policies and reservation options</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <DuffelPoliciesManager />
          <HoldOrderManagement />
        </div>
      </div>
    </div>
  );
}

export default PoliciesPage;