import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, ExternalLink, AlertTriangle, Info, Shield } from 'lucide-react';

interface Embassy {
  id: string;
  country: string;
  countryCode: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  emergencyPhone: string;
  consulateServices: string[];
  operatingHours: string;
}

interface TravelAdvisory {
  id: string;
  country: string;
  countryCode: string;
  level: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  summary: string;
  details: string;
  lastUpdated: string;
  validUntil: string;
  categories: string[];
  recommendations: string[];
}

interface CountryNotification {
  id: string;
  country: string;
  countryCode: string;
  type: 'visa' | 'health' | 'security' | 'weather' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  deadline?: string;
  relatedLinks: { title: string; url: string; }[];
}

interface EmbassyAdvisorySystemProps {
  selectedCountry?: string;
  onCountrySelect?: (country: string) => void;
}

export default function EmbassyAdvisorySystem({ selectedCountry, onCountrySelect }: EmbassyAdvisorySystemProps) {
  const [embassyData, setEmbassyData] = useState<Embassy | null>(null);
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  const [notifications, setNotifications] = useState<CountryNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample data - in production would come from State Department/Foreign Office APIs
  const sampleCountries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' },
    { code: 'TH', name: 'Thailand' }
  ];

  const fetchCountryData = async (countryCode: string) => {
    setLoading(true);
    
    // Simulate API call - replace with real embassy/advisory APIs
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const sampleEmbassy: Embassy = {
      id: `embassy_${countryCode}_us`,
      country: sampleCountries.find(c => c.code === countryCode)?.name || 'Unknown',
      countryCode,
      name: `US Embassy in ${sampleCountries.find(c => c.code === countryCode)?.name}`,
      address: '123 Embassy Street',
      city: 'Capital City',
      phone: '+1-555-EMBASSY',
      email: `consular.services@us${countryCode.toLowerCase()}.gov`,
      website: `https://us${countryCode.toLowerCase()}.usembassy.gov`,
      emergencyPhone: '+1-555-EMERGENCY',
      consulateServices: [
        'Passport Services',
        'Visa Applications', 
        'Notarial Services',
        'Emergency Assistance',
        'Citizen Services'
      ],
      operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    };

    const sampleAdvisory: TravelAdvisory = {
      id: `advisory_${countryCode}`,
      country: sampleCountries.find(c => c.code === countryCode)?.name || 'Unknown',
      countryCode,
      level: countryCode === 'TH' ? 'moderate' : 'low',
      title: 'Current Travel Conditions',
      summary: `Standard travel precautions recommended for ${sampleCountries.find(c => c.code === countryCode)?.name}`,
      details: 'Exercise normal safety precautions. Stay alert in tourist areas and follow local guidance.',
      lastUpdated: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      categories: ['General Safety', 'Health'],
      recommendations: [
        'Keep copies of important documents',
        'Register with the local embassy',
        'Stay informed of local conditions',
        'Follow health guidelines'
      ]
    };

    const sampleNotifications: CountryNotification[] = [
      {
        id: `notif_${countryCode}_visa`,
        country: sampleCountries.find(c => c.code === countryCode)?.name || 'Unknown',
        countryCode,
        type: 'visa',
        priority: 'medium',
        title: 'Visa Requirements',
        message: `US citizens may need a visa for travel to ${sampleCountries.find(c => c.code === countryCode)?.name}. Check current requirements.`,
        actionRequired: true,
        relatedLinks: [
          { title: 'Visa Information', url: '#' },
          { title: 'Application Portal', url: '#' }
        ]
      },
      {
        id: `notif_${countryCode}_health`,
        country: sampleCountries.find(c => c.code === countryCode)?.name || 'Unknown',
        countryCode,
        type: 'health',
        priority: 'low',
        title: 'Health Recommendations',
        message: 'Routine vaccinations recommended. Consult healthcare provider before travel.',
        actionRequired: false,
        relatedLinks: [
          { title: 'CDC Travel Health', url: '#' }
        ]
      }
    ];

    setEmbassyData(sampleEmbassy);
    setAdvisories([sampleAdvisory]);
    setNotifications(sampleNotifications);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCountry) {
      const country = sampleCountries.find(c => c.name === selectedCountry);
      if (country) {
        fetchCountryData(country.code);
      }
    }
  }, [selectedCountry]);

  const getAdvisoryColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!selectedCountry) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Embassy & Travel Advisory Center</CardTitle>
          <CardDescription>
            Select your destination country to view embassy information, travel advisories, and important notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {sampleCountries.map((country) => (
              <Button
                key={country.code}
                variant="outline"
                size="sm"
                onClick={() => onCountrySelect?.(country.name)}
                className="text-sm"
              >
                {country.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading embassy and advisory information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Travel Advisories */}
      {advisories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Travel Advisory for {selectedCountry}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisories.map((advisory) => (
              <Alert key={advisory.id} className={getAdvisoryColor(advisory.level)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {advisory.title}
                  <Badge variant="outline" className={getAdvisoryColor(advisory.level)}>
                    {advisory.level.toUpperCase()} RISK
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="mb-3">{advisory.summary}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {advisory.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs mt-3 opacity-75">
                    Last updated: {new Date(advisory.lastUpdated).toLocaleDateString()}
                  </p>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Country Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Important Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(notification.priority)}
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {notification.type.toUpperCase()}
                    </Badge>
                  </div>
                  {notification.actionRequired && (
                    <Badge variant="destructive" className="text-xs">
                      ACTION REQUIRED
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                {notification.relatedLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notification.relatedLinks.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {link.title}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Embassy Information */}
      {embassyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {embassyData.name}
            </CardTitle>
            <CardDescription>
              Official US diplomatic mission in {embassyData.country}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm">{embassyData.address}</p>
                      <p className="text-sm text-gray-600">{embassyData.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{embassyData.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{embassyData.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <Button variant="link" className="h-auto p-0 text-sm">
                      Official Website
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Emergency Contact</h4>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">24/7 Emergency Line</span>
                  </div>
                  <p className="text-sm text-red-700">{embassyData.emergencyPhone}</p>
                  <p className="text-xs text-red-600 mt-1">
                    For US citizen emergencies only
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Services and Hours */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Consular Services</h4>
                <ul className="space-y-2">
                  {embassyData.consulateServices.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Operating Hours</h4>
                <p className="text-sm text-gray-600">{embassyData.operatingHours}</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    Appointment required for most services. Check website for holiday closures.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button size="sm" className="flex-1">
                Schedule Appointment
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Register with Embassy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}