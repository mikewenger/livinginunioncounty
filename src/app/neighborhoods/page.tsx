import { getNeighborhoods } from "@/lib/data";
import NeighborhoodsClient from "./NeighborhoodsClient";

export const metadata = {
  title: "Union County Neighborhoods | Living in Union County",
  description: "Browse all Union County, NC neighborhoods with home sale data, school info, and amenities.",
};

export default function NeighborhoodsPage() {
  const neighborhoods = getNeighborhoods();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Union County Neighborhoods</h1>
      <p className="text-gray-600 mb-8">
        {neighborhoods.length} neighborhoods based on the past year of home sales data.
      </p>
      <NeighborhoodsClient neighborhoods={neighborhoods} />
    </div>
  );
}
