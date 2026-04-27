import { getPageContent } from "@/lib/markdown";

export default async function LetsTalk() {
  const { title, description, contentHtml } = await getPageContent("lets-talk");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
