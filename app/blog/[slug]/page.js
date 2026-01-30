import { blogs } from '@/lib/blogs'
import { notFound } from 'next/navigation'

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

export default function BlogPost({ params }) {
  const post = blogs.find(b => b.slug === params.slug)
  if (!post) notFound()

  // RELATED POSTS (Menhood-style logic)
  const relatedPosts = blogs.filter(
    b => b.slug !== post.slug && b.tags?.some(t => post.tags?.includes(t))
  ).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl grid lg:grid-cols-12 gap-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">
        {post.title}
      </h1>

      {/* META */}
      <p className="text-sm text-gray-500 mb-6">
        {post.date}
      </p>

      {/* TAGS (like Menhood) */}
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

      {/* CONTENT */}
      <div className="prose prose-gray max-w-none">
        {renderContent(post.content)}
      </div>

      {/* SHARE */}
      <div className="border-t mt-16 pt-8">
        <p className="text-sm font-semibold text-gray-700 mb-4">
          Share this article
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' https://hygena.in/blog/' + post.slug)}`}
            target="_blank"
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
          >
            WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=https://hygena.in/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
          >
            Twitter
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=https://hygena.in/blog/${post.slug}`}
            target="_blank"
            className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* RELATED ARTICLES */}
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
    </article>
  )
}
