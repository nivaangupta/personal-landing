export default function Stars({ rating, max = 3 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;
        const id = `half-${i}-${rating}`;

        return (
          <svg
            key={i}
            viewBox="0 0 12 12"
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            {half && (
              <defs>
                <clipPath id={id}>
                  <rect x="0" y="0" width="6" height="12" />
                </clipPath>
              </defs>
            )}
            {/* empty background */}
            <path
              d="M6 0l1.545 3.09L11 3.635l-2.5 2.455.59 3.46L6 7.91l-3.09 1.64.59-3.46L1 3.635l3.455-.545z"
              fill="#e5e7eb"
            />
            {/* filled overlay — full or half */}
            {(filled || half) && (
              <path
                d="M6 0l1.545 3.09L11 3.635l-2.5 2.455.59 3.46L6 7.91l-3.09 1.64.59-3.46L1 3.635l3.455-.545z"
                fill="#1f2937"
                clipPath={half ? `url(#${id})` : undefined}
              />
            )}
          </svg>
        );
      })}
    </span>
  );
}
