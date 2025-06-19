import { z } from "zod";

// Enhanced Duffel API Client based on official resources
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

// Comprehensive schemas following Duffel API documentation
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

export const OfferSchema = z.object({
  id: z.string(),
  owner: AirlineSchema,
  slices: z.array(z.object({
    id: z.string(),
    origin: AirportSchema,
    destination: AirportSchema,
    departure_datetime: z.string(),
    arrival_datetime: z.string(),
    duration: z.string(),
    segments: z.array(z.object({
      id: z.string(),
      origin: AirportSchema,
      destination: AirportSchema,
      departing_at: z.string(),
      arriving_at: z.string(),
      marketing_carrier: AirlineSchema,
      operating_carrier: AirlineSchema.optional(),
      flight_number: z.string(),
      aircraft: z.object({
        id: z.string(),
        name: z.string(),
        iata_code: z.string().optional(),
      }).optional(),
    })),
  })),
  total_amount: z.string(),
  total_currency: z.string(),
  tax_amount: z.string().optional(),
  base_amount: z.string().optional(),
  expires_at: z.string(),
  conditions: z.object({
    change_before_departure: z.object({
      allowed: z.boolean(),
      penalty_amount: z.string().optional(),
    }).optional(),
    cancel_before_departure: z.object({
      allowed: z.boolean(),
      penalty_amount: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type Airport = z.infer<typeof AirportSchema>;
export type Airline = z.infer<typeof AirlineSchema>;
export type Offer = z.infer<typeof OfferSchema>;

// Revenue optimization pricing following business requirements
export function calculateFinalPrice(basePrice: number): number {
  const markupPrice = basePrice * 1.02; // 2% markup
  const finalPrice = markupPrice / (1 - 0.029); // Account for 2.9% processing fee
  return Math.round(finalPrice * 100) / 100;
}

// Enhanced Duffel API Client
export class EnhancedDuffelClient {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.DUFFEL_API_TOKEN || "";
    this.baseUrl = DUFFEL_API_BASE;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<DuffelResponse<T>> {
    if (!this.apiToken) {
      throw new Error("Duffel API token required for live data");
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiToken}`,
          "Duffel-Version": DUFFEL_API_VERSION,
          "User-Agent": "TravalSearch/1.0",
          ...options.headers,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = responseData.errors?.[0] as DuffelError;
        const errorMessage = error?.message || `HTTP ${response.status}`;
        throw new Error(`Duffel API: ${errorMessage}`);
      }

      return responseData as DuffelResponse<T>;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connectivity issue with Duffel API');
      }
      throw error;
    }
  }

  // Search airports with comprehensive filtering and relevance scoring
  async searchAirports(query: string, options: { 
    limit?: number;
    radius?: number;
    coordinates?: { latitude: number; longitude: number };
  } = {}): Promise<Airport[]> {
    const params = new URLSearchParams();
    params.append('name', query);
    params.append('limit', '50'); // Get more results for better filtering
    
    if (options.radius) params.append('radius', options.radius.toString());
    if (options.coordinates) {
      params.append('lat', options.coordinates.latitude.toString());
      params.append('lng', options.coordinates.longitude.toString());
    }
    
    const response = await this.makeRequest<Airport[]>(`/air/airports?${params.toString()}`);
    
    // Filter and score results for relevance
    const queryLower = query.toLowerCase();
    const scoredAirports = response.data.map((airport: any) => {
      let score = 0;
      
      // Exact matches get highest score
      if (airport.city_name?.toLowerCase() === queryLower) score += 100;
      if (airport.iata_code?.toLowerCase() === queryLower) score += 100;
      
      // City name starts with query
      if (airport.city_name?.toLowerCase().startsWith(queryLower)) score += 50;
      
      // City name contains query
      if (airport.city_name?.toLowerCase().includes(queryLower)) score += 25;
      
      // Airport name contains query
      if (airport.name?.toLowerCase().includes(queryLower)) score += 15;
      
      // IATA code matches
      if (airport.iata_code?.toLowerCase().includes(queryLower)) score += 30;
      
      return { ...airport, relevance_score: score };
    })
    .filter((airport: any) => airport.relevance_score > 0)
    .sort((a: any, b: any) => b.relevance_score - a.relevance_score);
    
    return scoredAirports.slice(0, options.limit || 8);
  }

  // Get airlines with pagination support
  async getAirlines(options: { 
    limit?: number;
    after?: string;
    before?: string;
  } = {}): Promise<DuffelResponse<Airline[]>> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.after) params.append('after', options.after);
    if (options.before) params.append('before', options.before);
    
    return await this.makeRequest<Airline[]>(`/air/airlines?${params.toString()}`);
  }

  // Create offer request with enhanced parameters
  async createOfferRequest(searchParams: {
    slices: Array<{
      origin: string;
      destination: string;
      departure_date: string;
    }>;
    passengers: Array<{
      type: "adult" | "child" | "infant_without_seat";
      age?: number;
    }>;
    cabin_class?: "economy" | "premium_economy" | "business" | "first";
    return_offers?: boolean;
    max_connections?: number;
    preferred_airlines?: string[];
  }): Promise<DuffelResponse<any>> {
    const requestData = {
      data: {
        slices: searchParams.slices,
        passengers: searchParams.passengers,
        cabin_class: searchParams.cabin_class || "economy",
        return_offers: searchParams.return_offers || false,
        max_connections: searchParams.max_connections,
        preferred_airlines: searchParams.preferred_airlines,
      }
    };

    return await this.makeRequest("/air/offer_requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  // Get offers with comprehensive sorting and filtering
  async getOffers(offerRequestId: string, options: { 
    limit?: number;
    sort?: "total_amount" | "-total_amount" | "total_duration" | "-total_duration";
    max_connections?: number;
    airlines?: string[];
  } = {}): Promise<DuffelResponse<Offer[]>> {
    const params = new URLSearchParams();
    params.append('offer_request_id', offerRequestId);
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    if (options.max_connections) params.append('max_connections', options.max_connections.toString());
    if (options.airlines) {
      options.airlines.forEach(airline => params.append('airlines[]', airline));
    }

    return await this.makeRequest<Offer[]>(`/air/offers?${params.toString()}`);
  }

  // Create order with comprehensive passenger and payment data
  async createOrder(orderData: {
    selected_offers: string[];
    passengers: Array<{
      id?: string;
      title?: "mr" | "ms" | "mrs" | "miss" | "dr";
      given_name: string;
      family_name: string;
      born_on: string;
      email?: string;
      phone_number?: string;
      identity_documents?: Array<{
        type: "passport" | "identity_card" | "driving_licence";
        unique_identifier: string;
        issuing_country_code: string;
        expires_on?: string;
      }>;
    }>;
    payments: Array<{
      type: "balance" | "card" | "arc_bsp_cash";
      amount: string;
      currency: string;
      card?: {
        number: string;
        expiry_month: string;
        expiry_year: string;
        cvc: string;
        name: string;
        address_line_1: string;
        address_city: string;
        address_region?: string;
        address_postal_code: string;
        address_country_code: string;
      };
    }>;
    metadata?: Record<string, any>;
  }): Promise<DuffelResponse<any>> {
    const requestData = {
      data: {
        selected_offers: orderData.selected_offers,
        passengers: orderData.passengers.map(passenger => ({
          id: passenger.id,
          title: passenger.title || "mr",
          given_name: passenger.given_name,
          family_name: passenger.family_name,
          born_on: passenger.born_on,
          email: passenger.email,
          phone_number: passenger.phone_number,
          identity_documents: passenger.identity_documents || []
        })),
        payments: orderData.payments,
        metadata: orderData.metadata || { source: "YourTravelSearch" }
      }
    };

    return await this.makeRequest("/air/orders", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  // Get order with comprehensive details
  async getOrder(orderId: string): Promise<DuffelResponse<any>> {
    return await this.makeRequest(`/air/orders/${orderId}`);
  }

  // Test API connectivity and permissions
  async testConnection(): Promise<{ connected: boolean; permissions: string[] }> {
    const permissions: string[] = [];
    
    try {
      await this.getAirlines({ limit: 1 });
      permissions.push('airlines');
    } catch {}

    try {
      await this.searchAirports('LHR', { limit: 1 });
      permissions.push('airports');
    } catch {}

    return {
      connected: permissions.length > 0,
      permissions
    };
  }

  // Enhanced flight search with business logic
  async searchFlights(searchParams: {
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    adults: number;
    children?: number;
    infants?: number;
    cabin_class?: string;
  }) {
    try {
      // Build passenger array
      const passengers = [
        ...Array(searchParams.adults).fill({ type: "adult" }),
        ...Array(searchParams.children || 0).fill({ type: "child" }),
        ...Array(searchParams.infants || 0).fill({ type: "infant_without_seat" }),
      ];

      // Build slices
      const slices = [{
        origin: searchParams.origin,
        destination: searchParams.destination,
        departure_date: searchParams.departure_date,
      }];

      if (searchParams.return_date) {
        slices.push({
          origin: searchParams.destination,
          destination: searchParams.origin,
          departure_date: searchParams.return_date,
        });
      }

      const offerRequestData = {
        slices,
        passengers,
        cabin_class: searchParams.cabin_class as any || "economy",
        return_offers: false,
      };

      console.log(`[Live API] Searching flights: ${searchParams.origin} → ${searchParams.destination}`);
      
      const offerRequest = await this.createOfferRequest(offerRequestData);
      const offers = await this.getOffers((offerRequest.data as any).id, { limit: 50, sort: "total_amount" });

      // Apply revenue optimization pricing
      const processedOffers = (offers.data as any[]).map((offer: any) => ({
        ...offer,
        original_amount: offer.total_amount,
        total_amount: calculateFinalPrice(parseFloat(offer.total_amount)).toString(),
        display_price: calculateFinalPrice(parseFloat(offer.total_amount)),
      }));

      return {
        data: processedOffers,
        meta: offers.meta,
      };
    } catch (error: any) {
      console.error("[Live API] Flight search error:", error.message);
      throw error;
    }
  }
}

// Enhanced factory function
export function createEnhancedDuffelService(apiToken?: string): EnhancedDuffelClient {
  return new EnhancedDuffelClient(apiToken);
}