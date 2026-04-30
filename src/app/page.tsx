import Link from "next/link";
import Image from "next/image";
import { getNeighborhoods, formatPrice } from "@/lib/data";

export default function HomePage() {
  const neighborhoods = getNeighborhoods().slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative text-white py-24 px-4 text-center overflow-hidden">
        <Image
          src="/union-county-hero.png"
          alt="Union County NC"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1e3a5f]/70" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Welcome to Union County, NC
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            One of the fastest-growing communities in the Charlotte metro —
            great schools, beautiful neighborhoods, and a small-town feel just
            minutes from the city.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/neighborhoods"
              className="px-6 py-3 bg-[#e8a020] text-white font-bold rounded-lg hover:bg-[#cc8c1a] transition-colors text-lg"
            >
              Browse Neighborhoods
            </Link>
            <Link
              href="/homes-for-sale"
              className="px-6 py-3 bg-white text-[#1e3a5f] font-bold rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              View Homes For Sale
            </Link>
          </div>
        </div>
      </section>

      {/* Quick search cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-10">
          Find Your Perfect Neighborhood
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/schools"
            className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-[#1e3a5f] hover:shadow-lg transition-all text-center"
          >
            <div className="text-4xl mb-3">🏫</div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Search by School</h3>
            <p className="text-gray-600 text-sm">
              Find neighborhoods served by the elementary, middle, or high school of your choice.
            </p>
          </Link>
          <Link
            href="/amenities"
            className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-[#1e3a5f] hover:shadow-lg transition-all text-center"
          >
            <div className="text-4xl mb-3">🏊</div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Search by Amenity</h3>
            <p className="text-gray-600 text-sm">
              Pool, clubhouse, golf course, walking trails — filter neighborhoods by what matters to you.
            </p>
          </Link>
          <Link
            href="/neighborhoods"
            className="bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-[#1e3a5f] hover:shadow-lg transition-all text-center"
          >
            <div className="text-4xl mb-3">🏡</div>
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Browse All Neighborhoods</h3>
            <p className="text-gray-600 text-sm">
              Explore 600+ neighborhoods with avg prices, days on market, schools, and amenities.
            </p>
          </Link>
        </div>
      </section>

      {/* Featured neighborhoods */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#1e3a5f]">Most Active Neighborhoods</h2>
            <Link href="/neighborhoods" className="text-[#1e3a5f] font-semibold hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {neighborhoods.map((n) => (
              <Link
                key={n.id}
                href={`/neighborhoods/${n.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-1">{n.name}</h3>
                {n.city && <p className="text-gray-500 text-sm mb-3">{n.city}, NC</p>}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">Avg Price</span>
                    <span className="font-semibold text-gray-800">{formatPrice(n.avgPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Avg Days on Market</span>
                    <span className="font-semibold text-gray-800">{n.avgDaysOnMarket ?? "N/A"} days</span>
                  </div>
                </div>
                {n.amenities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {n.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Union County */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-10">Why Union County?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🏆", title: "Top-Rated Schools", desc: "Union County Public Schools consistently rank among the best in North Carolina." },
            { icon: "📍", title: "Charlotte Access", desc: "Minutes from Uptown Charlotte with a small-town community feel." },
            { icon: "📈", title: "Growing Market", desc: "Strong home values and a thriving local economy with new businesses arriving every year." },
            { icon: "🌳", title: "Quality of Life", desc: "Parks, greenways, great restaurants, and a welcoming community for families." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-4">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#e8a020] text-white py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Ready to Make the Move?</h2>
          <p className="text-white/90 mb-6">
            Let Mike Wenger help you find the perfect neighborhood. Get personalized answers about
            schools, communities, and homes for sale.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-[#1e3a5f] font-bold rounded-lg hover:bg-blue-50 transition-colors text-lg"
          >
            Contact Mike Today
          </Link>
        </div>
      </section>
    </>
  );
}
