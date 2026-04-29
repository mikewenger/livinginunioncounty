import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Union County NC",
  description: "Local news, neighborhood spotlights, market updates, and tips for moving to Union County, NC.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">Union County NC Blog</h1>
      <p className="text-gray-600 mb-10">
        Local news, neighborhood spotlights, school updates, and tips for relocating to Union County.
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📝</div>
          <p>Blog posts coming soon. Check back daily!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>•</span>
                <span>By {post.author}</span>
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              <span className="mt-3 inline-block text-sm text-[#1e3a5f] font-semibold hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
