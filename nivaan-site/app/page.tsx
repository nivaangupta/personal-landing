export default function Home() {
  return (
    <div className="space-y-6">
      <p className="text-gray-900 leading-relaxed text-base max-w-prose">
        Better tools exist. Adoption doesn&apos;t.
      </p>
      <p className="text-gray-700 leading-relaxed text-base max-w-prose">
        <a
          href="https://napx.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
        >
          NapX
        </a>{" "}
        automates hospitality.{" "}
        {/* <a
          href="https://getintx.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
        > */}
          <u>IntX</u>{" "}(Stealth Mode)
        {/* </a> */}
        {" "}
        makes sure conventional owners want to use it.
      </p>
      <div className="flex gap-4 pt-2">
        <a
          href="https://x.com/nivusd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4"
        >
          X
        </a>
        <a
          href="https://github.com/nivaangupta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4"
        >
          Github
        </a>
      </div>
    </div>
  );
}
