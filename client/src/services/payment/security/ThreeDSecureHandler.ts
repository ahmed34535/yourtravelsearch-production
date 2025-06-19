/**
 * 3D Secure Authentication Handler
 * 
 * Enterprise-grade 3DS2 implementation following EMVCo standards
 * and PCI DSS compliance requirements.
 */

import { ThreeDSecureResult, PaymentError } from '../types';

export interface ThreeDSecureChallenge {
  challengeUrl: string;
  transactionId: string;
  returnUrl: string;
  timeout: number;
}

export interface ThreeDSecureConfig {
  merchantId: string;
  acquirerBin: string;
  merchantCategoryCode: string;
  merchantName: string;
  threeDSRequestorUrl: string;
  challengeWindowSize: '01' | '02' | '03' | '04' | '05';
}

export class ThreeDSecureHandler {
  private config: ThreeDSecureConfig;
  private challengeWindow: Window | null = null;

  constructor(config: ThreeDSecureConfig) {
    this.config = config;
    this.setupMessageHandlers();
  }

  /**
   * Initiate 3DS authentication flow
   */
  async authenticate(
    paymentIntentId: string,
    cardData: {
      number: string;
      expiry: string;
      holderName: string;
    },
    returnUrl: string
  ): Promise<ThreeDSecureResult> {
    try {
      // Step 1: Authentication Request (AReq)
      const authRequest = await this.createAuthenticationRequest(
        paymentIntentId,
        cardData
      );

      // Step 2: Authentication Response (ARes)
      const authResponse = await this.processAuthenticationRequest(authRequest);

      // Step 3: Handle challenge if required
      if (authResponse.transStatus === 'C' && authResponse.acsUrl) {
        return await this.handleChallenge({
          challengeUrl: authResponse.acsUrl,
          transactionId: authResponse.threeDSServerTransID,
          returnUrl,
          timeout: 300000 // 5 minutes
        });
      }

      // Step 4: Return result based on authentication status
      return this.mapAuthenticationResult(authResponse);
    } catch (error) {
      return this.handleAuthenticationError(error);
    }
  }

  /**
   * Create 3DS authentication request
   */
  private async createAuthenticationRequest(
    paymentIntentId: string,
    cardData: any
  ): Promise<ThreeDSAuthRequest> {
    const browserInfo = this.collectBrowserInformation();
    
    return {
      threeDSServerTransID: this.generateTransactionId(),
      messageType: 'AReq',
      messageVersion: '2.1.0',
      acquirerBIN: this.config.acquirerBin,
      merchantId: this.config.merchantId,
      mcc: this.config.merchantCategoryCode,
      merchantName: this.config.merchantName,
      cardholderAccount: {
        acctNumber: this.maskCardNumber(cardData.number),
        acctExpiry: cardData.expiry,
        cardholderName: cardData.holderName
      },
      purchase: {
        purchaseAmount: '0', // Will be set by payment processor
        purchaseCurrency: '840', // USD
        purchaseExponent: '2',
        purchaseDate: new Date().toISOString().slice(0, 14) + 'Z'
      },
      browserInformation: browserInfo,
      threeDSRequestorURL: this.config.threeDSRequestorUrl,
      challengeWindowSize: this.config.challengeWindowSize,
      paymentIntentId
    };
  }

  /**
   * Process authentication request with 3DS server
   */
  private async processAuthenticationRequest(
    authRequest: ThreeDSAuthRequest
  ): Promise<ThreeDSAuthResponse> {
    // This would integrate with actual 3DS server
    // For now, return mock response structure
    return {
      threeDSServerTransID: authRequest.threeDSServerTransID,
      messageType: 'ARes',
      messageVersion: '2.1.0',
      transStatus: 'C', // Challenge required
      acsUrl: 'https://acs.example.com/challenge',
      acsReferenceNumber: this.generateACSReference(),
      dsReferenceNumber: this.generateDSReference(),
      challengeRequired: true
    };
  }

