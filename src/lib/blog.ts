import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { BlogPost } from "@/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export function getAllPosts(): BlogPost[] {
  ensureBlogDir();
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? slug,
      excerpt: data.excerpt ?? content.slice(0, 160) + "...",
      author: data.author ?? "Mike Wenger",
      content,
    };
  });
}

export function getPost(slug: string): BlogPost | undefined {
  ensureBlogDir();
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? slug,
    excerpt: data.excerpt ?? content.slice(0, 160) + "...",
    author: data.author ?? "Mike Wenger",
    content,
  };
}

export async function renderPost(content: string): Promise<string> {
  return marked(content) as string;
}
