import { getNeighborhoods } from "@/lib/data";
import AdminUploadForm from "./AdminUploadForm";

export default function AdminPage() {
  const neighborhoods = getNeighborhoods()
    .map((n) => ({ id: n.id, name: n.name, city: n.city }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Admin — Neighborhood Images</h1>
      <p className="text-gray-500 mb-8">
        Upload a custom photo for a neighborhood. It replaces the Google Street View image.
      </p>
      <AdminUploadForm neighborhoods={neighborhoods} />
    </div>
  );
}
