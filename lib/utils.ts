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

export function getAuthorLink(author: string) {
  return `https://archiveofourown.org/users/${author}/pseuds/${author}`;
}