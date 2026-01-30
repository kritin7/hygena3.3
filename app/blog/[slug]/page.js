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
            href="/products/1"
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

        {/* SHARE */}
<div className="border-t mt-16 pt-8">
  <p className="text-sm font-semibold text-gray-700 mb-4">
    Share this article
  </p>

  <div className="flex items-center gap-4">
    {/* WhatsApp */}
    <a
      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
        post.title + ' https://hygena.in/blog/' + post.slug
      )}`}
      target="_blank"
      aria-label="Share on WhatsApp"
      className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-green-50 transition"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-green-600"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.35 4.94L2 22l5.2-1.36A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.58 0-3.12-.46-4.44-1.32l-.32-.2-3.08.8.82-3-.2-.32A7.97 7.97 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.41-5.62c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.37.52.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>

    {/* Twitter */}
    <a
      href={`https://twitter.com/intent/tweet?url=https://hygena.in/blog/${post.slug}&text=${encodeURIComponent(
        post.title
      )}`}
      target="_blank"
      aria-label="Share on Twitter"
      className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100 transition"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-black"
      >
        <path d="M18.244 2H21.37l-6.84 7.82L22.5 22h-6.87l-5.38-7.01L4.12 22H1l7.3-8.36L1.5 2h7.05l4.87 6.4L18.24 2z" />
      </svg>
    </a>

    {/* LinkedIn */}
    <a
      href={`https://www.linkedin.com/sharing/share-offsite/?url=https://hygena.in/blog/${post.slug}`}
      target="_blank"
      aria-label="Share on LinkedIn"
      className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-blue-50 transition"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-blue-700"
      >
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
      </svg>
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
