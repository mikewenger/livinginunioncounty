"use client";

interface Props {
  name: string;
  city: string | null;
  customImage?: string;
}

export default function NeighborhoodHero({ name, city, customImage }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const location = encodeURIComponent(`${name}, ${city ?? "Union County"}, NC`);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200">
      {customImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={customImage} alt={`${name} neighborhood`} className="w-full h-full object-cover" />
      ) : (
        <iframe
          src={`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${location}&fov=80`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${name} Street View`}
        />
      )}
      {/* Name overlay — pointer-events-none so iframe stays interactive */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
        <h1 className="text-4xl font-bold text-white drop-shadow">{name}</h1>
        {city && <p className="text-blue-200 text-lg">{city}, NC</p>}
      </div>
    </div>
  );
}
