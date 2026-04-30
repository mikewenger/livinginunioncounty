import { Neighborhood, School, Amenity, Contractor, NeighborhoodExpert } from "@/types";
import neighborhoodsData from "../../data/neighborhoods.json";
import schoolsData from "../../data/schools.json";
import amenitiesData from "../../data/amenities.json";
import contractorsData from "../../data/contractors.json";
import expertsData from "../../data/neighborhood-experts.json";

export function getNeighborhoods(): Neighborhood[] {
  return neighborhoodsData as Neighborhood[];
}

export function getNeighborhood(id: string): Neighborhood | undefined {
  return (neighborhoodsData as Neighborhood[]).find((n) => n.id === id);
}

export function getSchools(): School[] {
  return schoolsData as School[];
}

export function getAmenities(): Amenity[] {
  return amenitiesData as Amenity[];
}

export function getContractors(): Contractor[] {
  return contractorsData as Contractor[];
}

export function getNeighborhoodExpert(slug: string): NeighborhoodExpert | undefined {
  const experts = expertsData as Record<string, NeighborhoodExpert>;
  return experts[slug];
}

export function getNeighborhoodsBySchool(
  schoolName: string,
  type: "elementary" | "middle" | "high"
): Neighborhood[] {
  const field =
    type === "elementary"
      ? "elementarySchool"
      : type === "middle"
      ? "middleSchool"
      : "highSchool";
  return (neighborhoodsData as Neighborhood[]).filter(
    (n) => n[field]?.toLowerCase() === schoolName.toLowerCase()
  );
}

export function getNeighborhoodsByAmenity(amenity: string): Neighborhood[] {
  return (neighborhoodsData as Neighborhood[]).filter((n) =>
    n.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
  );
}

export function formatPrice(price: number | null): string {
  if (!price) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getUniqueSchools(
  type: "elementarySchool" | "middleSchool" | "highSchool"
): string[] {
  const names = (neighborhoodsData as Neighborhood[])
    .map((n) => n[type])
    .filter((s): s is string => !!s);
  return [...new Set(names)].sort();
}