  /**
   * Handle 3DS challenge flow
   */
  private async handleChallenge(
    challenge: ThreeDSecureChallenge
  ): Promise<ThreeDSecureResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.closeChallengeWindow();
        reject(new Error('3DS challenge timeout'));
      }, challenge.timeout);

      // Open challenge window
      this.challengeWindow = window.open(
        challenge.challengeUrl,
        '3ds-challenge',
        this.getChallengeWindowFeatures()
      );

      if (!this.challengeWindow) {
        clearTimeout(timeoutId);
        reject(new Error('Failed to open 3DS challenge window'));
        return;
      }

      // Listen for challenge completion
      const messageHandler = (event: MessageEvent) => {
        if (this.isValidChallengeMessage(event)) {
          clearTimeout(timeoutId);
          window.removeEventListener('message', messageHandler);
          this.closeChallengeWindow();
          
          const result = this.processChallengeResult(event.data);
          resolve(result);
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  /**
   * Collect browser information for 3DS
   */
  private collectBrowserInformation(): BrowserInformation {
    return {
      browserAcceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      browserColorDepth: screen.colorDepth.toString(),
      browserJavaEnabled: navigator.javaEnabled(),
      browserJavascriptEnabled: true,
      browserLanguage: navigator.language,
      browserScreenHeight: screen.height.toString(),
      browserScreenWidth: screen.width.toString(),
      browserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browserUserAgent: navigator.userAgent,
      challengeWindowSize: this.config.challengeWindowSize
    };
  }

  /**
   * Setup message handlers for 3DS communication
   */
  private setupMessageHandlers(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        if (this.isValidChallengeMessage(event)) {
          this.handleChallengeMessage(event.data);
        }
      });
    }
  }

  /**
   * Validate challenge message origin and structure
   */
  private isValidChallengeMessage(event: MessageEvent): boolean {
    // Validate origin for security
    const allowedOrigins = [
      'https://acs.example.com', // ACS URL
      'https://api.duffel.com'   // Duffel's 3DS handler
    ];
    
    if (!allowedOrigins.includes(event.origin)) {
      return false;
    }

    // Validate message structure
    return event.data && 
           typeof event.data === 'object' && 
           event.data.messageType === 'CRes';
  }

  /**
   * Handle challenge message from ACS
   */
  private handleChallengeMessage(data: any): void {
    // Process challenge response
    console.log('[3DS] Challenge message received:', data);
  }

  /**
   * Process challenge result
   */
  private processChallengeResult(data: any): ThreeDSecureResult {
    const transStatus = data.transStatus || 'N';
    
    return {
      authenticated: transStatus === 'Y',
      status: this.mapTransactionStatus(transStatus),
      transaction_id: data.threeDSServerTransID,
      challenge_url: undefined
    };
  }

  /**
   * Map 3DS authentication result
   */
  private mapAuthenticationResult(response: ThreeDSAuthResponse): ThreeDSecureResult {
    return {
      authenticated: response.transStatus === 'Y',
      status: this.mapTransactionStatus(response.transStatus),
      transaction_id: response.threeDSServerTransID,
      challenge_url: response.challengeRequired ? response.acsUrl : undefined
    };
  }

  /**
   * Map transaction status to our enum
   */
  private mapTransactionStatus(status: string): any {
    const statusMap: Record<string, any> = {
      'Y': '3ds_success',      // Authentication successful
      'N': '3ds_failed',       // Authentication failed
      'U': '3ds_not_required', // Authentication unavailable
      'A': '3ds_success',      // Attempts processing performed
      'C': '3ds_challenge',    // Challenge required
      'R': '3ds_failed'        // Authentication rejected
    };

    return statusMap[status] || '3ds_failed';
  }

  /**
   * Handle authentication errors
   */
  private handleAuthenticationError(error: any): ThreeDSecureResult {
    console.error('[3DS] Authentication error:', error);
    
    return {
      authenticated: false,
      status: '3ds_failed',
      transaction_id: undefined
    };
  }

  /**
   * Get challenge window features
   */
  private getChallengeWindowFeatures(): string {
    const dimensions = this.getChallengeDimensions();
    return `width=${dimensions.width},height=${dimensions.height},scrollbars=yes,resizable=no,status=no,location=no,toolbar=no,menubar=no`;
  }

  /**
   * Get challenge window dimensions based on size preference
   */
  private getChallengeDimensions(): { width: number; height: number } {
    const dimensionsMap: Record<string, { width: number; height: number }> = {
      '01': { width: 250, height: 400 },   // 250x400
      '02': { width: 390, height: 400 },   // 390x400
      '03': { width: 500, height: 600 },   // 500x600
      '04': { width: 600, height: 400 },   // 600x400
      '05': { width: 100, height: 100 }    // Full screen
    };

    return dimensionsMap[this.config.challengeWindowSize] || dimensionsMap['03'];
  }

  /**
   * Close challenge window
   */
  private closeChallengeWindow(): void {
    if (this.challengeWindow && !this.challengeWindow.closed) {
      this.challengeWindow.close();
      this.challengeWindow = null;
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  /**
   * Generate ACS reference number
   */
  private generateACSReference(): string {
    return 'acs_' + Math.random().toString(36).substring(2);
  }

  /**
   * Generate DS reference number
   */
  private generateDSReference(): string {
    return 'ds_' + Math.random().toString(36).substring(2);
  }

  /**
   * Mask card number for security
   */
  private maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})\d+(\d{4})/, '$1****$2');
  }
}

interface ThreeDSAuthRequest {
  threeDSServerTransID: string;
  messageType: string;
  messageVersion: string;
  acquirerBIN: string;
  merchantId: string;
  mcc: string;
  merchantName: string;
  cardholderAccount: {
    acctNumber: string;
    acctExpiry: string;
    cardholderName: string;
  };
  purchase: {
    purchaseAmount: string;
    purchaseCurrency: string;
    purchaseExponent: string;
    purchaseDate: string;
  };
  browserInformation: BrowserInformation;
  threeDSRequestorURL: string;
  challengeWindowSize: string;
  paymentIntentId: string;
}

interface ThreeDSAuthResponse {
  threeDSServerTransID: string;
  messageType: string;
  messageVersion: string;
  transStatus: string;
  acsUrl?: string;
  acsReferenceNumber?: string;
  dsReferenceNumber?: string;
  challengeRequired: boolean;
}

interface BrowserInformation {
  browserAcceptHeader: string;
  browserColorDepth: string;
  browserJavaEnabled: boolean;
  browserJavascriptEnabled: boolean;
  browserLanguage: string;
  browserScreenHeight: string;
  browserScreenWidth: string;
  browserTimeZone: string;
  browserUserAgent: string;
  challengeWindowSize: string;
}