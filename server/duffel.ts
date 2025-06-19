import { z } from "zod";

// Duffel API Configuration - Following official patterns from Duffel resources
const DUFFEL_API_BASE = "https://api.duffel.com";
const DUFFEL_API_VERSION = "v2";

// Enhanced error handling following Duffel patterns
export interface DuffelError {
  type: string;
  title: string;
  message: string;
  code: string;
  documentation_url?: string;
}

export interface DuffelResponse<T> {
  data: T;
  meta?: {
    request_id: string;
    status: number;
    cursors?: {
      before?: string;
      after?: string;
    };
  };
}

// Enhanced schemas following Duffel API documentation
export const AirportSchema = z.object({
  id: z.string(),
  iata_code: z.string(),
  icao_code: z.string().optional(),
  name: z.string(),
  city_name: z.string(),
  country_code: z.string(),
  country_name: z.string(),
  time_zone: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const AirlineSchema = z.object({
  id: z.string(),
  iata_code: z.string(),
  icao_code: z.string().optional(),
  name: z.string(),
  logo_symbol_url: z.string().optional(),
  logo_lockup_url: z.string().optional(),
});

// Duffel Payment Schemas
export const PaymentIntentSchema = z.object({
  id: z.string(),
  status: z.enum(['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'requires_capture', 'canceled', 'succeeded']),
  amount: z.string(),
  currency: z.string(),
  client_secret: z.string(),
  confirmation_method: z.enum(['automatic', 'manual']),
  capture_method: z.enum(['automatic', 'manual']),
  live_mode: z.boolean(),
  created_at: z.string(),
});

export const CardPaymentSchema = z.object({
  card_number: z.string(),
  cvc: z.string(),
  exp_month: z.number(),
  exp_year: z.number(),
  cardholder_name: z.string(),
});

export const BillingDetailsSchema = z.object({
  name: z.string(),
  email: z.string(),
  address: z.object({
    line_1: z.string(),
    city: z.string(),
    postal_code: z.string(),
    country_code: z.string(),
    region: z.string().optional(),
  }),
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  type: z.enum(['card']),
  card: z.object({
    brand: z.string(),
    country: z.string(),
    exp_month: z.number(),
    exp_year: z.number(),
    fingerprint: z.string(),
    funding: z.string(),
    last4: z.string(),
  }),
  billing_details: BillingDetailsSchema,
  live_mode: z.boolean(),
  created_at: z.string(),
});

export type Airport = z.infer<typeof AirportSchema>;
export type Airline = z.infer<typeof AirlineSchema>;

// Pricing Formula: Final Price = (Base Price + 2% Markup) / (1 - 0.029)
// This accounts for Duffel's 2.9% payment processing fee while preserving 2% profit margin
export function calculateFinalPrice(basePrice: number): number {
  const markupPrice = basePrice * 1.02; // Add 2% markup
  const finalPrice = markupPrice / (1 - 0.029); // Account for 2.9% processing fee
  return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
}

// Duffel API Client
export class DuffelClient {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.DUFFEL_API_TOKEN || "";
    this.baseUrl = DUFFEL_API_BASE;
    
    if (!this.apiToken) {
      console.warn("Duffel API token not provided - using fallback mode");
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<DuffelResponse<T>> {
    if (!this.apiToken) {
      throw new Error("Duffel API token not configured");
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    // Enable HTTP streaming for offer requests (May 2025 changelog update)
    const isOfferRequest = endpoint.includes('/air/offer_requests') || endpoint.includes('/air/batch_offer_requests');
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Accept": isOfferRequest ? "application/json; stream=true" : "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiToken}`,
          "Duffel-Version": DUFFEL_API_VERSION,
          "User-Agent": "TravalSearch/1.0 Production",
          "Accept-Encoding": "gzip, deflate", // Enable compression for better performance
          ...options.headers,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData.errors?.[0] as DuffelError;
        const errorMessage = error?.message || `HTTP ${response.status}`;
        throw new Error(`Duffel API error: ${errorMessage}`);
      }

      return responseData as DuffelResponse<T>;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connectivity issue with Duffel API');
      }
      throw error;
    }
  }

  // Create offer request following Duffel API patterns
  async createOfferRequest(searchParams: {
    slices: Array<{
      origin: string;
      destination: string;
      departure_date: string;
    }>;
    passengers: Array<{
      type: "adult" | "child" | "infant_without_seat";
    }>;
    cabin_class?: "economy" | "premium_economy" | "business" | "first";
    return_offers?: boolean;
  }) {
    const requestData = {
      data: {
        slices: searchParams.slices.map(slice => ({
          origin: slice.origin,
          destination: slice.destination,
          departure_date: slice.departure_date
        })),
        passengers: searchParams.passengers,
        cabin_class: searchParams.cabin_class || "economy",
        return_offers: searchParams.return_offers || false
      }
    };

    return await this.makeRequest("/air/offer_requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  // Get offers from offer request following Duffel patterns
  async getOffers(offerRequestId: string, options: { 
    limit?: number; 
    sort?: string;
    max_connections?: number;
    cabin_class?: string;
  } = {}) {
    const params = new URLSearchParams();
    params.append('offer_request_id', offerRequestId);
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (options.sort) {
      params.append('sort', options.sort);
    }

    // Enhanced filtering options from changelog updates
    if (options.max_connections) {
      params.append('max_connections', options.max_connections.toString());
    }

    if (options.cabin_class) {
      params.append('cabin_class', options.cabin_class);
    }

    return await this.makeRequest(`/air/offers?${params.toString()}`);
  }

  // Create order (booking)
  async createOrder(orderData: {
    selected_offers: string[];
    passengers: Array<{
      id?: string;
      title?: string;
      given_name: string;
      family_name: string;
      born_on?: string;
      email?: string;
      phone_number?: string;
      gender?: "m" | "f";
    }>;
    payments: Array<{
      type: "balance" | "arc_bsp_cash" | "card";
      amount: string;
      currency: string;
    }>;
  }) {
    return this.makeRequest("/orders", {
      method: "POST",
      body: JSON.stringify({
        data: orderData,
      }),
    });
  }

  // Get order details
  async getOrder(orderId: string) {
    return this.makeRequest(`/orders/${orderId}`);
  }

  // Cancel order
  async cancelOrder(orderId: string) {
    return this.makeRequest(`/orders/${orderId}/cancellations`, {
      method: "POST",
      body: JSON.stringify({
        data: {},
      }),
    });
  }

  // Search airports using live Duffel API with proper query parameters
  async getAirports(query?: string, options: { limit?: number } = {}) {
    const params = new URLSearchParams();
    
    // Duffel API supports searching by name, IATA code, city, or country
    if (query && query.length >= 2) {
      // Try multiple search approaches for better results
      if (query.length === 3 && query.match(/^[A-Z]{3}$/i)) {
        // Looks like IATA code
        params.append('iata_code', query.toUpperCase());
      } else {
        // Search by name/city - Duffel uses 'name' parameter for general search
        params.append('name', query);
      }
    }
    
    // Set reasonable limit for autocomplete
    params.append('limit', (options.limit || 10).toString());
    
    try {
      const response = await this.makeRequest(`/air/airports?${params.toString()}`);
      
      // If we got results, apply additional client-side filtering for better relevance
      if (response.data && query) {
        const searchTerm = query.toLowerCase();
        const filteredData = response.data.filter((airport: any) => {
          const cityName = airport.city_name || airport.city?.name || '';
          const airportName = airport.name || '';
          const iataCode = airport.iata_code || '';
          
          return cityName.toLowerCase().includes(searchTerm) ||
                 airportName.toLowerCase().includes(searchTerm) ||
                 iataCode.toLowerCase().includes(searchTerm);
        });
        
        return { ...response, data: filteredData };
      }
      
      return response;
    } catch (error) {
      console.error('[Duffel] Airport search failed, using fallback:', error);
      // Fallback to comprehensive airport database
      const comprehensiveAirports = [
      // Major US Airports
      { id: "apt_jfk", iata_code: "JFK", icao_code: "KJFK", name: "John F. Kennedy International Airport", city_name: "New York", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_lax", iata_code: "LAX", icao_code: "KLAX", name: "Los Angeles International Airport", city_name: "Los Angeles", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_ord", iata_code: "ORD", icao_code: "KORD", name: "O'Hare International Airport", city_name: "Chicago", country_code: "US", country_name: "United States", time_zone: "America/Chicago" },
      { id: "apt_atl", iata_code: "ATL", icao_code: "KATL", name: "Hartsfield-Jackson Atlanta International Airport", city_name: "Atlanta", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_dfw", iata_code: "DFW", icao_code: "KDFW", name: "Dallas/Fort Worth International Airport", city_name: "Dallas", country_code: "US", country_name: "United States", time_zone: "America/Chicago" },
      { id: "apt_den", iata_code: "DEN", icao_code: "KDEN", name: "Denver International Airport", city_name: "Denver", country_code: "US", country_name: "United States", time_zone: "America/Denver" },
      { id: "apt_sfo", iata_code: "SFO", icao_code: "KSFO", name: "San Francisco International Airport", city_name: "San Francisco", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_sea", iata_code: "SEA", icao_code: "KSEA", name: "Seattle-Tacoma International Airport", city_name: "Seattle", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_las", iata_code: "LAS", icao_code: "KLAS", name: "McCarran International Airport", city_name: "Las Vegas", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_mia", iata_code: "MIA", icao_code: "KMIA", name: "Miami International Airport", city_name: "Miami", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_bos", iata_code: "BOS", icao_code: "KBOS", name: "Logan International Airport", city_name: "Boston", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_ewr", iata_code: "EWR", icao_code: "KEWR", name: "Newark Liberty International Airport", city_name: "Newark", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_lga", iata_code: "LGA", icao_code: "KLGA", name: "LaGuardia Airport", city_name: "New York", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      
      // Major UK Airports
      { id: "apt_lhr", iata_code: "LHR", icao_code: "EGLL", name: "London Heathrow Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_lgw", iata_code: "LGW", icao_code: "EGKK", name: "London Gatwick Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_stn", iata_code: "STN", icao_code: "EGSS", name: "London Stansted Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_ltn", iata_code: "LTN", icao_code: "EGGW", name: "London Luton Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_lcy", iata_code: "LCY", icao_code: "EGLC", name: "London City Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_man", iata_code: "MAN", icao_code: "EGCC", name: "Manchester Airport", city_name: "Manchester", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_edi", iata_code: "EDI", icao_code: "EGPH", name: "Edinburgh Airport", city_name: "Edinburgh", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      
      // Major European Airports
      { id: "apt_cdg", iata_code: "CDG", icao_code: "LFPG", name: "Charles de Gaulle Airport", city_name: "Paris", country_code: "FR", country_name: "France", time_zone: "Europe/Paris" },
      { id: "apt_fra", iata_code: "FRA", icao_code: "EDDF", name: "Frankfurt Airport", city_name: "Frankfurt", country_code: "DE", country_name: "Germany", time_zone: "Europe/Berlin" },
      { id: "apt_ams", iata_code: "AMS", icao_code: "EHAM", name: "Amsterdam Airport Schiphol", city_name: "Amsterdam", country_code: "NL", country_name: "Netherlands", time_zone: "Europe/Amsterdam" },
      { id: "apt_mad", iata_code: "MAD", icao_code: "LEMD", name: "Madrid-Barajas Airport", city_name: "Madrid", country_code: "ES", country_name: "Spain", time_zone: "Europe/Madrid" },
      { id: "apt_fco", iata_code: "FCO", icao_code: "LIRF", name: "Leonardo da Vinci International Airport", city_name: "Rome", country_code: "IT", country_name: "Italy", time_zone: "Europe/Rome" },
      { id: "apt_muc", iata_code: "MUC", icao_code: "EDDM", name: "Munich Airport", city_name: "Munich", country_code: "DE", country_name: "Germany", time_zone: "Europe/Berlin" },
      { id: "apt_bcn", iata_code: "BCN", icao_code: "LEBL", name: "Barcelona-El Prat Airport", city_name: "Barcelona", country_code: "ES", country_name: "Spain", time_zone: "Europe/Madrid" },
      { id: "apt_zur", iata_code: "ZUR", icao_code: "LSZH", name: "Zurich Airport", city_name: "Zurich", country_code: "CH", country_name: "Switzerland", time_zone: "Europe/Zurich" },
      
      // Major Asian Airports
      { id: "apt_nrt", iata_code: "NRT", icao_code: "RJAA", name: "Narita International Airport", city_name: "Tokyo", country_code: "JP", country_name: "Japan", time_zone: "Asia/Tokyo" },
      { id: "apt_hnd", iata_code: "HND", icao_code: "RJTT", name: "Haneda Airport", city_name: "Tokyo", country_code: "JP", country_name: "Japan", time_zone: "Asia/Tokyo" },
      { id: "apt_icn", iata_code: "ICN", icao_code: "RKSI", name: "Incheon International Airport", city_name: "Seoul", country_code: "KR", country_name: "South Korea", time_zone: "Asia/Seoul" },
      { id: "apt_sin", iata_code: "SIN", icao_code: "WSSS", name: "Singapore Changi Airport", city_name: "Singapore", country_code: "SG", country_name: "Singapore", time_zone: "Asia/Singapore" },
      { id: "apt_hkg", iata_code: "HKG", icao_code: "VHHH", name: "Hong Kong International Airport", city_name: "Hong Kong", country_code: "HK", country_name: "Hong Kong", time_zone: "Asia/Hong_Kong" },
      { id: "apt_pvg", iata_code: "PVG", icao_code: "ZSPD", name: "Shanghai Pudong International Airport", city_name: "Shanghai", country_code: "CN", country_name: "China", time_zone: "Asia/Shanghai" },
      { id: "apt_pek", iata_code: "PEK", icao_code: "ZBAA", name: "Beijing Capital International Airport", city_name: "Beijing", country_code: "CN", country_name: "China", time_zone: "Asia/Shanghai" },
      { id: "apt_bkk", iata_code: "BKK", icao_code: "VTBS", name: "Suvarnabhumi Airport", city_name: "Bangkok", country_code: "TH", country_name: "Thailand", time_zone: "Asia/Bangkok" },
      
      // Middle East & Africa
      { id: "apt_dxb", iata_code: "DXB", icao_code: "OMDB", name: "Dubai International Airport", city_name: "Dubai", country_code: "AE", country_name: "United Arab Emirates", time_zone: "Asia/Dubai" },
      { id: "apt_doh", iata_code: "DOH", icao_code: "OTHH", name: "Hamad International Airport", city_name: "Doha", country_code: "QA", country_name: "Qatar", time_zone: "Asia/Qatar" },
      { id: "apt_jnb", iata_code: "JNB", icao_code: "FAJS", name: "O.R. Tambo International Airport", city_name: "Johannesburg", country_code: "ZA", country_name: "South Africa", time_zone: "Africa/Johannesburg" },
      { id: "apt_cpt", iata_code: "CPT", icao_code: "FACT", name: "Cape Town International Airport", city_name: "Cape Town", country_code: "ZA", country_name: "South Africa", time_zone: "Africa/Johannesburg" },
      
      // Canada & Australia
      { id: "apt_yyz", iata_code: "YYZ", icao_code: "CYYZ", name: "Toronto Pearson International Airport", city_name: "Toronto", country_code: "CA", country_name: "Canada", time_zone: "America/Toronto" },
      { id: "apt_yvr", iata_code: "YVR", icao_code: "CYVR", name: "Vancouver International Airport", city_name: "Vancouver", country_code: "CA", country_name: "Canada", time_zone: "America/Vancouver" },
      { id: "apt_syd", iata_code: "SYD", icao_code: "YSSY", name: "Sydney Kingsford Smith Airport", city_name: "Sydney", country_code: "AU", country_name: "Australia", time_zone: "Australia/Sydney" },
      { id: "apt_mel", iata_code: "MEL", icao_code: "YMML", name: "Melbourne Airport", city_name: "Melbourne", country_code: "AU", country_name: "Australia", time_zone: "Australia/Melbourne" },
      
      // Latin America
      { id: "apt_gru", iata_code: "GRU", icao_code: "SBGR", name: "São Paulo/Guarulhos International Airport", city_name: "São Paulo", country_code: "BR", country_name: "Brazil", time_zone: "America/Sao_Paulo" },
      { id: "apt_mex", iata_code: "MEX", icao_code: "MMMX", name: "Mexico City International Airport", city_name: "Mexico City", country_code: "MX", country_name: "Mexico", time_zone: "America/Mexico_City" },
      { id: "apt_lim", iata_code: "LIM", icao_code: "SPJC", name: "Jorge Chávez International Airport", city_name: "Lima", country_code: "PE", country_name: "Peru", time_zone: "America/Lima" },
      { id: "apt_bog", iata_code: "BOG", icao_code: "SKBO", name: "El Dorado International Airport", city_name: "Bogotá", country_code: "CO", country_name: "Colombia", time_zone: "America/Bogota" }
    ];
    
    if (!query || query.length < 2) {
      return { data: comprehensiveAirports.slice(0, 10) };
    }
    
    const searchTerm = query.toLowerCase();
    const filtered = comprehensiveAirports.filter(airport => 
      airport.city_name.toLowerCase().includes(searchTerm) ||
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.iata_code.toLowerCase().includes(searchTerm) ||
      airport.country_name.toLowerCase().includes(searchTerm)
    ).slice(0, 8);
    
    return { data: filtered };
    }
  }

  // Get airlines following Duffel patterns
  async getAirlines(options: { limit?: number } = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    
    const response = await this.makeRequest<Airline[]>(`/air/airlines?${params.toString()}`);
    return response;
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.getAirlines({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  // Add searchFlights method for production integration
  async searchFlights(searchParams: FlightSearch) {
    try {
      // Check if route is supported by Duffel
      const isSupported = this.isRouteSupportedByDuffel(searchParams.origin, searchParams.destination);
      
      if (!isSupported) {
        console.log(`[Flight Search] Route ${searchParams.origin}-${searchParams.destination} not supported by Duffel API`);
        throw new Error(`Flight search between ${searchParams.origin} and ${searchParams.destination} requires additional API credentials. Duffel primarily covers US, Canada, and major European routes. Please contact support for international route coverage.`);
      }
      
      // Create offer request
      const offerRequestData = {
        slices: [
          {
            origin: searchParams.origin,
            destination: searchParams.destination,
            departure_date: searchParams.departureDate,
          },
        ],
        passengers: [
          ...Array(searchParams.passengers?.adults || 1).fill({ type: "adult" }),
          ...Array(searchParams.passengers?.children || 0).fill({ type: "child" }),
          ...Array(searchParams.passengers?.infants || 0).fill({ type: "infant_without_seat" }),
        ],
        cabin_class: searchParams.cabinClass || "economy",
      };

      // Add return slice for round trip
      if (searchParams.returnDate) {
        offerRequestData.slices.push({
          origin: searchParams.destination,
          destination: searchParams.origin,
          departure_date: searchParams.returnDate,
        });
      }

      console.log("Creating Duffel offer request with payload:", JSON.stringify(offerRequestData, null, 2));
      
      const offerRequest = await this.createOfferRequest(offerRequestData);
      console.log("Duffel offer request created:", JSON.stringify(offerRequest.data, null, 2));
      
      const offers = await this.getOffers(offerRequest.data.id, {
        limit: 50,
        sort: "total_amount",
        max_connections: 2 // Optimize for better user experience
      });
      console.log("Duffel offers response:", JSON.stringify(offers, null, 2));

      // Apply pricing formula to offers
      const processedOffers = offers.data.map((offer: any) => ({
        ...offer,
        total_amount: calculateFinalPrice(parseFloat(offer.total_amount)),
      }));

      return {
        data: processedOffers,
        meta: offers.meta,
      };
    } catch (error: any) {
      console.error("Duffel API Error:", error.response?.data || error.message);
      console.error("Full error details:", {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data
      });
      throw error;
    }
  }

  // Duffel Payment Intent Methods
  async createPaymentIntent(amount: string, currency: string = "USD"): Promise<any> {
    try {
      const response = await fetch(`${DUFFEL_API_BASE}/${DUFFEL_API_VERSION}/payment_intents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': DUFFEL_API_VERSION,
        },
        body: JSON.stringify({
          amount,
          currency,
          confirmation_method: 'automatic',
          capture_method: 'automatic',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment intent creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Duffel Payment Intent Error:", error);
      throw error;
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<any> {
    try {
      const response = await fetch(`${DUFFEL_API_BASE}/${DUFFEL_API_VERSION}/payment_intents/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': DUFFEL_API_VERSION,
        },
        body: JSON.stringify({
          payment_method: paymentMethodId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment confirmation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Duffel Payment Confirmation Error:", error);
      throw error;
    }
  }

  async createPaymentMethod(cardData: any, billingDetails: any): Promise<any> {
    try {
      const response = await fetch(`${DUFFEL_API_BASE}/${DUFFEL_API_VERSION}/payment_methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': DUFFEL_API_VERSION,
        },
        body: JSON.stringify({
          type: 'card',
          card: cardData,
          billing_details: billingDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment method creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Duffel Payment Method Error:", error);
      throw error;
    }
  }

  // Add createBooking method for production integration
  async createBooking(bookingData: BookingRequest) {
    try {
      const orderData = {
        selected_offers: [bookingData.offer_id],
        passengers: bookingData.passengers.map((passenger: any) => ({
          id: passenger.id,
          title: passenger.title,
          given_name: passenger.given_name,
          family_name: passenger.family_name,
          born_on: passenger.born_on,
          email: passenger.email,
          phone_number: passenger.phone_number,
        })),
        payments: [
          {
            type: bookingData.payment.type as "balance" | "arc_bsp_cash" | "card",
            amount: bookingData.payment.amount,
            currency: bookingData.payment.currency,
          },
        ],
      };

      const order = await this.createOrder(orderData);
      return {
        data: {
          booking_id: order.data.id,
          booking_reference: order.data.booking_reference,
          status: order.data.status,
          passengers: order.data.passengers,
          total_amount: order.data.total_amount,
          total_currency: order.data.total_currency,
        },
      };
    } catch (error) {
      console.error("Duffel booking creation error:", error);
      throw error;
    }
  }

  private isRouteSupportedByDuffel(origin: string, destination: string): boolean {
    // Duffel primarily supports US domestic, US-Canada, US-Europe, and major European routes
    const supportedCountries = ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE'];
    
    // Get country codes from airport codes
    const originCountry = this.getCountryFromAirport(origin);
    const destinationCountry = this.getCountryFromAirport(destination);
    
    console.log(`[Route Check] ${origin} (${originCountry}) -> ${destination} (${destinationCountry})`);
    
    // Check if both endpoints are in supported countries
    const isSupported = supportedCountries.includes(originCountry) && supportedCountries.includes(destinationCountry);
    console.log(`[Route Check] Route supported: ${isSupported}`);
    
    return isSupported;
  }

  private getCountryFromAirport(airportCode: string): string {
    // Map of airport codes to country codes - focusing on major airports
    const airportToCountry: Record<string, string> = {
      // United States
      'JFK': 'US', 'LAX': 'US', 'ORD': 'US', 'ATL': 'US', 'DFW': 'US', 'DEN': 'US', 'SFO': 'US', 'SEA': 'US', 'LAS': 'US', 'MCO': 'US',
      'MIA': 'US', 'CLT': 'US', 'PHX': 'US', 'BOS': 'US', 'MSP': 'US', 'DTW': 'US', 'PHL': 'US', 'LGA': 'US', 'IAH': 'US', 'EWR': 'US',
      'BWI': 'US', 'TPA': 'US', 'SAN': 'US', 'PDX': 'US', 'STL': 'US', 'HNL': 'US', 'AUS': 'US', 'BNA': 'US', 'OAK': 'US', 'RDU': 'US',
      // Canada
      'YYZ': 'CA', 'YVR': 'CA', 'YUL': 'CA', 'YYC': 'CA', 'YOW': 'CA', 'YEG': 'CA', 'YHZ': 'CA', 'YWG': 'CA',
      // United Kingdom
      'LHR': 'GB', 'LGW': 'GB', 'STN': 'GB', 'LTN': 'GB', 'MAN': 'GB', 'EDI': 'GB', 'BHX': 'GB', 'GLA': 'GB', 'NCL': 'GB',
      // France
      'CDG': 'FR', 'ORY': 'FR', 'NCE': 'FR', 'LYS': 'FR', 'MRS': 'FR', 'TLS': 'FR', 'BOD': 'FR',
      // Germany
      'FRA': 'DE', 'MUC': 'DE', 'BER': 'DE', 'DUS': 'DE', 'HAM': 'DE', 'STR': 'DE', 'CGN': 'DE',
      // Italy
      'FCO': 'IT', 'MXP': 'IT', 'VCE': 'IT', 'NAP': 'IT', 'BGY': 'IT', 'BLQ': 'IT',
      // Spain
      'MAD': 'ES', 'BCN': 'ES', 'PMI': 'ES', 'VLC': 'ES', 'SVQ': 'ES', 'BIO': 'ES',
      // Netherlands
      'AMS': 'NL',
      // Belgium
      'BRU': 'BE',
      // Switzerland
      'ZUR': 'CH', 'GVA': 'CH', 'BSL': 'CH',
      // Austria
      'VIE': 'AT', 'SZG': 'AT',
      // Ireland
      'DUB': 'IE', 'ORK': 'IE'
    };
    
    return airportToCountry[airportCode] || 'OTHER';
  }
}

// Flight search schemas
export const FlightSearchSchema = z.object({
  origin: z.string().min(3), // Airport code or full name (will be extracted)
  destination: z.string().min(3), // Airport code or full name (will be extracted)
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.literal(""),
    z.undefined()
  ]).optional(),
  passengers: z.object({
    adults: z.number().min(1).max(9).default(1),
    children: z.number().min(0).max(8).default(0),
    infants: z.number().min(0).max(8).default(0),
  }).optional(),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]).default("economy"),
});

export const BookingSchema = z.object({
  offer_id: z.string(),
  passengers: z.array(z.object({
    title: z.string().optional(),
    given_name: z.string().min(1),
    family_name: z.string().min(1),
    born_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    email: z.string().email().optional(),
    phone_number: z.string().optional(),
    gender: z.enum(["m", "f"]).optional(),
  })),
  payment: z.object({
    type: z.enum(["balance", "arc_bsp_cash", "card"]),
    amount: z.string(),
    currency: z.string().length(3),
  }),
});

export type FlightSearch = z.infer<typeof FlightSearchSchema>;
export type BookingRequest = z.infer<typeof BookingSchema>;

// Mock data service for when API is not available
export class MockFlightService {
  async searchFlights(searchParams: FlightSearch) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const basePrice = 299 + Math.random() * 500;
    const finalPrice = calculateFinalPrice(basePrice);

    return {
      data: [
        {
          id: `offer_${Date.now()}`,
          total_amount: finalPrice.toFixed(2),
          total_currency: "USD",
          base_amount: basePrice.toFixed(2),
          markup_amount: (basePrice * 0.02).toFixed(2),
          slices: [
            {
              origin: {
                iata_code: searchParams.origin,
                name: "Origin Airport",
              },
              destination: {
                iata_code: searchParams.destination,
                name: "Destination Airport",
              },
              departure_datetime: `${searchParams.departureDate}T10:30:00`,
              arrival_datetime: `${searchParams.departureDate}T14:45:00`,
              duration: "PT4H15M",
              segments: [
                {
                  origin: {
                    iata_code: searchParams.origin,
                    name: "Origin Airport",
                  },
                  destination: {
                    iata_code: searchParams.destination,
                    name: "Destination Airport",
                  },
                  departing_at: `${searchParams.departureDate}T10:30:00`,
                  arriving_at: `${searchParams.departureDate}T14:45:00`,
                  marketing_carrier: {
                    iata_code: "AA",
                    name: "American Airlines",
                  },
                  flight_number: "AA1234",
                  aircraft: {
                    name: "Boeing 737-800",
                  },
                },
              ],
            },
          ],
        },
      ],
    };
  }

  async createBooking(bookingData: BookingRequest) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      data: {
        id: `order_${Date.now()}`,
        booking_reference: `TRV${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: "paid",
        passengers: bookingData.passengers,
        total_amount: bookingData.payment.amount,
        total_currency: bookingData.payment.currency,
      },
    };
  }

  async getAirports(query?: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Comprehensive global airport database with IATA official data structure
    const airports = [
      // Major US Airports
      { id: "apt_jfk", iata_code: "JFK", icao_code: "KJFK", name: "John F. Kennedy International Airport", city_name: "New York", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_lax", iata_code: "LAX", icao_code: "KLAX", name: "Los Angeles International Airport", city_name: "Los Angeles", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_ord", iata_code: "ORD", icao_code: "KORD", name: "O'Hare International Airport", city_name: "Chicago", country_code: "US", country_name: "United States", time_zone: "America/Chicago" },
      { id: "apt_atl", iata_code: "ATL", icao_code: "KATL", name: "Hartsfield-Jackson Atlanta International Airport", city_name: "Atlanta", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_dfw", iata_code: "DFW", icao_code: "KDFW", name: "Dallas/Fort Worth International Airport", city_name: "Dallas", country_code: "US", country_name: "United States", time_zone: "America/Chicago" },
      { id: "apt_sfo", iata_code: "SFO", icao_code: "KSFO", name: "San Francisco International Airport", city_name: "San Francisco", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_mia", iata_code: "MIA", icao_code: "KMIA", name: "Miami International Airport", city_name: "Miami", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_sea", iata_code: "SEA", icao_code: "KSEA", name: "Seattle-Tacoma International Airport", city_name: "Seattle", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_las", iata_code: "LAS", icao_code: "KLAS", name: "McCarran International Airport", city_name: "Las Vegas", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
      { id: "apt_bos", iata_code: "BOS", icao_code: "KBOS", name: "Logan International Airport", city_name: "Boston", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
      { id: "apt_den", iata_code: "DEN", icao_code: "KDEN", name: "Denver International Airport", city_name: "Denver", country_code: "US", country_name: "United States", time_zone: "America/Denver" },
      { id: "apt_phx", iata_code: "PHX", icao_code: "KPHX", name: "Phoenix Sky Harbor International Airport", city_name: "Phoenix", country_code: "US", country_name: "United States", time_zone: "America/Phoenix" },
      
      // Major European Airports
      { id: "apt_lhr", iata_code: "LHR", icao_code: "EGLL", name: "London Heathrow Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_cdg", iata_code: "CDG", icao_code: "LFPG", name: "Charles de Gaulle Airport", city_name: "Paris", country_code: "FR", country_name: "France", time_zone: "Europe/Paris" },
      { id: "apt_fra", iata_code: "FRA", icao_code: "EDDF", name: "Frankfurt Airport", city_name: "Frankfurt", country_code: "DE", country_name: "Germany", time_zone: "Europe/Berlin" },
      { id: "apt_ams", iata_code: "AMS", icao_code: "EHAM", name: "Amsterdam Airport Schiphol", city_name: "Amsterdam", country_code: "NL", country_name: "Netherlands", time_zone: "Europe/Amsterdam" },
      { id: "apt_mad", iata_code: "MAD", icao_code: "LEMD", name: "Madrid-Barajas Airport", city_name: "Madrid", country_code: "ES", country_name: "Spain", time_zone: "Europe/Madrid" },
      { id: "apt_fco", iata_code: "FCO", icao_code: "LIRF", name: "Leonardo da Vinci International Airport", city_name: "Rome", country_code: "IT", country_name: "Italy", time_zone: "Europe/Rome" },
      { id: "apt_lgw", iata_code: "LGW", icao_code: "EGKK", name: "London Gatwick Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
      { id: "apt_muc", iata_code: "MUC", icao_code: "EDDM", name: "Munich Airport", city_name: "Munich", country_code: "DE", country_name: "Germany", time_zone: "Europe/Berlin" },
      { id: "apt_bcn", iata_code: "BCN", icao_code: "LEBL", name: "Barcelona-El Prat Airport", city_name: "Barcelona", country_code: "ES", country_name: "Spain", time_zone: "Europe/Madrid" },
      { id: "apt_zur", iata_code: "ZUR", icao_code: "LSZH", name: "Zurich Airport", city_name: "Zurich", country_code: "CH", country_name: "Switzerland", time_zone: "Europe/Zurich" },
      
      // Major Asian Airports
      { id: "apt_nrt", iata_code: "NRT", icao_code: "RJAA", name: "Narita International Airport", city_name: "Tokyo", country_code: "JP", country_name: "Japan", time_zone: "Asia/Tokyo" },
      { id: "apt_hnd", iata_code: "HND", icao_code: "RJTT", name: "Haneda Airport", city_name: "Tokyo", country_code: "JP", country_name: "Japan", time_zone: "Asia/Tokyo" },
      { id: "apt_icn", iata_code: "ICN", icao_code: "RKSI", name: "Incheon International Airport", city_name: "Seoul", country_code: "KR", country_name: "South Korea", time_zone: "Asia/Seoul" },
      { id: "apt_sin", iata_code: "SIN", icao_code: "WSSS", name: "Singapore Changi Airport", city_name: "Singapore", country_code: "SG", country_name: "Singapore", time_zone: "Asia/Singapore" },
      { id: "apt_hkg", iata_code: "HKG", icao_code: "VHHH", name: "Hong Kong International Airport", city_name: "Hong Kong", country_code: "HK", country_name: "Hong Kong", time_zone: "Asia/Hong_Kong" },
      { id: "apt_pvg", iata_code: "PVG", icao_code: "ZSPD", name: "Shanghai Pudong International Airport", city_name: "Shanghai", country_code: "CN", country_name: "China", time_zone: "Asia/Shanghai" },
      { id: "apt_pek", iata_code: "PEK", icao_code: "ZBAA", name: "Beijing Capital International Airport", city_name: "Beijing", country_code: "CN", country_name: "China", time_zone: "Asia/Shanghai" },
      { id: "apt_bkk", iata_code: "BKK", icao_code: "VTBS", name: "Suvarnabhumi Airport", city_name: "Bangkok", country_code: "TH", country_name: "Thailand", time_zone: "Asia/Bangkok" },
      
      // Middle East & Africa
      { id: "apt_dxb", iata_code: "DXB", icao_code: "OMDB", name: "Dubai International Airport", city_name: "Dubai", country_code: "AE", country_name: "United Arab Emirates", time_zone: "Asia/Dubai" },
      { id: "apt_doh", iata_code: "DOH", icao_code: "OTHH", name: "Hamad International Airport", city_name: "Doha", country_code: "QA", country_name: "Qatar", time_zone: "Asia/Qatar" },
      { id: "apt_jnb", iata_code: "JNB", icao_code: "FAJS", name: "O.R. Tambo International Airport", city_name: "Johannesburg", country_code: "ZA", country_name: "South Africa", time_zone: "Africa/Johannesburg" },
      { id: "apt_cpt", iata_code: "CPT", icao_code: "FACT", name: "Cape Town International Airport", city_name: "Cape Town", country_code: "ZA", country_name: "South Africa", time_zone: "Africa/Johannesburg" },
      
      // Canada & Australia
      { id: "apt_yyz", iata_code: "YYZ", icao_code: "CYYZ", name: "Toronto Pearson International Airport", city_name: "Toronto", country_code: "CA", country_name: "Canada", time_zone: "America/Toronto" },
      { id: "apt_yvr", iata_code: "YVR", icao_code: "CYVR", name: "Vancouver International Airport", city_name: "Vancouver", country_code: "CA", country_name: "Canada", time_zone: "America/Vancouver" },
      { id: "apt_syd", iata_code: "SYD", icao_code: "YSSY", name: "Sydney Kingsford Smith Airport", city_name: "Sydney", country_code: "AU", country_name: "Australia", time_zone: "Australia/Sydney" },
      { id: "apt_mel", iata_code: "MEL", icao_code: "YMML", name: "Melbourne Airport", city_name: "Melbourne", country_code: "AU", country_name: "Australia", time_zone: "Australia/Melbourne" },
      
      // Latin America
      { id: "apt_gru", iata_code: "GRU", icao_code: "SBGR", name: "São Paulo/Guarulhos International Airport", city_name: "São Paulo", country_code: "BR", country_name: "Brazil", time_zone: "America/Sao_Paulo" },
      { id: "apt_mex", iata_code: "MEX", icao_code: "MMMX", name: "Mexico City International Airport", city_name: "Mexico City", country_code: "MX", country_name: "Mexico", time_zone: "America/Mexico_City" },
      { id: "apt_lim", iata_code: "LIM", icao_code: "SPJC", name: "Jorge Chávez International Airport", city_name: "Lima", country_code: "PE", country_name: "Peru", time_zone: "America/Lima" },
      { id: "apt_bog", iata_code: "BOG", icao_code: "SKBO", name: "El Dorado International Airport", city_name: "Bogotá", country_code: "CO", country_name: "Colombia", time_zone: "America/Bogota" }
    ];
    
    if (!query || query.length < 2) {
      return { data: airports.slice(0, 10) };
    }
    
    const searchTerm = query.toLowerCase();
    
    // Enhanced search algorithm with scoring for better city name matching
    const scoredAirports = airports.map(airport => {
      let score = 0;
      
      // Exact IATA code match (highest priority)
      if (airport.iata_code.toLowerCase() === searchTerm) score += 100;
      
      // Exact city name match (very high priority)
      if (airport.city_name.toLowerCase() === searchTerm) score += 90;
      
      // City name starts with query (high priority for cities like "New York")
      if (airport.city_name.toLowerCase().startsWith(searchTerm)) score += 80;
      
      // IATA code contains query
      if (airport.iata_code.toLowerCase().includes(searchTerm)) score += 70;
      
      // City name contains query
      if (airport.city_name.toLowerCase().includes(searchTerm)) score += 60;
      
      // Airport name contains query
      if (airport.name.toLowerCase().includes(searchTerm)) score += 40;
      
      // Country name contains query
      if (airport.country_name.toLowerCase().includes(searchTerm)) score += 20;
      
      return { ...airport, score };
    })
    .filter(airport => airport.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
    
    return { data: scoredAirports };
  }
}

// Service factory
export function createFlightService(): DuffelClient | MockFlightService {
  const apiToken = process.env.DUFFEL_API_TOKEN;
  
  if (apiToken) {
    return new DuffelClient(apiToken);
  } else {
    console.log("Duffel API token not found, using mock service");
    return new MockFlightService();
  }
}