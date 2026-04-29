import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, renderPost, getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const html = await renderPost(post.content);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1e3a5f]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-[#1e3a5f]">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{post.title}</span>
      </nav>

      <h1 className="text-4xl font-bold text-[#1e3a5f] mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-sm">
          MW
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{post.author}</p>
          <p className="text-gray-400 text-xs">
            {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <article
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h2 className="font-bold text-[#1e3a5f] mb-2">Thinking about moving to Union County?</h2>
        <p className="text-gray-600 text-sm mb-4">
          Mike Wenger can help you find the perfect neighborhood, school district, and home.
        </p>
        <Link
          href="/contact"
          className="inline-block px-5 py-2 bg-[#1e3a5f] text-white text-sm font-bold rounded-lg hover:bg-[#163f6e] transition-colors"
        >
          Get in Touch
        </Link>
      </div>

      <div className="mt-6 text-center">
        <Link href="/blog" className="text-sm text-[#1e3a5f] hover:underline">← Back to Blog</Link>
      </div>
    </div>
  );
}
