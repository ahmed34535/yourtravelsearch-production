// Centralized Error Service following SOLID principles
// Single Responsibility: Handles all error logging, reporting, and user feedback

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  component?: string;
  action?: string;
}

interface ErrorData {
  message: string;
  stack?: string;
  code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: ErrorContext;
}

export class ErrorService {
  private static instance: ErrorService;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private constructor() {}

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  // Log errors with proper context and severity assessment
  async logError(error: Error | string, context?: Partial<ErrorContext>): Promise<void> {
    const errorData = this.createErrorData(error, context);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Service:', errorData);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      await this.sendToMonitoringService(errorData);
    }
  }

  // Handle API errors with retry logic
  async handleApiError<T>(error: Error, retryFn?: () => Promise<T>): Promise<T> {
    await this.logError(error, { 
      component: 'API',
    });

    // Attempt retry for network errors
    if (retryFn && this.isRetryableError(error)) {
      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
        try {
          await this.delay(this.retryDelay * attempt);
          return await retryFn();
        } catch (retryError) {
          if (attempt === this.maxRetries) {
            await this.logError(retryError as Error, {
              component: 'API_RETRY',
            });
          }
        }
      }
    }

    throw this.createUserFriendlyError(error);
  }

  // Create user-friendly error messages
  createUserFriendlyError(error: Error): Error {
    const userMessage = this.getUserFriendlyMessage(error);
    const userError = new Error(userMessage);
    userError.name = 'UserFriendlyError';
    return userError;
  }

  private createErrorData(error: Error | string, context?: Partial<ErrorContext>): ErrorData {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    return {
      message: errorMessage,
      stack: errorStack,
      severity: this.assessSeverity(errorMessage),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...context,
      },
    };
  }

  private assessSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return 'medium';
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('booking')) {
      return 'critical';
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('form')) {
      return 'low';
    }
    
    return 'medium';
  }

  private getUserFriendlyMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch failed')) {
      return 'Please check your internet connection and try again.';
    }
    if (message.includes('timeout')) {
      return 'The request is taking longer than expected. Please try again.';
    }
    if (message.includes('unauthorized') || message.includes('403')) {
      return 'You don\'t have permission to perform this action.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource could not be found.';
    }
    if (message.includes('validation')) {
      return 'Please check your input and try again.';
    }
    
    return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('timeout') || 
           message.includes('503') || 
           message.includes('502');
  }

  private async sendToMonitoringService(errorData: ErrorData): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring service:', monitoringError);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const errorService = ErrorService.getInstance();

// Enhanced fetch wrapper with error handling
export async function apiRequestWithErrorHandling<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    return errorService.handleApiError(
      error as Error,
      () => fetch(url, options).then(res => res.json())
    );
  }
}