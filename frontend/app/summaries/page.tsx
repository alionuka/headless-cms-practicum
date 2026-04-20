import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SummaryForm from "./SummaryForm";
import Link from "next/link";

const STRAPI_URL = "http://127.0.0.1:1337";
const PAGE_SIZE = 3;

async function getSummaries(jwt: string, query: string, page: number) {
  const params = new URLSearchParams();

  if (query) {
    params.set("filters[title][$containsi]", query);
  }

  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(PAGE_SIZE));

  const res = await fetch(`${STRAPI_URL}/api/summaries?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("SUMMARIES FETCH ERROR:", data);
    return {
      items: [],
      page: 1,
      pageCount: 1,
      total: 0,
    };
  }

  return {
    items: data?.data || [],
    page: data?.meta?.pagination?.page || 1,
    pageCount: data?.meta?.pagination?.pageCount || 1,
    total: data?.meta?.pagination?.total || 0,
  };
}

function buildPageLink(q: string, page: number) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  params.set("page", String(page));

  return `/summaries?${params.toString()}`;
}

export default async function SummariesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;

  if (!jwt) {
    redirect("/signin");
  }

  const result = await getSummaries(jwt, q, currentPage);
  const summaries = result.items;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-3 text-3xl font-bold">Video Summaries</h1>
          <p className="text-gray-600">
            Generate and manage saved AI summaries.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <SummaryForm />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Search summaries</h2>

          <form action="/summaries" method="get" className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by title..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
            <button
              type="submit"
              className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Saved summaries</h2>
              <p className="text-sm text-gray-500">
                Total: {result.total} | Page {result.page} of {result.pageCount}
              </p>
            </div>
          </div>

          {summaries.length === 0 ? (
            <p className="text-sm text-gray-500">No summaries found.</p>
          ) : (
            <div className="grid gap-6">
              {summaries.map((item: any) => (
                <article
                  key={item.id}
                  className="rounded-2xl border p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-xl font-semibold">
                    {item.title || "Untitled"}
                  </h3>

                  <p className="mb-2 text-sm text-gray-500">
                    Video ID: {item.videoId || "No video ID"}
                  </p>

                  <p className="mb-4 line-clamp-4 whitespace-pre-wrap text-sm text-gray-700">
                    {item.content || "No summary content"}
                  </p>

                  <Link
                    href={`/summaries/${item.documentId}`}
                    className="inline-block text-sm font-medium text-black underline"
                  >
                    Open summary
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            {result.page > 1 ? (
              <Link
                href={buildPageLink(q, result.page - 1)}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-xl border px-4 py-2 text-sm text-gray-400">
                Previous
              </span>
            )}

            <span className="text-sm text-gray-600">
              Page {result.page} of {result.pageCount}
            </span>

            {result.page < result.pageCount ? (
              <Link
                href={buildPageLink(q, result.page + 1)}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-xl border px-4 py-2 text-sm text-gray-400">
                Next
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}