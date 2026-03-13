import { Suspense } from "react";
import { apiFetch, getUser } from "@/lib/api";
import DashboardClient from "./components/dashboardClient";
import styles from "./dashboard.module.css";
import { Product, PaginatedResponse, Cart, User } from "@/types";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      <h1 className={styles.sectionTitle}>Магазин товаров</h1>

      <Suspense
        fallback={
          <div className="loader" style={{ margin: "2rem auto" }}></div>
        }
      >
        <DashboardDataLoader user={user} />
      </Suspense>
    </div>
  );
}

async function DashboardDataLoader({ user }: { user: User }) {
  const [productsRes, cartsRes] = await Promise.all([
    apiFetch<PaginatedResponse<Product>>("/auth/products?skip=0&limit=5"),
    apiFetch<PaginatedResponse<Cart>>(`/auth/carts/user/${user.id}`),
  ]);

  const initialProducts = productsRes.products || [];
  const initialCart =
    cartsRes.carts && cartsRes.carts.length > 0 ? cartsRes.carts[0] : null;

  return (
    <DashboardClient
      userId={user.id}
      initialProducts={initialProducts}
      initialTotal={productsRes.total || 0}
      initialCart={initialCart}
    />
  );
}
