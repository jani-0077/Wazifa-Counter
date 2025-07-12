export interface Session {
  id: string;
  name: string;
  count: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummary {
  id: string;
  name: string;
  count: number;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
}