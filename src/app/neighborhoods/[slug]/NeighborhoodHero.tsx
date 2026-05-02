"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Props {
  name: string;
  city: string | null;
  customImage?: string;
}

export default function NeighborhoodHero({ name, city, customImage }: Props) {
  const panoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customImage || !panoRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    const loader = new Loader({ apiKey, version: "weekly" });

    loader.load().then((google) => {
      if (!panoRef.current) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address: `${name}, ${city ?? "Union County"}, NC` },
        (results, status) => {
          if (status === "OK" && results?.[0] && panoRef.current) {
            new google.maps.StreetViewPanorama(panoRef.current, {
              position: results[0].geometry.location,
              pov: { heading: 0, pitch: 0 },
              zoom: 1,
              addressControl: false,
              fullscreenControl: true,
              motionTracking: false,
              motionTrackingControl: false,
            });
          }
        }
      );
    });
  }, [name, city, customImage]);

  if (customImage) {
    return (
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customImage} alt={`${name} neighborhood`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
          <h1 className="text-4xl font-bold text-white drop-shadow">{name}</h1>
          {city && <p className="text-blue-200 text-lg">{city}, NC</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200">
      <div ref={panoRef} className="w-full h-full" />
      <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
        <h1 className="text-4xl font-bold text-white drop-shadow">{name}</h1>
        {city && <p className="text-blue-200 text-lg">{city}, NC</p>}
      </div>
    </div>
  );
}
