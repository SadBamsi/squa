import { decodeJwt } from "jose";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Map to store active refresh promises keyed by refreshToken to ensure session isolation.
const refreshLocks = new Map<string, Promise<RefreshResponse | null>>();
const AUTH_URL = 'https://dummyjson.com';

/**
 * Validates whether a token exists and is not expired.
 */
export function isTokenExpired(tokenStr: string): boolean {
  try {
    const payload = decodeJwt(tokenStr);
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + 15;
  } catch {
    return true;
  }
}

/**
 * Performs a refresh with session isolation using a keyed Promise Lock.
 */
export async function executeRefresh(refreshToken?: string): Promise<RefreshResponse | null> {
  if (!refreshToken) return null;

  const existingLock = refreshLocks.get(refreshToken);
  if (existingLock) return existingLock;

  const promise = (async () => {
    try {
      const res = await fetch(`${AUTH_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (err) {
      return null;
    } finally {
      refreshLocks.delete(refreshToken);
    }
  })();

  refreshLocks.set(refreshToken, promise);
  return promise;
}
