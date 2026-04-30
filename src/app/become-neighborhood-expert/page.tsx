"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SERVICES = [
  "Buyer Representation",
  "Seller Representation",
  "Relocation",
  "Investment Properties",
  "New Construction",
  "Luxury Homes",
  "First-Time Buyers",
  "Short Sales / Foreclosures",
];

function ExpertForm() {
  const searchParams = useSearchParams();
  const defaultNeighborhood = searchParams.get("neighborhood") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    brokerage: "",
    license: "",
    website: "",
    photo: "",
    neighborhood: defaultNeighborhood,
    bio: "",
    services: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function toggle(service: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/expert-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Application Received</h2>
        <p className="text-gray-600">Mike will review your application and be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
          <input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
          <input required type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Brokerage *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.brokerage} onChange={(e) => setForm({ ...form, brokerage: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">RE License # *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
          <input type="url" placeholder="https://" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Headshot URL</label>
          <input type="url" placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          <p className="text-xs text-gray-400 mt-1">Link to a professional headshot (Google Drive, Dropbox, etc.)</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Neighborhood *</label>
          <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            placeholder="e.g. Waxhaw Reserve"
            value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Why are you the expert for this neighborhood? *
        </label>
        <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          placeholder="Share your experience in this neighborhood — sales history, local knowledge, how long you've worked this area, etc."
          value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Services You Offer</label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.services.includes(s)
                  ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#1e3a5f]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again or email mike@mikewenger.us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

export default function BecomeNeighborhoodExpertPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Become a Neighborhood Expert</h1>
      <p className="text-gray-600 mb-8">
        Get featured as the go-to agent for a specific Union County neighborhood. Your profile, services,
        and client reviews will appear on that neighborhood's page — putting you in front of buyers
        actively researching the area.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <h2 className="font-bold text-[#1e3a5f] mb-2">What you get</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✓ Featured profile with photo, bio, and contact info on the neighborhood page</li>
          <li>✓ Services showcase visible to every buyer researching that neighborhood</li>
          <li>✓ Client reviews from your sales in that neighborhood</li>
          <li>✓ Direct link to your website</li>
        </ul>
      </div>

      <Suspense>
        <ExpertForm />
      </Suspense>
    </div>
  );
}
