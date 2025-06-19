import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Globe, DollarSign, MapPin, Clock, Phone, Mail, AlertTriangle } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface TimeZone {
  code: string;
  name: string;
  offset: string;
}

export default function InternationalSupport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");

  // Fetch supported currencies
  const { data: currencies } = useQuery({
    queryKey: ['/api/currencies'],
    initialData: [
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
      { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
    ]
  });

  // Fetch supported languages
  const { data: languages } = useQuery({
    queryKey: ['/api/languages'],
    initialData: [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
      { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    ]
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/preferences/international', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Preferences Updated",
        description: "Your international preferences have been saved.",
      });
    },
  });

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate({
      currency: selectedCurrency,
      language: selectedLanguage,
      timezone: selectedTimezone,
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    const currencyData = currencies?.find(c => c.code === currency);
    const convertedAmount = amount * (currencyData?.rate || 1);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(convertedAmount);
  };

  // Emergency contact numbers by region
  const emergencyContacts = [
    { region: 'North America', phone: '+1 (555) 911-HELP', hours: '24/7' },
    { region: 'Europe', phone: '+44 20 7946 0958', hours: '24/7' },
    { region: 'Asia Pacific', phone: '+65 6532 8888', hours: '24/7' },
    { region: 'Latin America', phone: '+55 11 3000 9999', hours: '24/7' },
    { region: 'Middle East & Africa', phone: '+971 4 379 8888', hours: '24/7' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">International Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your experience for your location and preferences
        </p>
      </div>

      {/* Preferences Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Preferences
          </CardTitle>
          <CardDescription>Set your currency, language, and timezone preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies?.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages?.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                        <span className="text-muted-foreground">({language.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="EST">Eastern Time (GMT-5)</SelectItem>
                  <SelectItem value="PST">Pacific Time (GMT-8)</SelectItem>
                  <SelectItem value="CET">Central European (GMT+1)</SelectItem>
                  <SelectItem value="JST">Japan Standard (GMT+9)</SelectItem>
                  <SelectItem value="AEST">Australian Eastern (GMT+10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSavePreferences} disabled={updatePreferencesMutation.isPending}>
            {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Converter
          </CardTitle>
          <CardDescription>See prices in your preferred currency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Sample Flight</p>
              <p className="text-lg font-semibold">{formatPrice(299, selectedCurrency)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Hotel Night</p>
              <p className="text-lg font-semibold">{formatPrice(150, selectedCurrency)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Car Rental</p>
              <p className="text-lg font-semibold">{formatPrice(45, selectedCurrency)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Package Deal</p>
              <p className="text-lg font-semibold">{formatPrice(899, selectedCurrency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Support
          </CardTitle>
          <CardDescription>24/7 emergency assistance worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{contact.region}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {contact.hours}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Travel Advisories */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Travel Advisories
          </CardTitle>
          <CardDescription className="text-amber-700">
            Important information for international travelers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-amber-800">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">COVID-19 Requirements</p>
                <p className="text-amber-700">Check destination-specific entry requirements and health protocols</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Passport Validity</p>
                <p className="text-amber-700">Ensure your passport is valid for at least 6 months from travel date</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Visa Requirements</p>
                <p className="text-amber-700">Check if you need a visa for your destination country</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Countries */}
      <Card>
        <CardHeader>
          <CardTitle>Global Coverage</CardTitle>
          <CardDescription>We operate in 190+ countries worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">North America</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>United States</li>
                <li>Canada</li>
                <li>Mexico</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Europe</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>United Kingdom</li>
                <li>France</li>
                <li>Germany</li>
                <li>+40 more</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Asia Pacific</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Japan</li>
                <li>Australia</li>
                <li>Singapore</li>
                <li>+35 more</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Other Regions</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Middle East</li>
                <li>Africa</li>
                <li>South America</li>
                <li>+100 more</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>International Support</CardTitle>
          <CardDescription>Multiple ways to reach our global support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">international@yourtravelsearch.com</p>
                <p className="text-xs text-muted-foreground">Available in 12 languages</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">Local numbers available</p>
                <p className="text-xs text-muted-foreground">See emergency contacts above</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}