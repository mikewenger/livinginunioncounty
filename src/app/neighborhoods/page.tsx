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

export default function NeighborhoodsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState<"salesCount" | "avgPrice" | "avgDaysOnMarket">("salesCount");

  const cities = useMemo(() => {
    const c = [...new Set(neighborhoods.map((n) => n.city).filter(Boolean) as string[])].sort();
    return c;
  }, []);

  const filtered = useMemo(() => {
    return neighborhoods
      .filter((n) => {
        const matchSearch = !search || n.name.toLowerCase().includes(search.toLowerCase());
        const matchCity = !city || n.city === city;
        return matchSearch && matchCity;
      })
      .sort((a, b) => {
        if (sortBy === "avgPrice") return (b.avgPrice ?? 0) - (a.avgPrice ?? 0);
        if (sortBy === "avgDaysOnMarket") return (a.avgDaysOnMarket ?? 999) - (b.avgDaysOnMarket ?? 999);
        return b.salesCount - a.salesCount;
      });
  }, [search, city, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Union County Neighborhoods</h1>
      <p className="text-gray-600 mb-8">
        {neighborhoods.length} neighborhoods based on the past year of home sales data.
      </p>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Neighborhood name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="salesCount">Most Sales</option>
            <option value="avgPrice">Highest Price</option>
            <option value="avgDaysOnMarket">Fastest Selling</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 self-center">{filtered.length} results</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((n) => (
          <Link
            key={n.id}
            href={`/neighborhoods/${n.id}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-1">{n.name}</h2>
            {n.city && <p className="text-gray-400 text-sm mb-3">{n.city}, NC {n.zip}</p>}
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-400 text-xs block">Avg Sale Price</span>
                <span className="font-semibold">{formatPrice(n.avgPrice)}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Avg Days on Market</span>
                <span className="font-semibold">{n.avgDaysOnMarket ?? "N/A"} days</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Sales (past year)</span>
                <span className="font-semibold">{n.salesCount}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Elementary School</span>
                <span className="font-semibold text-xs">{n.elementarySchool ?? "—"}</span>
              </div>
            </div>
            {n.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {n.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No neighborhoods match your filters. Try a different search.
        </div>
      )}
    </div>
  );
}
