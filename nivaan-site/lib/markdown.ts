import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const contentDir = path.join(process.cwd(), "content");
const postsDir = path.join(contentDir, "posts");

export interface Book {
  title: string;
  author: string;
  note: string;
  stars: number;
}

export interface ToReadBook {
  title: string;
  author: string;
  note?: string;
}

export interface RecommendedSkill {
  name: string;
  author?: string;
  url?: string;
  blurb: string;
}

export interface OwnSkill {
  name: string;
  tagline: string;
  problem: string;
  approach: string;
  mechanics: string[];
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category?: string;
  accent?: string;
  excerpt?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export interface PageContent {
  title: string;
  description: string;
  contentHtml: string;
  data: Record<string, unknown>;
}

export async function getPageContent(slug: string): Promise<PageContent> {
  const filePath = path.join(contentDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);
  const contentHtml = processed.toString();

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    contentHtml,
    data,
  };
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        category: data.category ?? "",
        accent: data.accent ?? "#4de3d4",
        excerpt: data.excerpt ?? "",
      };
    })
    .reverse();
}

export async function getPost(slug: string): Promise<Post> {
  const filePath = path.join(postsDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    accent: data.accent ?? "#4de3d4",
    excerpt: data.excerpt ?? "",
    contentHtml,
  };
}
