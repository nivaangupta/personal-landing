"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { label: "Book Recommendations", href: "/book-recommendations" },
  { label: "Thinking Out Loud", href: "/thinking-out-loud" },
  { label: "Let's Talk", href: "/lets-talk" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="max-w-2xl mx-auto px-6 pt-10 pb-4 flex items-center justify-between flex-wrap gap-4">
      <Link href="/" className="flex items-center gap-3 group">
        <Image
          src="/pixel_avatar_animated.gif"
          alt="Nivaan Gupta avatar"
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        <span className="text-base font-semibold tracking-tight text-gray-900">
          Nivaan Gupta
        </span>
      </Link>

      <nav className="flex items-center gap-6 flex-wrap">
        {links.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${
                active
                  ? "text-gray-900 underline underline-offset-4"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
