import { blogs } from '@/lib/blogs'
import { notFound } from 'next/navigation'

/* ---------- CONTENT RENDERER ---------- */
function renderContent(content) {
  const lines = content.split('\n')
  const elements = []
  let listBuffer = []

  const flushList = (key) => {
    if (listBuffer.length) {
      elements.push(
        <ul key={key} className="list-disc pl-6 mb-6 space-y-2">
          {listBuffer.map((item, i) => (
            <li key={i} className="text-[17px] leading-8 text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      )
      listBuffer = []
    }
  }

  lines.forEach((line, i) => {
    /* BULLETS */
    if (line.startsWith('- ')) {
      listBuffer.push(line.replace('- ', ''))
      return
    } else {
      flushList(`list-${i}`)
    }

    /* H2 */
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={i}
          className="text-2xl md:text-3xl font-semibold mt-14 mb-6 text-gray-900 tracking-tight"
        >
          {line.replace('## ', '')}
        </h2>
      )
      return
    }

    /* H3 */
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={i}
          className="text-xl md:text-2xl font-semibold mt-10 mb-4 text-gray-900"
        >
          {line.replace('### ', '')}
        </h3>
      )
      return
    }

    /* EMPTY */
    if (!line.trim()) {
      elements.push(<div key={i} className="h-4" />)
      return
    }

    /* INLINE BOLD / SEMIBOLD */
    const parts = line.split(/(\*\*.*?\*\*|_.*?_)/g).map((part, idx) => {
      if (part.startsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-gray-900">
            {part.replace(/\*\*/g, '')}
          </strong>
        )
      }
      if (part.startsWith('_')) {
        return (
          <span key={idx} className="font-medium text-gray-800">
            {part.replace(/_/g, '')}
          </span>
        )
      }
      return part
    })

    elements.push(
      <p key={i} className="text-[17px] leading-8 text-gray-700 mb-6">
        {parts}
      </p>
    )
  })

  flushList('final')
  return elements
}

/* ---------- PAGE ---------- */
export default function BlogPost({ params }) {
  const post = blogs.find(b => b.slug === params.slug)
  if (!post) notFound()

  const relatedPosts = blogs
    .filter(b => b.slug !== post.slug && b.tags?.some(t => post.tags?.includes(t)))
    .slice(0, 3)

  /* ---------- SCHEMA ---------- */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.image
  }

  const faqSchema = post.faqs && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hygena.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://hygena.in/blog" },
      { "@type": "ListItem", position: 3, name: post.title }
    ]
  }

  return (
    <>
      {/* ---------- SCHEMA ---------- */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container mx-auto px-4 py-16 max-w-7xl grid lg:grid-cols-12 gap-12">

        {/* ---------- MAIN ARTICLE ---------- */}
        <article className="lg:col-span-8">

          <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 mb-8">{post.date}</p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-2xl mb-12"
            />
          )}

          <div>{renderContent(post.content)}</div>

          {/* INLINE CTA */}
          <div className="my-16 p-8 rounded-2xl bg-gray-50 border">
            <p className="text-xl font-semibold mb-2">
              Stop helmet bacteria at the source
            </p>
            <p className="text-gray-600 mb-4">
              Hygena Helmet Spray disinfects helmet liners and prevents scalp issues.
            </p>
            <a
              href="/shop"
              className="inline-block bg-[#D2691E] text-white px-6 py-3 rounded-lg font-semibold"
            >
              Shop Helmet Spray →
            </a>
          </div>

          {/* FAQ */}
          {post.faqs && (
            <section className="mt-20">
              <h3 className="text-2xl font-bold mb-6">FAQs</h3>
              {post.faqs.map((f, i) => (
                <div key={i} className="mb-6">
                  <p className="font-semibold">{f.q}</p>
                  <p className="text-gray-600 mt-1">{f.a}</p>
                </div>
              ))}
            </section>
          )}
        </article>

        {/* ---------- SIDEBAR (MENHOOD STYLE) ---------- */}
        <aside className="lg:col-span-4">
          {post.tags && (
            <div className="sticky top-28 border rounded-2xl p-6">
              <p className="font-semibold mb-4">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ---------- RELATED ---------- */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <h3 className="text-2xl font-bold mb-10 text-center">
            Related Articles
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map(r => (
              <a
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.title}
                    className="rounded-xl mb-4 group-hover:opacity-90 transition"
                  />
                )}
                <h4 className="font-semibold text-lg mb-2">
                  {r.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {r.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
