import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteSummaryAction } from "./actions";

const STRAPI_URL = "http://127.0.0.1:1337";

async function getSummary(documentId: string, jwt: string) {
  const res = await fetch(`${STRAPI_URL}/api/summaries/${documentId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("SUMMARY FETCH ERROR:", data);
    return null;
  }

  return data?.data || null;
}

export default async function SummaryDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    redirect("/signin");
  }

  const summary = await getSummary(documentId, jwt);

  if (!summary) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Summary not found</h1>
          <Link href="/summaries" className="text-black underline">
            Back to summaries
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <Link href="/summaries" className="mb-4 inline-block text-sm underline">
            ← Back to summaries
          </Link>

          <h1 className="mb-3 text-3xl font-bold">
            {summary.title || "Untitled"}
          </h1>

          <p className="mb-6 text-sm text-gray-500">
            Video ID: {summary.videoId || "No video ID"}
          </p>

          <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {summary.content || "No summary content"}
          </div>
          <form
  action={async () => {
    "use server";
    await deleteSummaryAction(documentId);
  }}
  className="mt-8"
>
  <button
    type="submit"
    className="rounded-xl bg-red-600 px-4 py-3 text-white transition hover:opacity-90"
  >
    Delete summary
  </button>
</form>
        </div>
      </div>
    </main>
  );
}