"use client";

import Image from "next/image";
import { useState, useOptimistic, useActionState, useTransition } from "react";
import { fetchProductsAction, addToCartAction } from "../../actions";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./dashboardClient.styles.module.css";
import { Product, Cart, CartProduct } from "@/types";

interface DashboardClientProps {
  userId: number;
  initialProducts: Product[];
  initialTotal: number;
  initialCart: Cart | null;
}

export default function DashboardClient({
  userId,
  initialProducts,
  initialTotal,
  initialCart,
}: DashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [skip, setSkip] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const [toasts, setToasts] = useState<
    { id: number; msg: string; type: "error" | "success" }[]
  >([]);

  const addToast = (msg: string, type: "error" | "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const [cartState, cartAction] = useActionState<Cart | null, number>(
    async (prevState, productId) => {
      const res = await addToCartAction(userId, productId);
      if (res.success && res.cart) {
        addToast("Товар успешно добавлен!", "success");

        if (!prevState) return res.cart;

        const existingProductIndex = prevState.products.findIndex(
          (p) => p.id === productId,
        );
        const newProducts = [...prevState.products];

        if (existingProductIndex > -1) {
          newProducts[existingProductIndex] = {
            ...newProducts[existingProductIndex],
            quantity: newProducts[existingProductIndex].quantity + 1,
          };
        } else {
          const productInfo = products.find((p) => p.id === productId);
          if (productInfo) {
            newProducts.push({
              id: productId,
              title: productInfo.title,
              price: productInfo.price,
              quantity: 1,
              total: productInfo.price,
              discountPercentage: productInfo.discountPercentage,
              discountedTotal:
                productInfo.price * (1 - productInfo.discountPercentage / 100),
              thumbnail: productInfo.thumbnail,
            });
          }
        }

        return {
          ...prevState,
          products: newProducts,
          totalQuantity: prevState.totalQuantity + 1,
        };
      } else {
        addToast(res.error || "Не удалось добавить товар", "error");
        return prevState;
      }
    },
    initialCart,
  );

  const calculateTotalItems = (cart: Cart | null) => {
    if (!cart?.products) return 0;
    return cart.products.reduce(
      (acc: number, p: CartProduct) => acc + p.quantity,
      0,
    );
  };

  const [optimisticCart, addOptimisticProduct] = useOptimistic(
    cartState,
    (state, productId: number) => {
      if (!state) return state;

      const existingProductIndex = state.products.findIndex(
        (p) => p.id === productId,
      );
      const newProducts = [...state.products];

      if (existingProductIndex > -1) {
        newProducts[existingProductIndex] = {
          ...newProducts[existingProductIndex],
          quantity: newProducts[existingProductIndex].quantity + 1,
        };
      } else {
        newProducts.push({
          id: productId,
          title: "Загрузка...",
          quantity: 1,
          price: 0,
          total: 0,
          discountPercentage: 0,
          discountedTotal: 0,
          thumbnail: "",
        });
      }

      return {
        ...state,
        products: newProducts,
        totalQuantity: state.totalQuantity + 1,
      };
    },
  );

  const totalItemsCount = calculateTotalItems(optimisticCart);

  const [isPending, startTransition] = useTransition();

  const handleLoadMore = async () => {
    if (total > 0 && products.length >= total) return;

    setLoadingMore(true);
    const res = await fetchProductsAction(skip, 5);
    if (res.success && res.products) {
      setProducts((prev) => [...prev, ...res.products]);
      setSkip((prev) => prev + 5);
      if (res.total) setTotal(res.total);
    } else {
      addToast(res.error || "Ошибка загрузки", "error");
    }
    setLoadingMore(false);
  };

  const handleAddToCart = (productId: number) => {
    startTransition(() => {
      addOptimisticProduct(productId);
      cartAction(productId);
    });
  };

  const hasMore = total === 0 || products.length < total;

  return (
    <>
      <div className={styles.dashboardMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <ShoppingCart size={24} color="#6a11cb" />
            <span>Товаров в корзине</span>
          </div>
          <div className={styles.metricValue}>{totalItemsCount}</div>
        </div>
      </div>

      <div className={styles.productsGrid}>
        {products.map((p: Product) => (
          <div className={styles.productCard} key={p.id}>
            <div className={styles.productImage}>
              <Image src={p.thumbnail} alt={p.title} width={200} height={200} />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{p.title}</h3>
              <p className={styles.productDesc}>{p.description}</p>

              <div className={styles.productFooter}>
                <span className={styles.productPrice}>${p.price}</span>
                <Button
                  variant="secondary"
                  onClick={() => handleAddToCart(p.id)}
                  isLoading={isPending}
                >
                  <Plus size={16} /> В корзину
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.loadMoreContainer}>
        {hasMore && (
          <Button
            variant="outline"
            onClick={handleLoadMore}
            isLoading={loadingMore}
            fullWidth
          >
            Загрузить ещё
          </Button>
        )}
      </div>

      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.type === "error" ? styles.toastError : styles.toastSuccess}`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
