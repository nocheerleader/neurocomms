// Error types for better categorization
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  PERMISSION = 'permission',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

export interface AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  userMessage: string;
  originalError?: Error;
  context?: Record<string, any>;
}

// Create a custom error class
export class CustomError extends Error implements AppError {
  type: ErrorType;
  statusCode?: number;
  userMessage: string;
  originalError?: Error;
  context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    userMessage?: string,
    statusCode?: number,
    originalError?: Error,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
    this.userMessage = userMessage || this.getDefaultUserMessage(type);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.context = context;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Unable to connect to our servers. Please check your internet connection and try again.';
      case ErrorType.AUTH:
        return 'You need to sign in to continue using this feature.';
      case ErrorType.VALIDATION:
        return 'The information provided is not valid. Please check your input and try again.';
      case ErrorType.RATE_LIMIT:
        return 'You are making requests too quickly. Please wait a moment and try again.';
      case ErrorType.PERMISSION:
        return 'You do not have permission to perform this action.';
      case ErrorType.SERVER:
        return 'Our servers are experiencing issues. Please try again in a few minutes.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

// Error handling utilities
export function handleApiError(error: any, context?: Record<string, any>): CustomError {
  // Handle fetch errors (network issues)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new CustomError(
      'Network request failed',
      ErrorType.NETWORK,
      'Unable to connect to our servers. Please check your internet connection and try again.',
      undefined,
      error,
      context
    );
  }

  // Handle AbortError (timeouts)
  if (error.name === 'AbortError') {
    return new CustomError(
      'Request timeout',
      ErrorType.NETWORK,
      'The request took too long to complete. Please try again.',
      408,
      error,
      context
    );
  }

  // Handle errors with status codes
  if (error.statusCode || error.status) {
    const statusCode = error.statusCode || error.status;
    
    switch (statusCode) {
      case 401:
        return new CustomError(
          'Unauthorized',
          ErrorType.AUTH,
          'Your session has expired. Please sign in again.',
          401,
          error,
          context
        );
      case 403:
        return new CustomError(
          'Forbidden',
          ErrorType.PERMISSION,
          'You do not have permission to perform this action.',
          403,
          error,
          context
        );
      case 429:
        return new CustomError(
          'Rate limit exceeded',
          ErrorType.RATE_LIMIT,
          'You are making requests too quickly. Please wait a moment and try again.',
          429,
          error,
          context
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return new CustomError(
          'Server error',
          ErrorType.SERVER,
          'Our servers are experiencing issues. Please try again in a few minutes.',
          statusCode,
          error,
          context
        );
      default:
        return new CustomError(
          error.message || 'Unknown error',
          ErrorType.UNKNOWN,
          'An unexpected error occurred. Please try again.',
          statusCode,
          error,
          context
        );
    }
  }

  // Handle custom error messages
  if (error.message) {
    // Check for specific error patterns
    if (error.message.includes('usage limit') || error.message.includes('limit exceeded')) {
      return new CustomError(
        error.message,
        ErrorType.RATE_LIMIT,
        'You have reached your usage limit. Please upgrade your plan or try again later.',
        429,
        error,
        context
      );
    }

    if (error.message.includes('content moderation') || error.message.includes('inappropriate')) {
      return new CustomError(
        error.message,
        ErrorType.VALIDATION,
        'The content contains inappropriate language and cannot be processed. Please modify your text and try again.',
        400,
        error,
        context
      );
    }

    if (error.message.includes('timeout')) {
      return new CustomError(
        error.message,
        ErrorType.NETWORK,
        'The request took too long to complete. Please try again.',
        408,
        error,
        context
      );
    }

    if (error.message.includes('Premium') || error.message.includes('subscription')) {
      return new CustomError(
        error.message,
        ErrorType.PERMISSION,
        'This feature requires a Premium subscription. Please upgrade to continue.',
        403,
        error,
        context
      );
    }
  }

  // Default error
  return new CustomError(
    error.message || 'Unknown error occurred',
    ErrorType.UNKNOWN,
    undefined,
    undefined,
    error,
    context
  );
}

// Retry logic for network requests
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain error types
      if (error instanceof CustomError) {
        if ([ErrorType.AUTH, ErrorType.PERMISSION, ErrorType.VALIDATION].includes(error.type)) {
          throw error;
        }
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying (with exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// Log errors (could be extended to send to external service)
export function logError(error: AppError, context?: Record<string, any>) {
  const errorData = {
    message: error.message,
    type: error.type,
    statusCode: error.statusCode,
    userMessage: error.userMessage,
    context: { ...error.context, ...context },
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  console.error('Application Error:', errorData);

  // Here you could send to an external error tracking service
  // sendToErrorService(errorData);
}