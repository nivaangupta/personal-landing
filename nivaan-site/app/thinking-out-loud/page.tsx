import Link from "next/link";
import { getPageContent } from "@/lib/markdown";
import { getAllPosts } from "@/lib/markdown";

export default async function ThinkingOutLoud() {
  const { title, description } = await getPageContent("thinking-out-loud");
  const posts = getAllPosts();

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      <ul className="space-y-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/thinking-out-loud/${post.slug}`}
              className="group flex items-baseline justify-between gap-6"
            >
              <span className="text-sm text-gray-900 group-hover:underline underline-offset-4 transition-colors">
                {post.title}
              </span>
              <span className="shrink-0 text-xs text-gray-400">{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
