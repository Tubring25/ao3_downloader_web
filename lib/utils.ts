import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { D1Database } from '@cloudflare/workers-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

export interface Env {
  DB: D1Database
}

export interface PagedResult<T> {
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}

export async function getPaginatedData<T>(
  fetcher: () => Promise<T[]>,
  countFetcher: () => Promise<number>,
  page = 1,
  pageSize = 10
): Promise<PagedResult<T>> {
  const [data, total] = await Promise.all([fetcher(), countFetcher()]);
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}