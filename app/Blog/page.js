import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

export default function BlogPage() {
  const files = fs.readdirSync(path.join("content/blog"));

  const posts = files.map(filename => {
    const fileContent = fs.readFileSync(
      path.join("content/blog", filename),
      "utf-8"
    );
    const { data } = matter(fileContent);

    return {
      slug: filename.replace(".md", ""),
      ...data,
    };
  });

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Hygena Blog</h1>

      <div className="space-y-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border p-6 rounded-lg hover:shadow"
          >
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
