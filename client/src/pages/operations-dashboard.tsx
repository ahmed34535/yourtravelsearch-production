import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Clock, DollarSign, FileText, Users, TrendingUp, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BookingModification {
  id: number;
  bookingId: number;
  type: string;
  status: string;
  requestedBy: number;
  feesAmount: string;
  refundAmount: string;
  createdAt: string;
  expiresAt: string;
}

interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: number;
  bookingId: number;
  type: string;
  status: string;
  amount: string;
  currency: string;
  createdAt: string;
}

interface OperationalReport {
  id: number;
  reportType: string;
  period: string;
  startDate: string;
  endDate: string;
  data: any;
  createdAt: string;
}

export default function OperationsDashboard() {
  const [selectedTab, setSelectedTab] = useState('booking-modifications');
  const queryClient = useQueryClient();

  // Booking Modifications Management
  const { data: modifications } = useQuery({
    queryKey: ['/api/booking-modifications'],
    queryFn: () => apiRequest('GET', '/api/booking-modifications').then(res => res.json()),
  });

  const { data: supportTickets } = useQuery({
    queryKey: ['/api/support-tickets'],
    queryFn: () => apiRequest('GET', '/api/support-tickets').then(res => res.json()),
  });

  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions'],
    queryFn: () => apiRequest('GET', '/api/transactions').then(res => res.json()),
  });

  const { data: reports } = useQuery({
    queryKey: ['/api/operational-reports'],
    queryFn: () => apiRequest('GET', '/api/operational-reports').then(res => res.json()),
  });

  const processModificationMutation = useMutation({
    mutationFn: (data: { id: number; action: 'approve' | 'reject'; notes?: string }) =>
      apiRequest('POST', `/api/booking-modifications/${data.id}/process`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-modifications'] });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: (data: { id: number; status: string; resolution?: string }) =>
      apiRequest('PATCH', `/api/support-tickets/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support-tickets'] });
    },
  });

  const generateReportMutation = useMutation({
    mutationFn: (data: { reportType: string; period: string; startDate: string; endDate: string }) =>
      apiRequest('POST', '/api/operational-reports/generate', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/operational-reports'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'completed': case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': case 'failed': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage day-to-day business operations and customer support</p>
        </div>

        {/* Key Metrics Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Modifications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {modifications?.filter((m: BookingModification) => m.status === 'pending').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {supportTickets?.filter((t: SupportTicket) => t.status === 'open').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${transactions?.filter((t: Transaction) => 
                      t.type === 'payment' && 
                      t.status === 'completed' &&
                      new Date(t.createdAt).toDateString() === new Date().toDateString()
                    ).reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0).toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {transactions?.filter((t: Transaction) => t.type === 'payment').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="booking-modifications">Booking Changes</TabsTrigger>
            <TabsTrigger value="support-tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="financial-reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Booking Modifications Tab */}
          <TabsContent value="booking-modifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Booking Modifications
                </CardTitle>
                <CardDescription>
                  Manage customer requests for booking changes, cancellations, and refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modifications?.map((modification: BookingModification) => (
                    <div key={modification.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(modification.status)}>
                              {modification.status}
                            </Badge>
                            <Badge variant="outline">
                              {modification.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Booking ID: {modification.bookingId} • 
                            Requested: {new Date(modification.createdAt).toLocaleDateString()}
                          </p>
                          {modification.feesAmount !== "0.00" && (
                            <p className="text-sm font-medium">Fees: ${modification.feesAmount}</p>
                          )}
                          {modification.refundAmount !== "0.00" && (
                            <p className="text-sm font-medium text-green-600">
                              Refund: ${modification.refundAmount}
                            </p>
                          )}
                        </div>
                        
                        {modification.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => processModificationMutation.mutate({
                                id: modification.id,
                                action: 'approve'
                              })}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => processModificationMutation.mutate({
                                id: modification.id,
                                action: 'reject'
                              })}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 py-8">No booking modifications found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="support-tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Support Tickets
                </CardTitle>
                <CardDescription>
                  Manage customer inquiries and support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets?.map((ticket: SupportTicket) => (
                    <div key={ticket.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline">
                              {ticket.category}
                            </Badge>
                          </div>
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <p className="text-sm text-gray-600">
                            Ticket #{ticket.ticketNumber} • 
                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {ticket.status === 'open' && (
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(status) => updateTicketMutation.mutate({
                                id: ticket.id,
                                status
                              })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Update" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 py-8">No support tickets found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Reports Tab */}
          <TabsContent value="financial-reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Reports & Analytics
                </CardTitle>
                <CardDescription>
                  Generate and view business intelligence reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily_revenue">Daily Revenue</SelectItem>
                        <SelectItem value="booking_summary">Booking Summary</SelectItem>
                        <SelectItem value="customer_satisfaction">Customer Satisfaction</SelectItem>
                        <SelectItem value="commission_tracking">Commission Tracking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="period">Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                
                <Button className="mb-6">
                  Generate Report
                </Button>

                <div className="space-y-4">
                  {reports?.map((report: OperationalReport) => (
                    <div key={report.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{report.reportType.replace('_', ' ')}</h4>
                          <p className="text-sm text-gray-600">
                            {report.period} • {new Date(report.startDate).toLocaleDateString()} - 
                            {new Date(report.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 py-8">No reports generated yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Security
                </CardTitle>
                <CardDescription>
                  Monitor regulatory compliance and security requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Data Protection Compliance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">GDPR Privacy Policy</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Data Encryption</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm">Data Retention Policy</span>
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Industry Compliance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">IATA Standards</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">PCI DSS Payment Security</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm">DOT Regulations</span>
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent Audit Log</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <span>User data access - Profile view</span>
                      <span className="text-gray-500">2 minutes ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <span>Payment data encryption check</span>
                      <span className="text-gray-500">1 hour ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <span>GDPR compliance verification</span>
                      <span className="text-gray-500">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}