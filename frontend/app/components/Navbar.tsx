export default function Navbar({ siteName }: { siteName: string }) {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-semibold">{siteName}</h1>

        <div className="flex gap-6 text-sm text-gray-600">
          <a href="/" className="hover:text-black">
            Home
          </a>
          <a href="/about" className="hover:text-black">
            About
          </a>
          <a href="/articles" className="hover:text-black">
            Articles
          </a>
        </div>
      </div>
    </nav>
  );
}