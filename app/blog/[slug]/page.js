import { notFound } from "next/navigation"
import { blogs } from "@/lib/blogs"

export async function generateMetadata({ params }) {
  const blog = blogs.find(b => b.slug === params.slug)
  if (!blog) return {}

  return {
    title: blog.title + " | Hygena",
    description: blog.description
  }
}

export default function BlogPost({ params }) {
  const blog = blogs.find(b => b.slug === params.slug)
  if (!blog) notFound()

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-400 mb-8">{blog.date}</p>

      <article className="prose max-w-none">
        {blog.content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </article>
    </div>
  )
}
