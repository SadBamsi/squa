"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { LOGIN_SCHEMA } from "@/app/login/constants";

export interface LoginState {
  error?: string;
}
/* 
Я надеюсь я правильно понял задачу и то что нам надо было защитить как сам loginAction от изменения полей, так и обеспечить что при отправке формы мы получаем именно те поля, которые описаны в LOGIN_SCHEMA. Поэтому я добавил функцию parseData, которая проверяет наличие всех необходимых полей и их типы, основываясь на LOGIN_SCHEMA. Это позволяет нам быть уверенными, что мы обрабатываем только ожидаемые данные и не столкнемся с проблемами из-за отсутствующих или лишних полей.
Также теперь в самой форме мы используем LOGIN_SCHEMA для определения имен полей, что обеспечивает согласованность между формой и серверной логикой.
*/

const parseData = (
  formData: FormData,
): Record<keyof typeof LOGIN_SCHEMA, string> => {
  const result = {} as Record<keyof typeof LOGIN_SCHEMA, string>;
  for (const key of Object.keys(
    LOGIN_SCHEMA,
  ) as (keyof typeof LOGIN_SCHEMA)[]) {
    const value = formData.get(key);
    if (value === null) {
      throw new Error(`Отсутствует обязательное поле: "${key}"`);
    }
    result[key] = value as string;
  }
  return result;
};

export async function loginAction(_: LoginState | null, formData: FormData) {
  const { username, password } = parseData(formData);

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
