import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { executeRefresh } from "./auth";

const API_BASE = "https://dummyjson.com";

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

async function doFetch(
  endpoint: string,
  token: string | undefined,
  options: RequestInit,
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await doFetch(endpoint, token, options);

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const refreshed = await executeRefresh(refreshToken);

    if (!refreshed) {
      redirect("/login");
    }

    try {
      cookieStore.set(
        "accessToken",
        refreshed.accessToken,
        TOKEN_COOKIE_OPTIONS,
      );
      cookieStore.set(
        "refreshToken",
        refreshed.refreshToken,
        TOKEN_COOKIE_OPTIONS,
      );
    } catch {}

    const retryRes = await doFetch(endpoint, refreshed.accessToken, options);

    if (!retryRes.ok) {
      const errObj = await retryRes.json().catch(() => ({}));
      throw new Error(errObj.message || `API Error: ${retryRes.status}`);
    }

    return retryRes.json() as Promise<T>;
  }

  if (!res.ok) {
    const errObj = await res.json().catch(() => ({}));
    throw new Error(errObj.message || `API Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const getUser = cache(() => apiFetch<User>("/auth/me"));
