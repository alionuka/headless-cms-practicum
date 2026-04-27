"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export async function deleteSummaryAction(documentId: string) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    redirect("/signin");
  }

  const res = await fetch(`${STRAPI_URL}/api/summaries/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  console.log("DELETE SUMMARY RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to delete summary");
  }

  redirect("/summaries");
}