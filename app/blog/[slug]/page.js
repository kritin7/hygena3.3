import { blogs } from '@/lib/blogs'
import { notFound } from 'next/navigation'

function renderContent(content) {
  return content.split('\n').map((line, i) => {
    // H3
    if (line.startsWith('### ')) {
      return (
        <h3
          key={i}
          className="text-xl font-semibold mt-8 mb-3 text-gray-900"
        >
          {line.replace('### ', '')}
        </h3>
      )
    }

    // H2
    if (line.startsWith('## ')) {
      return (
        <h2
          key={i}
          className="text-2xl font-bold mt-10 mb-4 text-gray-900"
        >
          {line.replace('## ', '')}
        </h2>
      )
    }

    // H1 (inside content if ever needed)
    if (line.startsWith('# ')) {
      return (
        <h1
          key={i}
          className="text-3xl font-bold mt-12 mb-6 text-gray-900"
        >
          {line.replace('# ', '')}
        </h1>
      )
    }

    // Empty line
    if (line.trim() === '') {
      return <div key={i} className="h-4" />
    }

    // Normal paragraph
    return (
      <p
        key={i}
        className="text-base leading-7 text-gray-700 mb-4"
      >
        {line}
      </p>
    )
  })
}

export default function BlogPost({ params }) {
  const post = blogs.find(b => b.slug === params.slug)

  if (!post) notFound()

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {post.title}
      </h1>

      {/* Meta */}
      <p className="text-sm text-gray-500 mb-10">
        {post.date}
      </p>

      {/* Content */}
      <div>
        {renderContent(post.content)}
      </div>
    </article>
  )
}
