import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getNeighborhood, getNeighborhoods, getNeighborhoodExpert, formatPrice } from "@/lib/data";
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

function getStreetViewUrl(name: string, city: string | null): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const location = encodeURIComponent(`${name}, ${city ?? "Union County"}, NC`);
  return `https://maps.googleapis.com/maps/api/streetview?size=1200x400&location=${location}&fov=90&pitch=0&key=${apiKey}`;
}

export default async function NeighborhoodDetailPage({ params }: Props) {
  const { slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) notFound();
  const expert = getNeighborhoodExpert(slug);
  const streetViewUrl = getStreetViewUrl(n.name, n.city);

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

      {/* Hero photo */}
      <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-200">
        <Image
          src={streetViewUrl}
          alt={`${n.name} neighborhood entrance`}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white drop-shadow">{n.name}</h1>
          {n.city && (
            <p className="text-blue-200 text-lg">
              {n.city}, NC {n.zip && `• ${n.zip}`}
            </p>
          )}
        </div>
      </div>

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

      {/* Neighborhood Expert */}
      {expert ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="bg-[#1e3a5f] px-6 py-3">
            <h2 className="text-white font-bold text-lg">Neighborhood Expert</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {expert.photo && (
                <div className="flex-shrink-0">
                  <Image
                    src={expert.photo}
                    alt={expert.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover w-28 h-28"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#1e3a5f]">{expert.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{expert.brokerage}</p>
                <p className="text-gray-700 text-sm mb-3">{expert.bio}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href={`tel:${expert.phone}`} className="text-[#1e3a5f] font-semibold hover:underline">
                    {expert.phone}
                  </a>
                  <a href={`mailto:${expert.email}`} className="text-[#1e3a5f] font-semibold hover:underline">
                    {expert.email}
                  </a>
                  {expert.website && (
                    <a href={expert.website} target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] font-semibold hover:underline">
                      Website →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Services */}
            {expert.services.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {expert.services.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {expert.reviews.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Client Reviews in {n.name}
                </h4>
                <div className="space-y-4">
                  {expert.reviews.map((r, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                        <span className="text-gray-500 text-xs">{r.date}</span>
                        {r.address && <span className="text-gray-400 text-xs">· {r.address}</span>}
                      </div>
                      <p className="text-gray-700 text-sm">{r.text}</p>
                      <p className="text-gray-500 text-xs mt-1">— {r.reviewer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-500 text-sm">
            No neighborhood expert yet for {n.name}.{" "}
            <Link href={`/become-neighborhood-expert?neighborhood=${encodeURIComponent(n.name)}`} className="text-[#1e3a5f] font-semibold hover:underline">
              Apply to be the expert →
            </Link>
          </p>
        </div>
      )}

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
