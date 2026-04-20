import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const STRAPI_URL = "http://127.0.0.1:1337";

async function getGlobal() {
  const res = await fetch(`${STRAPI_URL}/api/global?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch global data");
  }

  const json = await res.json();
  return json.data;
}

async function getAbout() {
  const res = await fetch(
    `${STRAPI_URL}/api/about?populate[blocks][populate]=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch about data");
  }

  const json = await res.json();
  return json.data;
}

function renderBlock(block: any) {
  switch (block.__component) {
    case "shared.quote":
      return (
        <section
          key={`${block.__component}-${block.id}`}
          className="rounded-2xl bg-black px-8 py-10 text-white shadow-md"
        >
          <p className="mb-4 text-2xl font-medium italic">“{block.body}”</p>
          <p className="text-sm uppercase tracking-wide text-gray-300">
            {block.title}
          </p>
        </section>
      );

    case "shared.rich-text":
      return (
        <section
          key={`${block.__component}-${block.id}`}
          className="rounded-2xl bg-white p-8 shadow-md"
        >
          <h2 className="mb-4 text-2xl font-semibold">Rich Text Block</h2>
          <pre className="whitespace-pre-wrap text-gray-700">{block.body}</pre>
        </section>
      );

    case "shared.media": {
      const imageUrl = block.file?.url ? `${STRAPI_URL}${block.file.url}` : null;

      return (
        <section
          key={`${block.__component}-${block.id}`}
          className="overflow-hidden rounded-2xl bg-white shadow-md"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={block.file.alternativeText || "media"}
              className="h-[400px] w-full object-cover"
            />
          )}
        </section>
      );
    }

    default:
      return (
        <section
          key={`${block.__component}-${block.id}`}
          className="rounded-2xl bg-yellow-50 p-6"
        >
          <p className="text-sm text-gray-700">
            Unsupported block type: {block.__component}
          </p>
        </section>
      );
  }
}

export default async function HomePage() {
  const global = await getGlobal();
  const about = await getAbout();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar siteName={global.siteName} />
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            {global.siteName}
          </p>

          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
            {about.title}
          </h1>

          <p className="max-w-2xl text-lg text-gray-600">
            {global.siteDescription}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12">
        {about.blocks?.map((block: any) => renderBlock(block))}
      </section>
      <Footer siteName={global.siteName} /> 
    </main>
  );
}