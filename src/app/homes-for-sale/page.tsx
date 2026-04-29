import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homes For Sale in Union County NC",
  description: "Browse homes for sale in Union County, NC — Waxhaw, Indian Trail, Monroe, Marvin, and more.",
};

export default function HomesForSalePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Homes For Sale in Union County, NC</h1>
      <p className="text-gray-600 mb-8">
        Live MLS listings powered by Waxhaw Realty — updated daily.
      </p>

      {/* IDX embed placeholder */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-16 text-center mb-10">
        <div className="text-5xl mb-4">🏠</div>
        <h2 className="text-xl font-bold text-gray-600 mb-2">IDX Listings Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          The live MLS search from Waxhaw Realty will appear here. To activate it, provide the
          IDX embed code from your IDX provider settings at waxhawrealty.com.
        </p>
        <a
          href="https://waxhawrealty.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] transition-colors"
        >
          Search on Waxhaw Realty
        </a>
      </div>

      {/* Contact while IDX is pending */}
      <div className="bg-[#1e3a5f] text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Want Help Finding a Home?</h2>
        <p className="text-blue-200 mb-6">
          Mike Wenger can send you a personalized list of homes that match your criteria —
          school district, neighborhood amenities, price range, and more.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-[#e8a020] text-white font-bold rounded-lg hover:bg-[#cc8c1a] transition-colors"
        >
          Request a Custom Search
        </Link>
      </div>
    </div>
  );
}
