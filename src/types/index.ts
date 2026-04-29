export interface Neighborhood {
  id: string;
  name: string;
  city: string | null;
  zip: string | null;
  avgPrice: number | null;
  medianPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  avgDaysOnMarket: number | null;
  salesCount: number;
  elementarySchool: string | null;
  middleSchool: string | null;
  highSchool: string | null;
  amenities: string[];
}

export interface School {
  id: number;
  name: string;
  type: "Elementary" | "Middle" | "High";
  county: string;
  state: string;
  slug: string;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface Contractor {
  company: string;
  contact: string | null;
  phone: string | null;
  email: string | null;
  service: string | null;
  website: string | null;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  content: string;
}
