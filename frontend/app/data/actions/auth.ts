"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://127.0.0.1:1337";

export type AuthState = {
  error?: string;
};

export async function registerUserAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const payload = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("Strapi register response:", data);

  if (!res.ok) {
    return {
      error: data?.error?.message || "Registration failed",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}

export async function loginUserAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const payload = {
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  };

  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("Strapi login response:", data);

  if (!res.ok) {
    return {
      error: data?.error?.message || "Login failed",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", data.jwt, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}