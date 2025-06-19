/**
 * GoDaddy API Integration Service
 * Provides domain management, DNS control, and SSL certificate automation
 */

export interface DomainInfo {
  domain: string;
  available: boolean;
  price: number;
  currency: string;
  period: number;
}

export interface DNSRecord {
  type: string;
  name: string;
  data: string;
  ttl: number;
}

export interface SSLCertificate {
  certificateId: string;
  commonName: string;
  type: string;
  validFrom: string;
  validTo: string;
  status: string;
}

export class GoDaddyApiService {
  private apiKey: string | null;
  private apiSecret: string | null;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GODADDY_API_KEY || null;
    this.apiSecret = process.env.GODADDY_API_SECRET || null;
    this.baseUrl = 'https://api.godaddy.com/v1';
  }

  private getHeaders() {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('GoDaddy API credentials not configured');
    }

    return {
      'Authorization': `sso-key ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Domain availability and pricing
  async checkDomainAvailability(domain: string): Promise<DomainInfo[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.log('[GoDaddy API] Using mock domain data - no API credentials configured');
        return this.getMockDomainData(domain);
      }

      const response = await fetch(`${this.baseUrl}/domains/available?domain=${encodeURIComponent(domain)}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GoDaddy API error: ${response.status}`);
      }

      const data = await response.json();
      return data.domains || [];

    } catch (error) {
      console.error('[GoDaddy API] Domain check error:', error);
      return this.getMockDomainData(domain);
    }
  }

  // Domain suggestions for travel business
  async getTravelDomainSuggestions(keyword: string): Promise<DomainInfo[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return this.getMockTravelDomains(keyword);
      }

      const response = await fetch(`${this.baseUrl}/domains/suggest?query=${encodeURIComponent(keyword)}&country=US&city=&sources=CC,PREMIUM&tlds=com,net,org&lengthMax=25&lengthMin=1&limit=25&waitMs=1000`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GoDaddy API error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('[GoDaddy API] Domain suggestions error:', error);
      return this.getMockTravelDomains(keyword);
    }
  }

  // DNS management for subdomains
  async getDNSRecords(domain: string): Promise<DNSRecord[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return this.getMockDNSRecords(domain);
      }

      const response = await fetch(`${this.baseUrl}/domains/${domain}/records`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GoDaddy API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[GoDaddy API] DNS records error:', error);
      return this.getMockDNSRecords(domain);
    }
  }

  // Add subdomain for international markets
  async addSubdomain(domain: string, subdomain: string, targetIP: string): Promise<boolean> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.log('[GoDaddy API] Mock subdomain creation successful');
        return true;
      }

      const dnsRecord = {
        type: 'A',
        name: subdomain,
        data: targetIP,
        ttl: 3600
      };

      const response = await fetch(`${this.baseUrl}/domains/${domain}/records`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify([dnsRecord])
      });

      return response.ok;

    } catch (error) {
      console.error('[GoDaddy API] Subdomain creation error:', error);
      return false;
    }
  }

  // SSL certificate management
  async getSSLCertificates(domain: string): Promise<SSLCertificate[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return this.getMockSSLCertificates(domain);
      }

      const response = await fetch(`${this.baseUrl}/certificates?domain=${domain}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GoDaddy API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[GoDaddy API] SSL certificates error:', error);
      return this.getMockSSLCertificates(domain);
    }
  }

  // Multi-domain portfolio management
  async getDomainPortfolio(): Promise<DomainInfo[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.log('[GoDaddy API] Using mock portfolio data - no API credentials configured');
        return this.getMockDomainPortfolio();
      }

      const response = await fetch(`${this.baseUrl}/domains`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`GoDaddy API error: ${response.status}`);
      }

      const data = await response.json();
      return data || [];

    } catch (error) {
      console.error('[GoDaddy API] Domain portfolio error:', error);
      return this.getMockDomainPortfolio();
    }
  }

  // Purchase domain
  async purchaseDomain(domain: string, period: number = 1): Promise<boolean> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.log('[GoDaddy API] Mock domain purchase successful');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/domains/purchase`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          domain,
          period,
          nameServers: ['ns07.domaincontrol.com', 'ns08.domaincontrol.com'],
          renewAuto: true,
          privacy: true
        })
      });

      return response.ok;

    } catch (error) {
      console.error('[GoDaddy API] Domain purchase error:', error);
      return false;
    }
  }

  // Bulk domain operations
  async bulkDomainCheck(domains: string[]): Promise<Record<string, DomainInfo>> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        return this.getMockBulkDomainCheck(domains);
      }

      const promises = domains.map(domain => this.checkDomainAvailability(domain));
      const results = await Promise.all(promises);
      
      const domainMap: Record<string, DomainInfo> = {};
      domains.forEach((domain, index) => {
        domainMap[domain] = results[index][0] || {
          domain,
          available: false,
          price: 0,
          currency: 'USD',
          period: 1
        };
      });

      return domainMap;

    } catch (error) {
      console.error('[GoDaddy API] Bulk domain check error:', error);
      return this.getMockBulkDomainCheck(domains);
    }
  }

  // Domain transfer
  async transferDomain(domain: string, authCode: string): Promise<boolean> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        console.log('[GoDaddy API] Mock domain transfer initiated');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/domains/transfers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          domain,
          authCode,
          period: 1,
          renewAuto: true,
          privacy: true
        })
      });

      return response.ok;

    } catch (error) {
      console.error('[GoDaddy API] Domain transfer error:', error);
      return false;
    }
  }

  // Travel domain strategy recommendations
  async getTravelDomainStrategy(): Promise<{
    primary: string;
    brandProtection: string[];
    international: string[];
    seo: string[];
    recommendations: string[];
  }> {
    return {
      primary: 'yourtravelsearch.com',
      brandProtection: [
        'yourtravelsearch.net',
        'yourtravelsearch.org',
        'travalsearch.com',
        'yourtravelsearch.co'
      ],
      international: [
        'yourtravelsearch.co.uk',
        'yourtravelsearch.ca',
        'yourtravelsearch.com.au',
        'yourtravelsearch.de',
        'yourtravelsearch.fr'
      ],
      seo: [
        'cheapflights-search.com',
        'bestflightdeals.co',
        'traveldeals-finder.com',
        'flightbooking-hub.com'
      ],
      recommendations: [
        'Secure .com, .net, .org for brand protection',
        'Consider country-specific domains for international expansion',
        'Register keyword-rich domains for SEO advantage',
        'Set up domain forwarding to consolidate traffic',
        'Enable domain privacy protection',
        'Use bulk registration discounts for multiple domains'
      ]
    };
  }

  // Mock data for development/fallback
  private getMockDomainPortfolio(): DomainInfo[] {
    return [
      {
        domain: 'yourtravelsearch.com',
        available: false, // Already owned
        price: 12.99,
        currency: 'USD',
        period: 1
      },
      {
        domain: 'travalsearch.com',
        available: true,
        price: 12.99,
        currency: 'USD',
        period: 1
      },
      {
        domain: 'yourtravelsearch.net',
        available: true,
        price: 19.99,
        currency: 'USD',
        period: 1
      },
      {
        domain: 'yourtravelsearch.org',
        available: true,
        price: 19.99,
        currency: 'USD',
        period: 1
      },
      {
        domain: 'yourtravelsearch.travel',
        available: true,
        price: 89.99,
        currency: 'USD',
        period: 1
      }
    ];
  }

  private getMockBulkDomainCheck(domains: string[]): Record<string, DomainInfo> {
    const result: Record<string, DomainInfo> = {};
    domains.forEach(domain => {
      result[domain] = {
        domain,
        available: !domain.includes('yourtravelsearch.com'), // Main domain owned
        price: domain.includes('.travel') ? 89.99 : domain.includes('.com') ? 12.99 : 19.99,
        currency: 'USD',
        period: 1
      };
    });
    return result;
  }

  private getMockDomainData(domain: string): DomainInfo[] {
    const tlds = ['com', 'net', 'org', 'travel', 'flights'];
    const baseName = domain.replace(/\.(com|net|org|travel|flights)$/, '');
    
    return tlds.map(tld => ({
      domain: `${baseName}.${tld}`,
      available: Math.random() > 0.3,
      price: tld === 'com' ? 12.99 : tld === 'travel' ? 89.99 : 19.99,
      currency: 'USD',
      period: 1
    }));
  }

  private getMockTravelDomains(keyword: string): DomainInfo[] {
    const suggestions = [
      `${keyword}travel.com`,
      `${keyword}flights.com`,
      `${keyword}booking.com`,
      `${keyword}trips.com`,
      `fly${keyword}.com`,
      `book${keyword}.com`,
      `${keyword}adventures.com`,
      `${keyword}journeys.com`
    ];

    return suggestions.map(domain => ({
      domain,
      available: Math.random() > 0.4,
      price: Math.floor(Math.random() * 50) + 10,
      currency: 'USD',
      period: 1
    }));
  }

  private getMockDNSRecords(domain: string): DNSRecord[] {
    return [
      { type: 'A', name: '@', data: '192.168.1.1', ttl: 3600 },
      { type: 'CNAME', name: 'www', data: domain, ttl: 3600 },
      { type: 'MX', name: '@', data: '10 mail.' + domain, ttl: 3600 }
    ];
  }

  private getMockSSLCertificates(domain: string): SSLCertificate[] {
    return [
      {
        certificateId: 'ssl_' + Math.random().toString(36).substr(2, 9),
        commonName: domain,
        type: 'DV',
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      }
    ];
  }
}

export const godaddyService = new GoDaddyApiService();