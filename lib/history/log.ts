import { storage } from '@/lib/storage';
import { LogMap } from '@/types/log';

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function loadLog(): Promise<LogMap> {
  const value = await storage.get<string | LogMap>('outfit-log');
  if (!value) return {};
  try {
    return typeof value === 'string' ? JSON.parse(value) as LogMap : value;
  } catch {
    return {};
  }
}

export async function saveLog(log: LogMap): Promise<void> {
  await storage.set('outfit-log', JSON.stringify(log));
}

export function daysSinceWorn(log: LogMap, id: string): number {
  const dates = Object.keys(log).filter((date) => log[date]?.includes(id)).sort();
  if (!dates.length) return 9999;
  const last = new Date(`${dates[dates.length - 1]}T00:00:00`);
  const today = new Date(`${todayStr()}T00:00:00`);
  return Math.max(0, Math.floor((today.getTime() - last.getTime()) / 86400000));
}

export function wornThisWeekIds(log: LogMap): Set<string> {
  const ids = new Set<string>();
  const today = new Date(`${todayStr()}T00:00:00`);
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    for (const id of log[key] ?? []) ids.add(id);
  }
  return ids;
}
