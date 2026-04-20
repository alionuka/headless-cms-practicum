"use client";

import { useActionState } from "react";
import { uploadFileAction } from "./actions";

const initialState = {
  error: "",
  success: "",
  fileUrl: "",
};

export default function UploadForm() {
  const [state, formAction, pending] = useActionState(
    uploadFileAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="file"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Choose file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
        />
      </div>

      {state?.error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Uploading..." : "Upload"}
      </button>

      {state?.fileUrl ? (
        <div className="pt-4">
          <p className="mb-2 text-sm text-gray-600">Uploaded file preview:</p>
          <img
            src={state.fileUrl}
            alt="Uploaded preview"
            className="max-h-80 rounded-xl border shadow-sm"
          />
        </div>
      ) : null}
    </form>
  );
}