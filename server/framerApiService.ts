/**
 * Framer API Integration Service
 * Provides design system management, component automation, and prototyping capabilities
 */

export interface FramerProject {
  id: string;
  name: string;
  description?: string;
  url: string;
  thumbnail?: string;
  lastModified: string;
  isPublished: boolean;
  teamId?: string;
}

export interface FramerComponent {
  id: string;
  name: string;
  description?: string;
  type: 'component' | 'variant' | 'instance';
  properties: FramerProperty[];
  thumbnail?: string;
  lastModified: string;
}

export interface FramerProperty {
  name: string;
  type: 'text' | 'boolean' | 'number' | 'color' | 'image' | 'enum';
  defaultValue?: any;
  options?: string[];
}

export interface FramerAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'font' | 'icon';
  url: string;
  size: number;
  format: string;
  uploadedAt: string;
}

export interface FramerWebhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  createdAt: string;
}

export interface FramerSite {
  id: string;
  name: string;
  url: string;
  customDomain?: string;
  isPublished: boolean;
  theme: FramerTheme;
  pages: FramerPage[];
  lastModified: string;
}

export interface FramerPage {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  components: FramerPageComponent[];
  isHomePage: boolean;
}

export interface FramerPageComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: Record<string, any>;
  children?: FramerPageComponent[];
}

export interface FramerTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface FramerTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  components: FramerPageComponent[];
  isResponsive: boolean;
}

