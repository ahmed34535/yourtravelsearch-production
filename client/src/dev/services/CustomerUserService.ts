/**
 * Customer User Service
 * 
 * Implementation of Duffel's Customer User and Customer User Group APIs
 * for proper user management and Travel Support Assistant integration.
 */

interface CustomerUser {
  id: string;
  email: string;
  phone_number?: string;
  given_name: string;
  family_name: string;
  created_at: string;
  live_mode: boolean;
  group: CustomerUserGroup | null;
}

interface CustomerUserGroup {
  id: string;
  name: string;
  created_at: string;
}

interface CreateCustomerUserRequest {
  email: string;
  phone_number?: string;
  given_name: string;
  family_name: string;
  group_id?: string;
}

interface CreateCustomerUserGroupRequest {
  name: string;
}

export class CustomerUserService {
  private readonly apiBaseUrl = 'https://api.duffel.com';
  private readonly apiVersion = 'v2';
  private accessToken: string | null = null;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null;
  }

  /**
   * Create a new Customer User
   */
  async createCustomerUser(request: CreateCustomerUserRequest): Promise<{ data: CustomerUser }> {
    const url = `${this.apiBaseUrl}/identity/customer/users`;
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateCreateCustomerUser(request);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Customer User creation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer User creation error:', error);
      throw error;
    }
  }

  /**
   * Create a new Customer User Group
   */
  async createCustomerUserGroup(request: CreateCustomerUserGroupRequest): Promise<{ data: CustomerUserGroup }> {
    const url = `${this.apiBaseUrl}/identity/customer/user_groups`;
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateCreateCustomerUserGroup(request);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Customer User Group creation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer User Group creation error:', error);
      throw error;
    }
  }

  /**
   * Get Customer User by ID
   */
  async getCustomerUser(userId: string): Promise<{ data: CustomerUser }> {
    const url = `${this.apiBaseUrl}/identity/customer/users/${userId}`;
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateGetCustomerUser(userId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Customer User retrieval failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer User retrieval error:', error);
      throw error;
    }
  }

  /**
   * List Customer Users
   */
  async listCustomerUsers(groupId?: string): Promise<{ data: CustomerUser[] }> {
    let url = `${this.apiBaseUrl}/identity/customer/users`;
    
    if (groupId) {
      url += `?group_id=${groupId}`;
    }
    
    const headers = {
      'Accept-Encoding': 'gzip',
      'Accept': 'application/json',
      'Duffel-Version': this.apiVersion,
      'Authorization': `Bearer ${this.accessToken}`
    };

    try {
      // In development, simulate the API response
      if (!this.accessToken || this.accessToken === 'test_token') {
        return this.simulateListCustomerUsers(groupId);
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Customer Users listing failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Customer Users listing error:', error);
      throw error;
    }
  }

  /**
   * Simulate Customer User creation for development
   */
  private async simulateCreateCustomerUser(request: CreateCustomerUserRequest): Promise<{ data: CustomerUser }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const userId = `icu_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
    
    let group: CustomerUserGroup | null = null;
    if (request.group_id) {
      group = {
        id: request.group_id,
        name: 'Corporate Travel Group',
        created_at: new Date().toISOString()
      };
    }

    return {
      data: {
        id: userId,
        email: request.email,
        phone_number: request.phone_number,
        given_name: request.given_name,
        family_name: request.family_name,
        created_at: new Date().toISOString(),
        live_mode: false,
        group
      }
    };
  }

  /**
   * Simulate Customer User Group creation for development
   */
  private async simulateCreateCustomerUserGroup(request: CreateCustomerUserGroupRequest): Promise<{ data: CustomerUserGroup }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const groupId = `usg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;

    return {
      data: {
        id: groupId,
        name: request.name,
        created_at: new Date().toISOString()
      }
    };
  }

  /**
   * Simulate Customer User retrieval for development
   */
  private async simulateGetCustomerUser(userId: string): Promise<{ data: CustomerUser }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      data: {
        id: userId,
        email: 'corporate@company.com',
        phone_number: '+44 20 1234 5678',
        given_name: 'Corporate',
        family_name: 'User',
        created_at: new Date().toISOString(),
        live_mode: false,
        group: {
          id: 'usg_corporate_group',
          name: 'Corporate Travel Group',
          created_at: new Date().toISOString()
        }
      }
    };
  }

  /**
   * Simulate Customer Users listing for development
   */
  private async simulateListCustomerUsers(groupId?: string): Promise<{ data: CustomerUser[] }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const users: CustomerUser[] = [
      {
        id: 'icu_corporate_user_1',
        email: 'john.doe@company.com',
        phone_number: '+44 20 1234 5678',
        given_name: 'John',
        family_name: 'Doe',
        created_at: new Date().toISOString(),
        live_mode: false,
        group: groupId ? {
          id: groupId,
          name: 'Corporate Travel Group',
          created_at: new Date().toISOString()
        } : null
      },
      {
        id: 'icu_corporate_user_2',
        email: 'jane.smith@company.com',
        phone_number: '+44 20 1234 5679',
        given_name: 'Jane',
        family_name: 'Smith',
        created_at: new Date().toISOString(),
        live_mode: false,
        group: groupId ? {
          id: groupId,
          name: 'Corporate Travel Group',
          created_at: new Date().toISOString()
        } : null
      }
    ];

    return { data: users };
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
}

export const customerUserService = new CustomerUserService(process.env.DUFFEL_API_TOKEN || '');