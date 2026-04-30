"use client";
import { useState } from "react";

interface NeighborhoodOption {
  id: string;
  name: string;
  city: string | null;
}

export default function AdminUploadForm({ neighborhoods }: { neighborhoods: NeighborhoodOption[] }) {
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !file) return;
    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/upload-neighborhood-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setStatus("done");
      setMessage(`Saved! The image for "${neighborhoods.find(n => n.id === slug)?.name}" will appear after the next deploy.`);
      setFile(null);
      setPreview(null);
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Neighborhood</label>
        <select
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
        >
          <option value="">— Select a neighborhood —</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}{n.city ? ` (${n.city})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
        <input
          type="file"
          required
          accept="image/*"
          onChange={onFileChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1e3a5f] file:text-white hover:file:bg-[#163f6e] cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">JPG or PNG, landscape orientation (1200×400px or wider recommended)</p>
      </div>

      {preview && (
        <div className="rounded-xl overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
        </div>
      )}

      {message && (
        <p className={`text-sm font-medium ${status === "done" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "uploading" || !slug || !file}
        className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "uploading" ? "Uploading…" : "Upload & Save"}
      </button>
    </form>
  );
}
