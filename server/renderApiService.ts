/**
 * Render API Integration Service
 * Provides deployment automation, infrastructure management, and performance monitoring
 */

export interface RenderService {
  id: string;
  name: string;
  type: 'web_service' | 'background_worker' | 'private_service' | 'static_site';
  environment: 'production' | 'preview';
  state: 'active' | 'suspended' | 'build_failed' | 'update_failed';
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RenderDeploy {
  id: string;
  status: 'created' | 'build_in_progress' | 'update_in_progress' | 'live' | 'deactivated' | 'build_failed' | 'update_failed' | 'canceled';
  createdAt: string;
  finishedAt?: string;
  commitId?: string;
  commitMessage?: string;
}

export interface RenderDomain {
  id: string;
  name: string;
  verified: boolean;
  certificateStatus: 'issued' | 'pending' | 'failed';
  createdAt: string;
}

export interface RenderMetrics {
  cpu: { timestamp: string; value: number }[];
  memory: { timestamp: string; value: number }[];
  bandwidth: { timestamp: string; value: number }[];
  requests: { timestamp: string; value: number }[];
}

export class RenderApiService {
  private apiKey: string | null;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RENDER_API_KEY || null;
    this.baseUrl = 'https://api.render.com/v1';
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('Render API key not configured');
    }

    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Get all services in account
  async getServices(): Promise<RenderService[]> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Using mock services data - no API key configured');
        return this.getMockServices();
      }

      const response = await fetch(`${this.baseUrl}/services`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      const data = await response.json();
      return data.services || [];

    } catch (error) {
      console.error('[Render API] Services error:', error);
      return this.getMockServices();
    }
  }

  // Get service details
  async getService(serviceId: string): Promise<RenderService | null> {
    try {
      if (!this.apiKey) {
        return this.getMockService(serviceId);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Service details error:', error);
      return this.getMockService(serviceId);
    }
  }

  // Get deployment history
  async getDeployments(serviceId: string): Promise<RenderDeploy[]> {
    try {
      if (!this.apiKey) {
        return this.getMockDeployments(serviceId);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}/deploys`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      const data = await response.json();
      return data.deploys || [];

    } catch (error) {
      console.error('[Render API] Deployments error:', error);
      return this.getMockDeployments(serviceId);
    }
  }

  // Trigger new deployment
  async createDeployment(serviceId: string): Promise<RenderDeploy | null> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Mock deployment triggered');
        return this.getMockNewDeployment(serviceId);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}/deploys`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Deployment creation error:', error);
      return null;
    }
  }

  // Get custom domains
  async getDomains(serviceId: string): Promise<RenderDomain[]> {
    try {
      if (!this.apiKey) {
        return this.getMockDomains(serviceId);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}/custom-domains`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      const data = await response.json();
      return data.customDomains || [];

    } catch (error) {
      console.error('[Render API] Domains error:', error);
      return this.getMockDomains(serviceId);
    }
  }

  // Add custom domain
  async addDomain(serviceId: string, domainName: string): Promise<RenderDomain | null> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Mock domain added');
        return this.getMockAddedDomain(domainName);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}/custom-domains`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: domainName
        })
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Domain addition error:', error);
      return null;
    }
  }

  // Get service metrics
  async getMetrics(serviceId: string, startTime: string, endTime: string): Promise<RenderMetrics> {
    try {
      if (!this.apiKey) {
        return this.getMockMetrics(startTime, endTime);
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}/metrics?start=${startTime}&end=${endTime}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Metrics error:', error);
      return this.getMockMetrics(startTime, endTime);
    }
  }

  // Update service environment variables
  async updateEnvironmentVariables(serviceId: string, envVars: Record<string, string>): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Mock environment variables updated');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/services/${serviceId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          envVars: Object.entries(envVars).map(([key, value]) => ({
            key,
            value
          }))
        })
      });

      return response.ok;

    } catch (error) {
      console.error('[Render API] Environment variables update error:', error);
      return false;
    }
  }

  // Multi-service portfolio management
  async createService(serviceData: {
    name: string;
    type: 'web_service' | 'background_worker' | 'private_service' | 'static_site';
    environment: 'production' | 'preview';
    repo: string;
    branch?: string;
    buildCommand?: string;
    startCommand?: string;
  }): Promise<RenderService | null> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Mock service created');
        return this.getMockCreatedService(serviceData);
      }

      const response = await fetch(`${this.baseUrl}/services`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...serviceData,
          autoDeploy: 'yes',
          branch: serviceData.branch || 'main'
        })
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Service creation error:', error);
      return null;
    }
  }

  // Get services by environment
  async getServicesByEnvironment(environment?: 'production' | 'preview'): Promise<RenderService[]> {
    try {
      const allServices = await this.getServices();
      
      if (!environment) {
        return allServices;
      }
      
      return allServices.filter(service => service.environment === environment);

    } catch (error) {
      console.error('[Render API] Services by environment error:', error);
      return [];
    }
  }

  // Clone service for different environments
  async cloneService(sourceServiceId: string, newName: string, environment: 'production' | 'preview'): Promise<RenderService | null> {
    try {
      if (!this.apiKey) {
        console.log('[Render API] Mock service cloned');
        return this.getMockClonedService(newName, environment);
      }

      const sourceService = await this.getService(sourceServiceId);
      if (!sourceService) {
        throw new Error('Source service not found');
      }

      const response = await fetch(`${this.baseUrl}/services/${sourceServiceId}/clone`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: newName,
          environment
        })
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Service cloning error:', error);
      return null;
    }
  }

  // Get account usage and limits
  async getAccountUsage(): Promise<{
    services: { used: number; limit: number };
    bandwidth: { used: number; limit: number; unit: string };
    buildMinutes: { used: number; limit: number };
    teamMembers: { used: number; limit: number };
  }> {
    try {
      if (!this.apiKey) {
        return this.getMockAccountUsage();
      }

      const response = await fetch(`${this.baseUrl}/account/usage`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Render API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Render API] Account usage error:', error);
      return this.getMockAccountUsage();
    }
  }

  // Multi-service deployment strategy
  async getTravelServiceStrategy(): Promise<{
    recommended: {
      name: string;
      type: string;
      purpose: string;
      environment: string;
    }[];
    architecture: string[];
    scaling: string[];
  }> {
    return {
      recommended: [
        {
          name: 'yourtravelsearch-prod',
          type: 'web_service',
          purpose: 'Main production website',
          environment: 'production'
        },
        {
          name: 'yourtravelsearch-api',
          type: 'web_service', 
          purpose: 'Dedicated API service',
          environment: 'production'
        },
        {
          name: 'yourtravelsearch-staging',
          type: 'web_service',
          purpose: 'Testing and QA environment',
          environment: 'preview'
        },
        {
          name: 'yourtravelsearch-admin',
          type: 'private_service',
          purpose: 'Internal admin dashboard',
          environment: 'production'
        },
        {
          name: 'yourtravelsearch-workers',
          type: 'background_worker',
          purpose: 'Email processing and data sync',
          environment: 'production'
        }
      ],
      architecture: [
        'Separate production and staging environments',
        'Dedicated API service for better performance',
        'Private admin service for security',
        'Background workers for async processing',
        'Load balancing across multiple instances'
      ],
      scaling: [
        'Start with Standard plan for main service',
        'Use Starter plans for staging/testing',
        'Scale horizontally with multiple services',
        'Implement auto-scaling based on traffic',
        'Use CDN for static assets'
      ]
    };
  }

  // Mock data for development/fallback
  private getMockCreatedService(serviceData: any): RenderService {
    return {
      id: 'srv_' + Math.random().toString(36).substr(2, 9),
      name: serviceData.name,
      type: serviceData.type,
      environment: serviceData.environment,
      state: 'active',
      url: `https://${serviceData.name}.onrender.com`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockClonedService(name: string, environment: string): RenderService {
    return {
      id: 'srv_' + Math.random().toString(36).substr(2, 9),
      name,
      type: 'web_service',
      environment: environment as 'production' | 'preview',
      state: 'active',
      url: `https://${name}.onrender.com`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockAccountUsage() {
    return {
      services: { used: 3, limit: 100 },
      bandwidth: { used: 45.2, limit: 100, unit: 'GB' },
      buildMinutes: { used: 120, limit: 500 },
      teamMembers: { used: 1, limit: 5 }
    };
  }

  private getMockServices(): RenderService[] {
    return [
      {
        id: 'srv_yourtravelsearch_prod',
        name: 'yourtravelsearch-production',
        type: 'web_service',
        environment: 'production',
        state: 'active',
        url: 'https://yourtravelsearch.onrender.com',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'srv_yourtravelsearch_preview',
        name: 'yourtravelsearch-preview',
        type: 'web_service',
        environment: 'preview',
        state: 'active',
        url: 'https://yourtravelsearch-preview.onrender.com',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getMockService(serviceId: string): RenderService {
    return {
      id: serviceId,
      name: 'yourtravelsearch-production',
      type: 'web_service',
      environment: 'production',
      state: 'active',
      url: 'https://yourtravelsearch.onrender.com',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockDeployments(serviceId: string): RenderDeploy[] {
    return [
      {
        id: 'dpl_latest',
        status: 'live',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        finishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        commitId: 'abc123def456',
        commitMessage: 'Enhanced flight booking system with live API integration'
      },
      {
        id: 'dpl_previous',
        status: 'deactivated',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        finishedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        commitId: 'def456ghi789',
        commitMessage: 'Added custom SEO intelligence dashboard'
      }
    ];
  }

  private getMockNewDeployment(serviceId: string): RenderDeploy {
    return {
      id: 'dpl_' + Math.random().toString(36).substr(2, 9),
      status: 'build_in_progress',
      createdAt: new Date().toISOString(),
      commitId: 'new' + Math.random().toString(36).substr(2, 6),
      commitMessage: 'Latest updates deployed via API'
    };
  }

  private getMockDomains(serviceId: string): RenderDomain[] {
    return [
      {
        id: 'dom_yourtravelsearch',
        name: 'yourtravelsearch.com',
        verified: true,
        certificateStatus: 'issued',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'dom_www_yourtravelsearch',
        name: 'www.yourtravelsearch.com',
        verified: true,
        certificateStatus: 'issued',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockAddedDomain(domainName: string): RenderDomain {
    return {
      id: 'dom_' + Math.random().toString(36).substr(2, 9),
      name: domainName,
      verified: false,
      certificateStatus: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  private getMockMetrics(startTime: string, endTime: string): RenderMetrics {
    const points = 24; // 24 hours of data
    const now = new Date();
    
    return {
      cpu: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now.getTime() - (points - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 80 + 10 // 10-90% CPU
      })),
      memory: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now.getTime() - (points - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 400 + 100 // 100-500MB memory
      })),
      bandwidth: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now.getTime() - (points - i) * 60 * 60 * 1000).toISOString(),
        value: Math.random() * 1000 + 50 // 50-1050 MB/hour
      })),
      requests: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now.getTime() - (points - i) * 60 * 60 * 1000).toISOString(),
        value: Math.floor(Math.random() * 500) + 50 // 50-550 requests/hour
      }))
    };
  }
}

export const renderService = new RenderApiService();