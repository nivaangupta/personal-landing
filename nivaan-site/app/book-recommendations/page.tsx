import { getPageContent, type Book } from "@/lib/markdown";
import Stars from "@/components/Stars";

export default async function BookRecommendations() {
  const { title, description, data } = await getPageContent("book-recommendations");
  const books = (data.books ?? []) as Book[];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      <ul className="space-y-8">
        {books.map((book) => (
          <li key={book.title} className="space-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base font-medium text-gray-900">
                {book.title}
                <span className="text-gray-400 font-normal"> — {book.author}</span>
              </p>
              <Stars rating={book.stars} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{book.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
