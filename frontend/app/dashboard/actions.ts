"use server";

import { cookies } from "next/headers";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://127.0.0.1:1337";

export async function uploadFileAction(
  prevState: { error: string; success: string; fileUrl?: string },
  formData: FormData
) {
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return {
      error: "Please choose a file.",
      success: "",
      fileUrl: "",
    };
  }

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    return {
      error: "Not authenticated",
      success: "",
      fileUrl: "",
    };
  }

  const uploadData = new FormData();
  uploadData.append("files", file);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: uploadData,
  });

  const data = await res.json();

  console.log("UPLOAD RESPONSE:", data);

  if (!res.ok) {
    return {
      error: data?.error?.message || "Upload failed",
      success: "",
      fileUrl: "",
    };
  }

  const uploadedFile = Array.isArray(data) ? data[0] : null;

  return {
    error: "",
    success: uploadedFile
      ? `File "${uploadedFile.name}" uploaded to Strapi`
      : "File uploaded to Strapi",
    fileUrl: uploadedFile?.url ? `${STRAPI_URL}${uploadedFile.url}` : "",
  };
}