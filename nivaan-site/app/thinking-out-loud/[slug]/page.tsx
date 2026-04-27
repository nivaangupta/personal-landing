import Link from "next/link";
import { getPost, getAllPosts } from "@/lib/markdown";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-8">
      <div className="space-y-2">
        <Link
          href="/thinking-out-loud"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Thinking Out Loud
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 pt-2">
          {post.title}
        </h1>
        <p className="text-xs text-gray-400">{post.date}</p>
      </div>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
