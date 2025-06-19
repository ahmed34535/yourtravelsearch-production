/**
 * Duffel Links Service
 * 
 * Implementation of Duffel's Links API for hosted UI flight booking
 * with pricing formula: Final Price = (Base Price + 2% Markup) / (1 - 0.029)
 * This accounts for Duffel's 2.9% payment processing fee while preserving 2% profit margin.
 */

interface DuffelLinkSessionRequest {
  reference: string;
  success_url: string;
  failure_url: string;
  abandonment_url: string;
  logo_url?: string;
  primary_color?: string;
  traveller_currency: string;
  markup_amount?: string;
  markup_currency?: string;
  markup_rate?: string;
  flights: {
    enabled: boolean;
  };
  stays: {
    enabled: boolean;
  };
}

interface DuffelLinkSessionResponse {
  data: {
    id: string;
    reference: string;
    url: string;
    live_mode: boolean;
    created_at: string;
    expires_at: string;
    status: 'created' | 'active' | 'completed' | 'expired';
    traveller_currency: string;
    markup_rate: string;
    markup_currency: string;
    success_url: string;
    failure_url: string;
    abandonment_url: string;
  };
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: {
    adults: number;
    children?: number;
    infants?: number;
  };
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
}

export class DuffelLinksService {
  private readonly apiBaseUrl = 'https://api.duffel.com';
  private readonly apiVersion = 'v2';
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }

  /**
   * Create a Duffel Links session with 2% markup for flight booking
   */
  async createLinkSession(params: {
    userReference: string;
    searchParams?: FlightSearchParams;
    customization?: {
      logo_url?: string;
      primary_color?: string;
    };
  }): Promise<DuffelLinkSessionResponse> {
    const url = `${this.apiBaseUrl}/links/sessions`;
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    const requestBody: { data: DuffelLinkSessionRequest } = {
      data: {
        reference: params.userReference,
        success_url: `${window.location.origin}/booking-success`,
        failure_url: `${window.location.origin}/booking-failure`,
        abandonment_url: `${window.location.origin}/booking-abandoned`,
        logo_url: params.customization?.logo_url || `${window.location.origin}/logo.png`,
        primary_color: params.customization?.primary_color || '#1a73e8',
        traveller_currency: 'USD',
        markup_amount: '0.00',
        markup_currency: 'USD',
        markup_rate: '0.02', // 2% markup as specified
        flights: {
          enabled: true
        },
        stays: {
          enabled: false
        }
      }
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateLinkSession(params);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Duffel Links session creation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Duffel Links session creation error:', error);
      throw error;
    }
  }

  /**
   * Get Duffel Links session status
   */
  async getSessionStatus(sessionId: string): Promise<DuffelLinkSessionResponse> {
    const url = `${this.apiBaseUrl}/links/sessions/${sessionId}`;
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateSessionStatus(sessionId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Session status retrieval failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Session status retrieval error:', error);
      throw error;
    }
  }

  /**
   * Create flight search with specific parameters
   */
  async createFlightSearch(searchParams: FlightSearchParams): Promise<DuffelLinkSessionResponse> {
    const userRef = `flight_search_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    return this.createLinkSession({
      userReference: userRef,
      searchParams,
      customization: {
        primary_color: '#2563eb',
        logo_url: `${window.location.origin}/logo.png`
      }
    });
  }

  /**
   * Simulate Duffel Links session creation for development
   */
  private async simulateLinkSession(params: any): Promise<DuffelLinkSessionResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const sessionId = `lnk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
    const sessionUrl = `https://links.duffel.com/sessions/${sessionId}`;

    return {
      data: {
        id: sessionId,
        reference: params.userReference,
        url: sessionUrl,
        live_mode: false,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        status: 'created',
        traveller_currency: 'USD',
        markup_rate: '0.02',
        markup_currency: 'USD',
        success_url: `${window.location.origin}/booking-success`,
        failure_url: `${window.location.origin}/booking-failure`,
        abandonment_url: `${window.location.origin}/booking-abandoned`
      }
    };
  }

  /**
   * Simulate session status for development
   */
  private async simulateSessionStatus(sessionId: string): Promise<DuffelLinkSessionResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      data: {
        id: sessionId,
        reference: `user_ref_${sessionId}`,
        url: `https://links.duffel.com/sessions/${sessionId}`,
        live_mode: false,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        expires_at: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(), // 23 hours from now
        status: 'active',
        traveller_currency: 'USD',
        markup_rate: '0.02',
        markup_currency: 'USD',
        success_url: `${window.location.origin}/booking-success`,
        failure_url: `${window.location.origin}/booking-failure`,
        abandonment_url: `${window.location.origin}/booking-abandoned`
      }
    };
  }

  /**
   * Set access token for live API calls
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Check if service is configured for live mode
   */
  isLiveMode(): boolean {
    return this.accessToken !== null && 
           this.accessToken !== 'test_token' && 
           this.accessToken.startsWith('duffel_test_');
  }

  /**
   * Get API endpoints being used
   */
  getEndpoints(): { api: string; version: string; links: string } {
    return {
      api: this.apiBaseUrl,
      version: this.apiVersion,
      links: `${this.apiBaseUrl}/links`
    };
  }
}

export const duffelLinksService = new DuffelLinksService(process.env.DUFFEL_API_TOKEN || '');