import { getContractors } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Contractors",
  description: "Trusted contractors and service providers in Union County, NC.",
};

export default function ContractorsPage() {
  const contractors = getContractors();

  const byService = contractors.reduce<Record<string, typeof contractors>>((acc, c) => {
    const svc = c.service ?? "General";
    if (!acc[svc]) acc[svc] = [];
    acc[svc].push(c);
    return acc;
  }, {});

  const services = Object.keys(byService).sort();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Local Contractors</h1>
      <p className="text-gray-600 mb-10">
        Trusted service providers in and around Union County, NC to help you get settled in your new home.
      </p>

      {services.map((svc) => (
        <div key={svc} className="mb-10">
          <h2 className="text-xl font-bold text-[#1e3a5f] border-b border-gray-200 pb-2 mb-4">
            {svc}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {byService[svc].map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-1">{c.company}</h3>
                {c.contact && <p className="text-gray-500 text-sm">{c.contact}</p>}
                <div className="mt-2 space-y-1 text-sm">
                  {c.phone && (
                    <p>
                      <span className="text-gray-400">📞 </span>
                      <a href={`tel:${c.phone.replace(/\D/g, "")}`} className="text-[#1e3a5f] hover:underline">
                        {c.phone}
                      </a>
                    </p>
                  )}
                  {c.email && (
                    <p>
                      <span className="text-gray-400">✉️ </span>
                      <a href={`mailto:${c.email}`} className="text-[#1e3a5f] hover:underline">
                        {c.email}
                      </a>
                    </p>
                  )}
                  {c.website && c.website !== "nan" && (
                    <p>
                      <span className="text-gray-400">🌐 </span>
                      <a
                        href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1e3a5f] hover:underline"
                      >
                        {c.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-10 bg-blue-50 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">Know a Great Contractor?</h2>
        <p className="text-gray-600 mb-4">
          If you have a recommendation for a local contractor, let Mike know and we&apos;ll add them to the list.
        </p>
        <a
          href="mailto:mike@mikewenger.us?subject=Contractor Recommendation"
          className="inline-block px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] transition-colors"
        >
          Submit a Recommendation
        </a>
      </div>
    </div>
  );
}
