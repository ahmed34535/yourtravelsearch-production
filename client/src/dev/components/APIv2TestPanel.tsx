import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { corporateAPI } from '../services/CorporateAPIService';
import { customerUserService } from '../services/CustomerUserService';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  data?: any;
  error?: string;
  duration?: number;
}

export function APIv2TestPanel() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testGroupId, setTestGroupId] = useState('');
  const [testUserId, setTestUserId] = useState('');

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (endpoint: string, updates: Partial<TestResult>) => {
    setResults(prev => prev.map(r => 
      r.endpoint === endpoint ? { ...r, ...updates } : r
    ));
  };

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // Test 1: Create Customer User Group
      addResult({ endpoint: 'Customer User Group Creation', status: 'pending' });
      const startTime1 = Date.now();
      
      try {
        const groupResponse = await customerUserService.createCustomerUserGroup({
          name: 'API v2 Test Group'
        });
        
        const duration1 = Date.now() - startTime1;
        updateResult('Customer User Group Creation', {
          status: 'success',
          data: groupResponse.data,
          duration: duration1
        });
        
        setTestGroupId(groupResponse.data.id);
      } catch (error) {
        updateResult('Customer User Group Creation', {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 2: Create Customer User
      addResult({ endpoint: 'Customer User Creation', status: 'pending' });
      const startTime2 = Date.now();
      
      try {
        const userResponse = await customerUserService.createCustomerUser({
          email: 'test.user@apitest.com',
          phone_number: '+44 20 1234 5678',
          given_name: 'API',
          family_name: 'Tester',
          group_id: testGroupId || undefined
        });
        
        const duration2 = Date.now() - startTime2;
        updateResult('Customer User Creation', {
          status: 'success',
          data: userResponse.data,
          duration: duration2
        });
        
        setTestUserId(userResponse.data.id);
      } catch (error) {
        updateResult('Customer User Creation', {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 3: Store Corporate Card
      addResult({ endpoint: 'Corporate Card Storage', status: 'pending' });
      const startTime3 = Date.now();
      
      try {
        const cardResponse = await corporateAPI.storeCard({
          address_city: 'London',
          address_country_code: 'GB',
          address_line_1: '1 Corporate Plaza',
          address_line_2: 'Floor 10',
          address_postal_code: 'EC2A 4RQ',
          address_region: 'London',
          expiry_month: '03',
          expiry_year: '30',
          name: 'API Test Corporate Card',
          number: '4111110116638870',
          cvc: '123',
          multi_use: false
        });
        
        const duration3 = Date.now() - startTime3;
        updateResult('Corporate Card Storage', {
          status: 'success',
          data: cardResponse.data,
          duration: duration3
        });

        // Test 4: Create Secure Corporate 3DS Session
        addResult({ endpoint: 'Secure Corporate 3DS Session', status: 'pending' });
        const startTime4 = Date.now();
        
        try {
          const sessionResponse = await corporateAPI.createSecureCorporateSession({
            card_id: cardResponse.data.id,
            resource_id: 'off_test_offer_id',
            services: [],
            multi_use: false,
            exception: 'secure_corporate_payment'
          });
          
          const duration4 = Date.now() - startTime4;
          updateResult('Secure Corporate 3DS Session', {
            status: 'success',
            data: sessionResponse.data,
            duration: duration4
          });

          // Test 5: Create Corporate Order with Customer User
          addResult({ endpoint: 'Corporate Order Creation', status: 'pending' });
          const startTime5 = Date.now();
          
          try {
            const orderResponse = await corporateAPI.createCorporateOrder({
              offerId: 'off_test_offer_id',
              threeDSecureSessionId: sessionResponse.data.id,
              customerUsers: testUserId ? [testUserId] : [],
              services: []
            });
            
            const duration5 = Date.now() - startTime5;
            updateResult('Corporate Order Creation', {
              status: 'success',
              data: orderResponse.data,
              duration: duration5
            });
          } catch (error) {
            updateResult('Corporate Order Creation', {
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        } catch (error) {
          updateResult('Secure Corporate 3DS Session', {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      } catch (error) {
        updateResult('Corporate Card Storage', {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 6: List Customer Users
      addResult({ endpoint: 'Customer Users Listing', status: 'pending' });
      const startTime6 = Date.now();
      
      try {
        const usersResponse = await customerUserService.listCustomerUsers(testGroupId || undefined);
        
        const duration6 = Date.now() - startTime6;
        updateResult('Customer Users Listing', {
          status: 'success',
          data: usersResponse.data,
          duration: duration6
        });
      } catch (error) {
        updateResult('Customer Users Listing', {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Duffel API v2 Integration Test Suite</CardTitle>
          <CardDescription>
            Comprehensive testing of Customer User management and corporate payment integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groupId">Test Group ID</Label>
              <Input
                id="groupId"
                value={testGroupId}
                onChange={(e) => setTestGroupId(e.target.value)}
                placeholder="Auto-generated during test"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="userId">Test User ID</Label>
              <Input
                id="userId"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                placeholder="Auto-generated during test"
                disabled
              />
            </div>
          </div>
          
          <Button 
            onClick={runComprehensiveTest} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? 'Running API v2 Tests...' : 'Run Complete API v2 Test Suite'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Real-time results from Duffel API v2 endpoint testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{result.endpoint}</h4>
                  <div className="flex items-center gap-2">
                    {result.duration && (
                      <span className="text-sm text-muted-foreground">
                        {result.duration}ms
                      </span>
                    )}
                    {getStatusBadge(result.status)}
                  </div>
                </div>
                
                {result.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {result.error}
                  </div>
                )}
                
                {result.data && (
                  <div className="p-3 bg-gray-50 border rounded">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {index < results.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API v2 Migration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Customer User Groups</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ v2 Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Customer Users</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ v2 Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Corporate Card Storage</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ v2 Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Secure Corporate 3DS</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ v2 Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Order Creation</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ v2 Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Travel Support Assistant</span>
              <Badge variant="default" className="bg-green-100 text-green-800">✓ Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}