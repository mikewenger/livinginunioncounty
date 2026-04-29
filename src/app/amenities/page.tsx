"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Neighborhood, Amenity } from "@/types";
import neighborhoodsData from "../../../data/neighborhoods.json";
import amenitiesData from "../../../data/amenities.json";

const neighborhoods = neighborhoodsData as Neighborhood[];
const amenities = amenitiesData as Amenity[];

function formatPrice(p: number | null) {
  if (!p) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);
}

const AMENITY_ICONS: Record<string, string> = {
  "55 and Older": "👴",
  "Club House": "🏛️",
  "Dog Park": "🐕",
  "Fitness Center": "💪",
  "Gated Community": "🔒",
  "Golf Course": "⛳",
  "Indoor Pool": "🏊",
  "Lake Access": "🚣",
  "Outdoor Pool": "🏊",
  "Playground": "🛝",
  "Pond": "🦆",
  "Recreation Area": "🎯",
  "RV/Boat Storage": "🚤",
  "Sidewalks": "🚶",
  "Sport Court": "🏀",
  "Stables": "🐴",
  "Tennis Courts": "🎾",
};

export default function AmenitiesPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const results = useMemo(() => {
    if (selected.length === 0) return [];
    return neighborhoods.filter((n) =>
      selected.every((s) =>
        n.amenities.some((a) => a.toLowerCase().includes(s.toLowerCase()))
      )
    );
  }, [selected]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Search by Amenity</h1>
      <p className="text-gray-600 mb-8">
        Select one or more amenities to find neighborhoods that have them.
      </p>

      {/* Amenity buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
        {amenities.map((a) => {
          const active = selected.includes(a.name);
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.name)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                active
                  ? "bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <span>{AMENITY_ICONS[a.name] ?? "✓"}</span>
              {a.name}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <p className="text-sm text-gray-600">
            Showing neighborhoods with: {selected.join(", ")}
          </p>
          <button
            onClick={() => setSelected([])}
            className="text-xs text-red-500 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      {selected.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
            {results.length} neighborhood{results.length !== 1 ? "s" : ""} match{results.length === 1 ? "es" : ""}
          </h2>
          {results.length === 0 ? (
            <p className="text-gray-500">
              No neighborhoods have all selected amenities. Try removing one.
            </p>
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
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-400 block">Avg Price</span>
                      <span className="font-semibold">{formatPrice(n.avgPrice)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Elementary</span>
                      <span className="font-semibold">{n.elementarySchool ?? "—"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {n.amenities.map((a) => (
                      <span
                        key={a}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selected.some((s) => a.toLowerCase().includes(s.toLowerCase()))
                            ? "bg-[#1e3a5f] text-white"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {selected.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          Select amenities above to find matching neighborhoods.
        </div>
      )}
    </div>
  );
}
