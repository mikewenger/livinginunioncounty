import { notFound } from "next/navigation";
import Link from "next/link";
import { getNeighborhood, getNeighborhoods, formatPrice } from "@/lib/data";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getNeighborhoods().map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) return {};
  return {
    title: `${n.name} Neighborhood`,
    description: `${n.name} in ${n.city ?? "Union County"}, NC — avg price ${formatPrice(n.avgPrice)}, schools, amenities, and homes for sale.`,
  };
}

export default async function NeighborhoodDetailPage({ params }: Props) {
  const { slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1e3a5f]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/neighborhoods" className="hover:text-[#1e3a5f]">Neighborhoods</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{n.name}</span>
      </nav>

      <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">{n.name}</h1>
      {n.city && (
        <p className="text-gray-500 text-lg mb-8">
          {n.city}, NC {n.zip && `• ${n.zip}`}
        </p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Avg Sale Price", value: formatPrice(n.avgPrice) },
          { label: "Median Price", value: formatPrice(n.medianPrice) },
          { label: "Avg Days on Market", value: n.avgDaysOnMarket ? `${n.avgDaysOnMarket} days` : "N/A" },
          { label: "Sales (Past Year)", value: n.salesCount.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-blue-50 rounded-xl p-4 text-center">
            <span className="text-xs text-gray-500 block mb-1">{label}</span>
            <span className="text-xl font-bold text-[#1e3a5f]">{value}</span>
          </div>
        ))}
      </div>

      {/* Price range */}
      {n.minPrice && n.maxPrice && (
        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-[#1e3a5f] mb-2">Price Range (Past Year)</h2>
          <p className="text-gray-700">
            Homes in {n.name} sold between{" "}
            <strong>{formatPrice(n.minPrice)}</strong> and{" "}
            <strong>{formatPrice(n.maxPrice)}</strong>.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Schools */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">🏫 Schools</h2>
          <div className="space-y-3">
            {[
              { level: "Elementary", school: n.elementarySchool },
              { level: "Middle", school: n.middleSchool },
              { level: "High", school: n.highSchool },
            ].map(({ level, school }) => (
              <div key={level} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 text-sm">{level} School</span>
                <span className="font-semibold text-gray-800 text-sm">
                  {school ?? "—"}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/schools"
            className="block mt-4 text-center text-sm text-[#1e3a5f] hover:underline"
          >
            Find other neighborhoods with these schools →
          </Link>
        </div>

        {/* Amenities */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">🏊 Community Amenities</h2>
          {n.amenities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {n.amenities.map((a) => (
                <span key={a} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No community amenities on record for this neighborhood.</p>
          )}
          <Link
            href="/amenities"
            className="block mt-4 text-center text-sm text-[#1e3a5f] hover:underline"
          >
            Browse neighborhoods by amenity →
          </Link>
        </div>
      </div>

      {/* Homes for sale */}
      <div className="bg-[#1e3a5f] text-white rounded-xl p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Homes for Sale in {n.name}</h2>
        <p className="text-blue-200 mb-4">
          Browse current listings in this neighborhood on Waxhaw Realty.
        </p>
        <Link
          href="/homes-for-sale"
          className="inline-block px-6 py-3 bg-[#e8a020] text-white font-bold rounded-lg hover:bg-[#cc8c1a] transition-colors"
        >
          View Listings
        </Link>
      </div>

      {/* Contact CTA */}
      <div className="border-2 border-[#e8a020] rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">
          Questions about {n.name}?
        </h2>
        <p className="text-gray-600 mb-4">
          Mike Wenger can give you a personal overview of this neighborhood —
          what it's like to live there, recent sales, and what's available now.
        </p>
        <Link
          href={`/contact?neighborhood=${encodeURIComponent(n.name)}`}
          className="inline-block px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-lg hover:bg-[#163f6e] transition-colors"
        >
          Ask Mike About {n.name}
        </Link>
      </div>
    </div>
  );
}
