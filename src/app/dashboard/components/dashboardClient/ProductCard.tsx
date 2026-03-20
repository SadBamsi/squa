"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import styles from "./dashboardClient.styles.module.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => onAddToCart(product.id));
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={200}
          height={200}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDesc}>{product.description}</p>

        <div className={styles.productFooter}>
          <span className={styles.productPrice}>${product.price}</span>
          <Button
            variant="secondary"
            onClick={handleAddToCart}
            isLoading={isPending}
            disabled={isPending}
          >
            <Plus size={16} /> В корзину
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
