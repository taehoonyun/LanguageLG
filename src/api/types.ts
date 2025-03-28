export interface ApiResponse<T> {
  result: boolean;
  data: T;
}

export interface LoginResponse {
  userId: string;
  token: string;
}

export interface ChatResponse {
  Response: string;
  Error: string;
}

export interface ResetHistoryResponse {
  success: boolean;
  message?: string;
}

export interface CharacterDetails {
  name: string;
  personality: string;
  promptPrefix: string;
}

export interface CharacterNamesResponse {
  result: boolean;
  data: string[];
}

export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  API = 'API_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR'
}

interface ErrorResponse {
  type: ErrorType;
  message: string;
  status: number;
  timestamp: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    private readonly _type: ErrorType,
    private readonly _status: number,
    message: string,
    private readonly _timestamp: string = new Date().toISOString(),
    private readonly _details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, ApiError);
  }

  get type(): ErrorType {
    return this._type;
  }

  get status(): number {
    return this._status;
  }

  get timestamp(): string {
    return this._timestamp;
  }

  get details(): unknown | undefined {
    return this._details;
  }

  toJSON(): ErrorResponse {
    return {
      type: this.type,
      message: this.message,
      status: this.status,
      timestamp: this.timestamp,
      details: this.details
    };
  }
}

export const getErrorType = (status: number): ErrorType => {
  switch (true) {
    case status === 400:
      return ErrorType.VALIDATION;
    case status === 401:
      return ErrorType.UNAUTHORIZED;
    case status === 404:
      return ErrorType.NOT_FOUND;
    case status >= 500:
      return ErrorType.SERVER;
    default:
      return ErrorType.API;
  }
};

export const getDefaultErrorMessage = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.VALIDATION:
      return 'Invalid request parameters';
    case ErrorType.UNAUTHORIZED:
      return 'Unauthorized access';
    case ErrorType.NOT_FOUND:
      return 'Requested resource not found';
    case ErrorType.SERVER:
      return 'Internal server error occurred';
    case ErrorType.NETWORK:
      return 'Network error';
    default:
      return 'An unexpected error occurred';
  }
};

try {
  // API 호출
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.type) {
      case ErrorType.UNAUTHORIZED:
        // 인증 관련 처리
        break;
      case ErrorType.NETWORK:
        // 네트워크 에러 처리
        break;
      // ...
    }
  }
} 