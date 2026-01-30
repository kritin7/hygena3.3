import Link from "next/link"
import { blogs } from "@/lib/blogs"

export const metadata = {
  title: "Helmet Hygiene Blog | Hygena",
  description: "Learn about helmet hygiene, scalp health, and odor prevention for Indian riders."
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Hygena Blog</h1>

      <div className="space-y-6">
        {blogs.map(blog => (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className="block border p-6 rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600 mt-2">{blog.description}</p>
            <p className="text-sm text-gray-400 mt-2">{blog.date}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
