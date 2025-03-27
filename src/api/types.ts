export interface ApiResponse<T = any> {
  result: boolean;
  data: T;
  error?: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
}

export interface ChatResponse {
  Response: string | null;
  Error: string | null;
}

export interface CharacterNamesResponse {
  data: string[];
} 