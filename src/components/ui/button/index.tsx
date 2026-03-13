import React from "react";
import styles from "./button.styles.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  className = "",
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const cn = [
    styles.btn,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cn} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className={styles.loader} /> : children}
    </button>
  );
}
