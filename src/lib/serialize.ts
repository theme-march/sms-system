import { Prisma } from '@prisma/client';

/**
 * Converts values returned by Prisma into data supported by React Server
 * Actions. Dates are supported by React and are intentionally preserved.
 */
export function toClientData<T>(value: T): T {
  if (value === null || value === undefined) return value;

  if (Prisma.Decimal.isDecimal(value)) {
    return Number(value) as T;
  }

  if (typeof value === 'bigint') {
    return Number(value) as T;
  }

  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map((item) => toClientData(item)) as T;
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, toClientData(item)]),
    ) as T;
  }

  return value;
}
