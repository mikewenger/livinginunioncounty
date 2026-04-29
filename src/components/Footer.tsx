import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">Living in Union County NC</h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            Helping families relocate to Union County, NC — one of the fastest-growing
            communities in the Charlotte metro area.
          </p>
          <p className="text-blue-200 text-sm mt-3">
            <strong className="text-white">Mike Wenger</strong>
            <br />
            <a href="mailto:mike@mikewenger.us" className="hover:text-white">
              mike@mikewenger.us
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Explore</h3>
          <ul className="space-y-1 text-sm text-blue-200">
            {[
              ["Neighborhoods", "/neighborhoods"],
              ["Search by School", "/schools"],
              ["Search by Amenity", "/amenities"],
              ["Homes For Sale", "/homes-for-sale"],
              ["Local Contractors", "/contractors"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Resources</h3>
          <ul className="space-y-1 text-sm text-blue-200">
            {[
              ["Blog", "/blog"],
              ["Contact Us", "/contact"],
              ["Waxhaw Realty", "https://waxhawrealty.com"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-white"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 text-center text-xs text-blue-300 py-4">
        &copy; {new Date().getFullYear()} Mike Wenger &mdash; livinginunioncounty.com. All rights reserved.
      </div>
    </footer>
  );
}
