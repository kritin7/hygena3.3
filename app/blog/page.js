import Link from "next/link"
import { blogs } from "@/lib/blogs"

export const metadata = {
  title: "Helmet Hygiene Blog | Hygena",
  description:
    "Learn about helmet hygiene, scalp health, odor prevention, and bacterial protection for Indian riders."
}

export default function BlogPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-7xl">
      
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-12">
        Hygena Blog
      </h1>

      {/* Blog Grid (Menhood-style) */}
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map(blog => (
          <article
            key={blog.slug}
            className="group"
          >
            {/* Blog Image */}
            <Link href={`/blog/${blog.slug}`}>
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Blog Title */}
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">
              {blog.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">
              {blog.description}
            </p>

            {/* Read More */}
            <Link
              href={`/blog/${blog.slug}`}
              className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#D2691E]"
            >
              READ MORE
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
