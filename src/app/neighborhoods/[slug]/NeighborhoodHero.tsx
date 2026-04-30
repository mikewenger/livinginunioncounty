"use client";

interface Props {
  name: string;
  city: string | null;
  customImage?: string;
}

export default function NeighborhoodHero({ name, city, customImage }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const location = encodeURIComponent(`${name}, ${city ?? "Union County"}, NC`);
  const src = customImage ?? `https://maps.googleapis.com/maps/api/streetview?size=1200x400&location=${location}&fov=90&pitch=0&key=${apiKey}`;

  return (
    <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6 bg-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} neighborhood`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <h1 className="text-4xl font-bold text-white drop-shadow">{name}</h1>
        {city && (
          <p className="text-blue-200 text-lg">
            {city}, NC
          </p>
        )}
      </div>
    </div>
  );
}
