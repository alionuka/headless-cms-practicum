"use client";

import { useState } from "react";

export default function SummaryForm() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    setSummary("");
    setError("");

    try {
      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Something went wrong");
        return;
      }

      setMessage(`Video ID: ${data.videoId} | Title: ${data.title}`);
      setSummary(data.summary || "");
    } catch {
      setError("Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="youtubeUrl"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          YouTube URL
        </label>
        <input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Generating..." : "Generate Summary"}
      </button>

      {summary ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="mb-3 text-xl font-semibold">AI Summary</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {summary}
          </pre>
        </div>
      ) : null}
    </form>
  );
}