export class FramerApiService {
  private apiKey: string | null;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.FRAMER_API_KEY || null;
    this.baseUrl = 'https://api.framer.com/v1';
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('Framer API key not configured');
    }

    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  // Get all projects in team
  async getProjects(): Promise<FramerProject[]> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Using mock projects data - no API key configured');
        return this.getMockProjects();
      }

      const response = await fetch(`${this.baseUrl}/projects`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.projects || [];

    } catch (error) {
      console.error('[Framer API] Projects error:', error);
      return this.getMockProjects();
    }
  }

  // Get project details
  async getProject(projectId: string): Promise<FramerProject | null> {
    try {
      if (!this.apiKey) {
        return this.getMockProject(projectId);
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Project details error:', error);
      return this.getMockProject(projectId);
    }
  }

  // Get design components from project
  async getComponents(projectId: string): Promise<FramerComponent[]> {
    try {
      if (!this.apiKey) {
        return this.getMockComponents(projectId);
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/components`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.components || [];

    } catch (error) {
      console.error('[Framer API] Components error:', error);
      return this.getMockComponents(projectId);
    }
  }

  // Create new component
  async createComponent(projectId: string, componentData: Partial<FramerComponent>): Promise<FramerComponent | null> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock component created');
        return this.getMockCreatedComponent(componentData);
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/components`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(componentData)
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Component creation error:', error);
      return null;
    }
  }

  // Get project assets
  async getAssets(projectId: string): Promise<FramerAsset[]> {
    try {
      if (!this.apiKey) {
        return this.getMockAssets(projectId);
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/assets`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.assets || [];

    } catch (error) {
      console.error('[Framer API] Assets error:', error);
      return this.getMockAssets(projectId);
    }
  }

  // Upload asset to project
  async uploadAsset(projectId: string, file: Buffer, fileName: string, fileType: string): Promise<FramerAsset | null> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock asset uploaded');
        return this.getMockUploadedAsset(fileName, fileType);
      }

      const formData = new FormData();
      formData.append('file', new Blob([file], { type: fileType }), fileName);

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/assets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Asset upload error:', error);
      return null;
    }
  }

  // Publish project
  async publishProject(projectId: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock project published');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/publish`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      return response.ok;

    } catch (error) {
      console.error('[Framer API] Project publishing error:', error);
      return false;
    }
  }

  // Create webhook for design updates
  async createWebhook(url: string, events: string[]): Promise<FramerWebhook | null> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock webhook created');
        return this.getMockWebhook(url, events);
      }

      const response = await fetch(`${this.baseUrl}/webhooks`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          url,
          events,
          isActive: true
        })
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Webhook creation error:', error);
      return null;
    }
  }

  // Export component as code
  async exportComponent(projectId: string, componentId: string, format: 'react' | 'vue' | 'html'): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return this.getMockComponentCode(componentId, format);
      }

      const response = await fetch(`${this.baseUrl}/projects/${projectId}/components/${componentId}/export?format=${format}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.code || null;

    } catch (error) {
      console.error('[Framer API] Component export error:', error);
      return this.getMockComponentCode(componentId, format);
    }
  }

  // Website and Site Management APIs
  
  // Get all published sites
  async getSites(): Promise<FramerSite[]> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Using mock sites data - no API key configured');
        return this.getMockSites();
      }

      const response = await fetch(`${this.baseUrl}/sites`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.sites || [];

    } catch (error) {
      console.error('[Framer API] Sites error:', error);
      return this.getMockSites();
    }
  }

  // Get site details and pages
  async getSite(siteId: string): Promise<FramerSite | null> {
    try {
      if (!this.apiKey) {
        return this.getMockSite(siteId);
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Site details error:', error);
      return this.getMockSite(siteId);
    }
  }

  // Update site theme/branding
  async updateSiteTheme(siteId: string, theme: Partial<FramerTheme>): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock site theme updated');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/theme`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ theme })
      });

      return response.ok;

    } catch (error) {
      console.error('[Framer API] Theme update error:', error);
      return false;
    }
  }

  // Add/update page content
  async updatePage(siteId: string, pageId: string, pageData: Partial<FramerPage>): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock page updated');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/pages/${pageId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(pageData)
      });

      return response.ok;

    } catch (error) {
      console.error('[Framer API] Page update error:', error);
      return false;
    }
  }

  // Create new page from template
  async createPageFromTemplate(siteId: string, templateId: string, pageName: string): Promise<FramerPage | null> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock page created from template');
        return this.getMockCreatedPage(pageName);
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/pages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: pageName,
          templateId: templateId
        })
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[Framer API] Page creation error:', error);
      return null;
    }
  }

  // Get available templates for travel industry
  async getTravelTemplates(): Promise<FramerTemplate[]> {
    try {
      if (!this.apiKey) {
        return this.getMockTravelTemplates();
      }

      const response = await fetch(`${this.baseUrl}/templates?category=travel&category=business`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Framer API error: ${response.status}`);
      }

      const data = await response.json();
      return data.templates || [];

    } catch (error) {
      console.error('[Framer API] Templates error:', error);
      return this.getMockTravelTemplates();
    }
  }

  // Set custom domain for site
  async setCustomDomain(siteId: string, domain: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock custom domain set');
        return true;
      }

      const response = await fetch(`${this.baseUrl}/sites/${siteId}/domain`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ domain })
      });

      return response.ok;

    } catch (error) {
      console.error('[Framer API] Custom domain error:', error);
      return false;
    }
  }

  // Customize travel booking flow pages
  async customizeBookingFlow(siteId: string, flowData: {
    searchPage: Partial<FramerPage>;
    resultsPage: Partial<FramerPage>;
    checkoutPage: Partial<FramerPage>;
  }): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('[Framer API] Mock booking flow customized');
        return true;
      }

      const promises = [
        this.updatePage(siteId, 'search', flowData.searchPage),
        this.updatePage(siteId, 'results', flowData.resultsPage),
        this.updatePage(siteId, 'checkout', flowData.checkoutPage)
      ];

      const results = await Promise.all(promises);
      return results.every(result => result === true);

    } catch (error) {
      console.error('[Framer API] Booking flow customization error:', error);
      return false;
    }
  }

  // Mock data for development/fallback
  private getMockSites(): FramerSite[] {
    return [
      {
        id: 'site_yourtravelsearch_main',
        name: 'YourTravelSearch Main Site',
        url: 'https://yourtravelsearch.framer.website',
        customDomain: 'yourtravelsearch.com',
        isPublished: true,
        theme: {
          colors: {
            primary: '#3b82f6',
            secondary: '#10b981',
            background: '#ffffff',
            text: '#1f2937',
            accent: '#f59e0b'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter'
          },
          spacing: {
            small: 8,
            medium: 16,
            large: 32
          }
        },
        pages: [
          {
            id: 'page_home',
            name: 'Home',
            slug: '/',
            title: 'YourTravelSearch - Best Flight Deals',
            description: 'Find and book the best flight deals worldwide',
            components: [],
            isHomePage: true
          },
          {
            id: 'page_search',
            name: 'Flight Search',
            slug: '/search',
            title: 'Search Flights',
            description: 'Search for flights to your destination',
            components: [],
            isHomePage: false
          }
        ],
        lastModified: new Date().toISOString()
      }
    ];
  }

  private getMockSite(siteId: string): FramerSite {
    return this.getMockSites()[0];
  }

  private getMockCreatedPage(pageName: string): FramerPage {
    return {
      id: 'page_' + Math.random().toString(36).substr(2, 9),
      name: pageName,
      slug: '/' + pageName.toLowerCase().replace(/\s+/g, '-'),
      title: pageName,
      description: `${pageName} page for YourTravelSearch`,
      components: [],
      isHomePage: false
    };
  }

  private getMockTravelTemplates(): FramerTemplate[] {
    return [
      {
        id: 'template_travel_booking',
        name: 'Travel Booking Platform',
        category: 'travel',
        description: 'Complete travel booking platform with search, results, and checkout pages',
        thumbnail: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Travel+Booking',
        components: [],
        isResponsive: true
      },
      {
        id: 'template_flight_search',
        name: 'Flight Search Interface',
        category: 'travel',
        description: 'Modern flight search interface with filters and sorting',
        thumbnail: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Flight+Search',
        components: [],
        isResponsive: true
      },
      {
        id: 'template_travel_blog',
        name: 'Travel Blog & Guides',
        category: 'travel',
        description: 'Travel blog template with destination guides and tips',
        thumbnail: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Travel+Blog',
        components: [],
        isResponsive: true
      }
    ];
  }

  private getMockProjects(): FramerProject[] {
    return [
      {
        id: 'proj_yourtravelsearch_design',
        name: 'YourTravelSearch Design System',
        description: 'Complete design system and components for travel booking platform',
        url: 'https://framer.com/projects/yourtravelsearch-design',
        thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Travel+Design',
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isPublished: true,
        teamId: 'team_yourtravelsearch'
      },
      {
        id: 'proj_yourtravelsearch_mobile',
        name: 'YourTravelSearch Mobile App',
        description: 'Mobile app prototypes and user flows',
        url: 'https://framer.com/projects/yourtravelsearch-mobile',
        thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Mobile+App',
        lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isPublished: false,
        teamId: 'team_yourtravelsearch'
      }
    ];
  }

  private getMockProject(projectId: string): FramerProject {
    return {
      id: projectId,
      name: 'YourTravelSearch Design System',
      description: 'Complete design system and components for travel booking platform',
      url: 'https://framer.com/projects/yourtravelsearch-design',
      thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Travel+Design',
      lastModified: new Date().toISOString(),
      isPublished: true,
      teamId: 'team_yourtravelsearch'
    };
  }

  private getMockComponents(projectId: string): FramerComponent[] {
    return [
      {
        id: 'comp_flight_card',
        name: 'Flight Offer Card',
        description: 'Interactive flight offer display with pricing and airline information',
        type: 'component',
        properties: [
          { name: 'airline', type: 'text', defaultValue: 'Frontier Airlines' },
          { name: 'price', type: 'number', defaultValue: 194.33 },
          { name: 'departure', type: 'text', defaultValue: 'LAX' },
          { name: 'arrival', type: 'text', defaultValue: 'JFK' },
          { name: 'isSelectable', type: 'boolean', defaultValue: true }
        ],
        thumbnail: 'https://via.placeholder.com/200x120/3b82f6/ffffff?text=Flight+Card',
        lastModified: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'comp_search_form',
        name: 'Flight Search Form',
        description: 'Travel search interface with airport selection and date pickers',
        type: 'component',
        properties: [
          { name: 'origin', type: 'text', defaultValue: 'Los Angeles (LAX)' },
          { name: 'destination', type: 'text', defaultValue: 'New York (JFK)' },
          { name: 'passengers', type: 'number', defaultValue: 1 },
          { name: 'tripType', type: 'enum', options: ['one-way', 'round-trip', 'multi-city'], defaultValue: 'round-trip' }
        ],
        thumbnail: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Search+Form',
        lastModified: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comp_booking_button',
        name: 'Book Now Button',
        description: 'Primary action button for flight booking',
        type: 'component',
        properties: [
          { name: 'text', type: 'text', defaultValue: 'Book Now' },
          { name: 'variant', type: 'enum', options: ['primary', 'secondary', 'outline'], defaultValue: 'primary' },
          { name: 'isLoading', type: 'boolean', defaultValue: false },
          { name: 'isDisabled', type: 'boolean', defaultValue: false }
        ],
        thumbnail: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=Book+Button',
        lastModified: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockCreatedComponent(componentData: Partial<FramerComponent>): FramerComponent {
    return {
      id: 'comp_' + Math.random().toString(36).substr(2, 9),
      name: componentData.name || 'New Component',
      description: componentData.description || '',
      type: componentData.type || 'component',
      properties: componentData.properties || [],
      thumbnail: 'https://via.placeholder.com/200x120/6366f1/ffffff?text=New+Component',
      lastModified: new Date().toISOString()
    };
  }

  private getMockAssets(projectId: string): FramerAsset[] {
    return [
      {
        id: 'asset_logo',
        name: 'yourtravelsearch-logo.svg',
        type: 'image',
        url: 'https://via.placeholder.com/200x60/3b82f6/ffffff?text=YourTravelSearch',
        size: 12500,
        format: 'svg',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'asset_hero_bg',
        name: 'hero-background.jpg',
        type: 'image',
        url: 'https://via.placeholder.com/1920x1080/1e40af/ffffff?text=Travel+Hero',
        size: 845000,
        format: 'jpg',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'asset_icons',
        name: 'travel-icons.svg',
        type: 'icon',
        url: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Icons',
        size: 28000,
        format: 'svg',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  private getMockUploadedAsset(fileName: string, fileType: string): FramerAsset {
    return {
      id: 'asset_' + Math.random().toString(36).substr(2, 9),
      name: fileName,
      type: fileType.startsWith('image/') ? 'image' : 'video',
      url: `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent(fileName)}`,
      size: Math.floor(Math.random() * 500000) + 50000,
      format: fileType.split('/')[1] || 'unknown',
      uploadedAt: new Date().toISOString()
    };
  }

  private getMockWebhook(url: string, events: string[]): FramerWebhook {
    return {
      id: 'webhook_' + Math.random().toString(36).substr(2, 9),
      url,
      events,
      isActive: true,
      secret: 'whsec_' + Math.random().toString(36).substr(2, 32),
      createdAt: new Date().toISOString()
    };
  }

  private getMockComponentCode(componentId: string, format: string): string {
    const componentName = 'FlightOfferCard';
    
    if (format === 'react') {
      return `import React from 'react';

interface ${componentName}Props {
  airline: string;
  price: number;
  departure: string;
  arrival: string;
  isSelectable?: boolean;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  airline,
  price,
  departure,
  arrival,
  isSelectable = true
}) => {
  return (
    <div className="flight-offer-card">
      <div className="airline-info">
        <h3>{airline}</h3>
      </div>
      <div className="route-info">
        <span>{departure}</span>
        <span>→</span>
        <span>{arrival}</span>
      </div>
      <div className="price-info">
        <span>\${price}</span>
        {isSelectable && <button>Select</button>}
      </div>
    </div>
  );
};`;
    }
    
    return `<!-- ${componentName} Component -->
<div class="flight-offer-card">
  <div class="airline-info">
    <h3>{{airline}}</h3>
  </div>
  <div class="route-info">
    <span>{{departure}}</span>
    <span>→</span>
    <span>{{arrival}}</span>
  </div>
  <div class="price-info">
    <span>\${{price}}</span>
    <button v-if="isSelectable">Select</button>
  </div>
</div>`;
  }
}

export const framerService = new FramerApiService();