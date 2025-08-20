export interface SingleResponse<T> {
  data: T | null;
  meta?: {
    status: number;
    statusMessage: string;
  };
}
