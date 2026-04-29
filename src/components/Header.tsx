"use client";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { label: "Neighborhoods", href: "/neighborhoods" },
  { label: "Schools", href: "/schools" },
  { label: "Amenities", href: "/amenities" },
  { label: "Homes For Sale", href: "/homes-for-sale" },
  { label: "Blog", href: "/blog" },
  { label: "Contractors", href: "/contractors" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#1e3a5f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-wide">Living in Union County NC</span>
          <span className="text-xs text-blue-200">Your guide to relocating to the Charlotte area</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-2 px-4 py-2 bg-[#e8a020] text-white text-sm font-semibold rounded hover:bg-[#cc8c1a] transition-colors"
          >
            Get Help Moving
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-white/10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/20 px-4 pb-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm hover:text-blue-200"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
