"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../../actions";
import { Button } from "@/components/ui/button";
import styles from "./loginForm.styles.module.css";
import { LOGIN_SCHEMA } from "../../constants";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    LoginState | null,
    FormData
  >(loginAction, null);

  return (
    <form action={formAction} className={styles.loginForm}>
      <div className={styles.formGroup}>
        <label htmlFor="username">Email / Имя пользователя</label>
        <input
          id="username"
          name={LOGIN_SCHEMA.username}
          type="text"
          placeholder="e.g. emilys"
          required
          autoComplete="username"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          name={LOGIN_SCHEMA.password}
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      <div aria-live="polite" className={styles.errorContainer}>
        {state?.error && <p className={styles.errorText}>{state.error}</p>}
      </div>

      <Button type="submit" isLoading={isPending} fullWidth variant="primary">
        Войти
      </Button>
    </form>
  );
}
