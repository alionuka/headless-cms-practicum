export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}