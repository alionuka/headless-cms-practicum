import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UploadForm from "./UploadForm";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

async function getUploadedFiles(jwt: string) {
  const res = await fetch(`${STRAPI_URL}/api/upload/files`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("FILES FETCH ERROR:", data);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    redirect("/signin");
  }

  const files = await getUploadedFiles(jwt);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            You are signed in successfully. Protected page works correctly.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">Upload a file</h2>
          <p className="mb-6 text-sm text-gray-600">
            Upload your file to Strapi Media Library using a server action.
          </p>

          <UploadForm />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Uploaded files</h2>

          {files.length === 0 ? (
            <p className="text-sm text-gray-500">No uploaded files yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {files.map((file: any) => {
                const fileUrl = file.url ? `${STRAPI_URL}${file.url}` : "";
                const isImage = file.mime?.startsWith("image/");

                return (
                  <div
                    key={file.id}
                    className="overflow-hidden rounded-2xl border bg-white"
                  >
                    {isImage && fileUrl ? (
                      <img
                        src={fileUrl}
                        alt={file.name || "uploaded file"}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-gray-100 text-sm text-gray-500">
                        No preview available
                      </div>
                    )}

                    <div className="space-y-2 p-4">
                      <h3 className="font-semibold break-all">{file.name}</h3>
                      <p className="text-sm text-gray-500">{file.mime}</p>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-sm font-medium text-black underline"
                      >
                        Open file
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}