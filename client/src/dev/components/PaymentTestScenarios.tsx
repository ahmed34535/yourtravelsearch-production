/**
 * Payment Test Scenarios Component
 * 
 * Comprehensive testing scenarios for Duffel Cards integration
 * following official documentation patterns.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CreditCard, TestTube, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestCard {
  name: string;
  number: string;
  brand: 'visa' | 'mastercard' | 'amex';
  scenario: 'challenge' | 'no_challenge';
  description: string;
  expiry: string;
  cvc: string;
}

const TEST_CARDS: TestCard[] = [
  {
    name: 'Visa - 3DS Challenge Required',
    number: '4242424242424242',
    brand: 'visa',
    scenario: 'challenge',
    description: 'Triggers 3DS challenge flow with authentication required',
    expiry: '12/25',
    cvc: '123'
  },
  {
    name: 'Visa - No 3DS Challenge',
    number: '4111110116638870',
    brand: 'visa',
    scenario: 'no_challenge',
    description: 'Processes without 3DS challenge requirement',
    expiry: '12/25',
    cvc: '123'
  },
  {
    name: 'Mastercard - 3DS Challenge Required',
    number: '5555555555554444',
    brand: 'mastercard',
    scenario: 'challenge',
    description: 'Triggers 3DS challenge flow with authentication required',
    expiry: '12/25',
    cvc: '123'
  },
  {
    name: 'Mastercard - No 3DS Challenge',
    number: '5555550130659057',
    brand: 'mastercard',
    scenario: 'no_challenge',
    description: 'Processes without 3DS challenge requirement',
    expiry: '12/25',
    cvc: '123'
  },
  {
    name: 'American Express - Test Card',
    number: '378282246310005',
    brand: 'amex',
    scenario: 'challenge',
    description: 'Can be used for both challenge and no-challenge scenarios',
    expiry: '12/25',
    cvc: '1234'
  }
];

const VERIFICATION_CODES = [
  {
    code: '111-111',
    result: 'success',
    description: 'Successful 3DS authentication'
  },
  {
    code: 'Any other',
    result: 'failure',
    description: 'Failed 3DS authentication'
  }
];

const ADDRESS_DATA = {
  uk: {
    line1: '123 Test Street',
    line2: 'Apartment 4B',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'GB'
  },
  us: {
    line1: '456 Main Street',
    line2: 'Suite 100',
    city: 'New York',
    postcode: '10001',
    country: 'US'
  }
};

export function PaymentTestScenarios() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'bg-blue-100 text-blue-800';
      case 'mastercard': return 'bg-red-100 text-red-800';
      case 'amex': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScenarioIcon = (scenario: string) => {
    return scenario === 'challenge' ? 
      <AlertTriangle className="w-4 h-4 text-orange-500" /> :
      <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Test Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cards">Test Cards</TabsTrigger>
            <TabsTrigger value="verification">3DS Codes</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Use these test card numbers to simulate different payment scenarios.
                Only works with Duffel Airways or Duffel Hotel Group in test mode.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {TEST_CARDS.map((card, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getBrandColor(card.brand)}>
                        {card.brand.toUpperCase()}
                      </Badge>
                      {getScenarioIcon(card.scenario)}
                      <span className="font-medium">{card.name}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{card.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Card Number:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                          {formatCardNumber(card.number)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(card.number, `card-${index}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {copiedItem === `card-${index}` && (
                          <span className="text-green-600 text-xs">Copied!</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Expiry / CVC:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                          {card.expiry} / {card.cvc}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                These verification codes control 3DS challenge outcomes in test mode.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {VERIFICATION_CODES.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.result === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium">
                        {item.result === 'success' ? 'Success Code' : 'Failure Code'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                      {item.code}
                    </code>
                    {item.code !== 'Any other' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(item.code, `code-${index}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {copiedItem === `code-${index}` && (
                          <span className="text-green-600 text-xs">Copied!</span>
                        )}
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Use these test addresses for billing information. Any valid address details work in test mode.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {Object.entries(ADDRESS_DATA).map(([country, address]) => (
                <div key={country} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium capitalize">{country === 'uk' ? 'United Kingdom' : 'United States'}</h4>
                    <Badge variant="outline">{address.country}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Address Line 1:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{address.line1}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(address.line1, `addr1-${country}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Address Line 2:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{address.line2}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(address.line2, `addr2-${country}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">City:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{address.city}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(address.city, `city-${country}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Postcode:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{address.postcode}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(address.postcode, `post-${country}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {copiedItem?.includes(country) && (
                    <div className="mt-2">
                      <span className="text-green-600 text-xs">Copied!</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}