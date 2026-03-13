"use server";

import { apiFetch } from "@/lib/api";
import { Product, PaginatedResponse, Cart } from "@/types";

// Next.js redirect() throws an error with a `digest` property — re-throw it so the redirect works
function isNextInternalError(err: unknown): boolean {
  return err instanceof Error && "digest" in err;
}

export async function fetchProductsAction(skip: number = 0, limit: number = 5) {
  try {
    const data = await apiFetch<PaginatedResponse<Product>>(
      `/auth/products?skip=${skip}&limit=${limit}`,
    );
    return {
      success: true,
      products: data.products || [],
      total: data.total || 0,
    };
  } catch (err: unknown) {
    if (isNextInternalError(err)) throw err;
    const message =
      err instanceof Error ? err.message : "Ошибка загрузки товаров";
    return { success: false, error: message, total: 0 };
  }
}

export async function addToCartAction(userId: number, productId: number) {
  try {
    const data = await apiFetch<Cart>("/auth/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        products: [{ id: productId, quantity: 1 }],
      }),
    });
    return { success: true, cart: data };
  } catch (err: unknown) {
    if (isNextInternalError(err)) throw err;
    const message =
      err instanceof Error ? err.message : "Ошибка при добавлении в корзину";
    return { success: false, error: message };
  }
}
