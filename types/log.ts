export type LogMap = Record<string, string[]>;

export interface LogEntry {
  date: string;
  garmentIds: string[];
}
