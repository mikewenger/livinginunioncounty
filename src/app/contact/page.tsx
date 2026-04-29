"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactForm() {
  const params = useSearchParams();
  const neighborhood = params.get("neighborhood") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhood,
    message: "",
    type: "general",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Message Sent!</h2>
        <p className="text-gray-600">
          Thanks! Mike will get back to you at <strong>{form.email}</strong> shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">I&apos;m interested in...</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General Information</option>
            <option value="neighborhood">Specific Neighborhood</option>
            <option value="homes">Finding a Home to Buy</option>
            <option value="schools">School Information</option>
            <option value="relocation">Relocation Assistance</option>
          </select>
        </div>
      </div>

      {(form.type === "neighborhood" || neighborhood) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhood (if applicable)</label>
          <input
            type="text"
            value={form.neighborhood}
            onChange={(e) => set("neighborhood", e.target.value)}
            placeholder="e.g. Millbridge, Weddington, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell Mike what you're looking for, your timeline, budget, must-haves..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">Something went wrong. Please email mike@mikewenger.us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto px-8 py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] disabled:opacity-50 transition-colors"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Contact Mike Wenger</h1>
      <p className="text-gray-600 mb-8">
        Have questions about moving to Union County? Mike can help with neighborhoods, schools,
        homes for sale, and everything else about relocating to the area.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: "✉️", label: "Email", value: "mike@mikewenger.us", href: "mailto:mike@mikewenger.us" },
          { icon: "🌐", label: "Website", value: "waxhawrealty.com", href: "https://waxhawrealty.com" },
        ].map(({ icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <span className="text-xs text-gray-500 block">{label}</span>
              <span className="font-semibold text-[#1e3a5f] text-sm">{value}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">Send a Message</h2>
        <Suspense>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
