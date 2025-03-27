export interface AIResponse {
  result: boolean;
  data: {
    Response: string | null;
    Error: string | null;
  };
}

export interface CharacterNames {
  data: string[];
}

export interface LocationInput {
  label: string;
  value: string;
}

export interface MainProps {
  className?: string;
} 