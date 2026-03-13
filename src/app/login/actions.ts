"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  prevState: LoginState | null,
  formData: FormData,
) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Пожалуйста, введите имя пользователя и пароль" };
  }

  try {
    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.message || "Неверный логин или пароль" };
    }

    const data: User = await res.json();
    // Store tokens using Next.js cookies API
    const cookieStore = await cookies();
    cookieStore.set("accessToken", data.accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    cookieStore.set("refreshToken", data.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    return {
      error: "Произошла ошибка при подключении к серверу. Попробуйте снова.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect("/login");
}
