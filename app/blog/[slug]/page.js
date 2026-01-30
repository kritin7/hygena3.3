import { blogs } from '@/lib/blogs'
import { notFound } from 'next/navigation'

/* ---------- CONTENT RENDERER ---------- */
function renderContent(content) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h2
          key={i}
          className="text-2xl md:text-3xl font-semibold mt-12 mb-5 text-gray-900 tracking-tight"
        >
          {line.replace('## ', '')}
        </h2>
      )
    }

    if (line.startsWith('# ')) {
      return (
        <h1
          key={i}
          className="text-4xl font-bold mt-16 mb-6 text-gray-900"
        >
          {line.replace('# ', '')}
        </h1>
      )
    }

    if (line.trim() === '') {
      return <div key={i} className="h-4" />
    }

    return (
      <p
        key={i}
        className="text-[17px] leading-8 text-gray-700 mb-5"
      >
        {line}
      </p>
    )
  })
}

/* ---------- PAGE ---------- */
export default function BlogPost({ params }) {
  const post = blogs.find(b => b.slug === params.slug)
  if (!post) notFound()

  /* RELATED POSTS */
  const relatedPosts = blogs
    .filter(b => b.slug !== post.slug && b.tags?.some(t => post.tags?.includes(t)))
    .slice(0, 3)

  /* ---------- SCHEMA ---------- */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date
  }

  const faqSchema = post.faqs && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
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

      <div className="container mx-auto px-4 py-16 max-w-4xl">

        {/* ---------- TITLE ---------- */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* ---------- DATE ---------- */}
        <p className="text-sm text-gray-500 mb-6">
          {post.date}
        </p>

        {/* ---------- HERO IMAGE (Menhood-style) ---------- */}
        {post.image && (
          <div className="mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        )}

        {/* ---------- TAGS ---------- */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ---------- CONTENT ---------- */}
        <div>
          {renderContent(post.content)}
        </div>

        {/* ---------- INLINE CTA ---------- */}
        <div className="my-14 p-6 rounded-2xl bg-gray-50 border">
          <p className="font-semibold text-lg mb-2">
            Stop helmet bacteria at the source
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Hygena Helmet Spray disinfects helmet liners and prevents scalp issues.
          </p>
          <a
            href="/shop"
            className="inline-block bg-[#D2691E] text-white px-5 py-3 rounded-lg font-semibold"
          >
            Shop Helmet Spray →
          </a>
        </div>

        {/* ---------- FAQ ---------- */}
        {post.faqs && (
          <section className="mt-16">
            <h3 className="text-xl font-bold mb-6 text-gray-900">FAQs</h3>
            {post.faqs.map((f, i) => (
              <div key={i} className="mb-5">
                <p className="font-semibold">{f.q}</p>
                <p className="text-gray-600 mt-1">{f.a}</p>
              </div>
            ))}
          </section>
        )}

        {/* ---------- SHARE (ICON-BASED) ---------- */}
        <div className="border-t mt-16 pt-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Share this article
          </p>

          <div className="flex gap-4">
            <a
              href={`https://wa.me/?text=https://hygena.in/blog/${post.slug}`}
              target="_blank"
              aria-label="Share on WhatsApp"
            >
              <img src="/icons/whatsapp.svg" className="w-6 h-6" />
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=https://hygena.in/blog/${post.slug}`}
              target="_blank"
              aria-label="Share on Twitter"
            >
              <img src="/icons/twitter.svg" className="w-6 h-6" />
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://hygena.in/blog/${post.slug}`}
              target="_blank"
              aria-label="Share on LinkedIn"
            >
              <img src="/icons/linkedin.svg" className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* ---------- RELATED ---------- */}
        {relatedPosts.length > 0 && (
          <section className="mt-20">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Related Articles
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map(r => (
                <a
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="border rounded-xl p-5 hover:shadow-md transition"
                >
                  <h4 className="font-semibold mb-2 text-gray-900">
                    {r.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {r.description}
                  </p>
                  <span className="text-xs text-gray-400">
                    {r.date}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
