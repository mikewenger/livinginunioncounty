"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Neighborhood } from "@/types";
import neighborhoodsData from "../../../data/neighborhoods.json";

const neighborhoods = neighborhoodsData as Neighborhood[];

function formatPrice(p: number | null) {
  if (!p) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);
}

function getUniqueSchools(field: keyof Neighborhood) {
  return [...new Set(
    neighborhoods.map((n) => n[field] as string | null).filter(Boolean)
  )].sort() as string[];
}

export default function SchoolsPage() {
  const [type, setType] = useState<"elementarySchool" | "middleSchool" | "highSchool">("elementarySchool");
  const [selected, setSelected] = useState("");

  const schoolList = useMemo(() => getUniqueSchools(type), [type]);

  const results = useMemo(() => {
    if (!selected) return [];
    return neighborhoods.filter(
      (n) => (n[type] as string | null)?.toLowerCase() === selected.toLowerCase()
    );
  }, [selected, type]);

  const typeLabel = type === "elementarySchool" ? "Elementary" : type === "middleSchool" ? "Middle" : "High";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Search by School</h1>
      <p className="text-gray-600 mb-8">
        Select a school to see every neighborhood in Union County that feeds into it.
      </p>

      {/* School type toggle */}
      <div className="flex gap-2 mb-6">
        {(["elementarySchool", "middleSchool", "highSchool"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setSelected(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              type === t
                ? "bg-[#1e3a5f] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t === "elementarySchool" ? "Elementary" : t === "middleSchool" ? "Middle" : "High School"}
          </button>
        ))}
      </div>

      {/* School picker */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a {typeLabel} School
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a school --</option>
          {schoolList.map((s) => (
            <option key={s} value={s}>{s} {typeLabel} School</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {selected && (
        <>
          {/* School Street View */}
          <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-200">
            <iframe
              key={selected}
              src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&location=${encodeURIComponent(`${selected} ${typeLabel} School, Union County, NC`)}&fov=80`}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${selected} ${typeLabel} School Street View`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-5 pointer-events-none">
              <h2 className="text-2xl font-bold text-white drop-shadow">{selected} {typeLabel} School</h2>
              <p className="text-blue-200 text-sm">Union County, NC</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            Neighborhoods served by {selected} {typeLabel} School ({results.length})
          </h2>
          {results.length === 0 ? (
            <p className="text-gray-500">No neighborhoods found for this school.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((n) => (
                <Link
                  key={n.id}
                  href={`/neighborhoods/${n.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="font-bold text-[#1e3a5f] mb-1">{n.name}</h3>
                  {n.city && <p className="text-gray-400 text-xs mb-2">{n.city}, NC</p>}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400 block">Avg Price</span>
                      <span className="font-semibold">{formatPrice(n.avgPrice)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Avg DOM</span>
                      <span className="font-semibold">{n.avgDaysOnMarket ?? "N/A"} days</span>
                    </div>
                  </div>
                  {n.amenities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {n.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!selected && (
        <div className="text-center py-16 text-gray-400">
          Select a school above to see matching neighborhoods.
        </div>
      )}
    </div>
  );
}
