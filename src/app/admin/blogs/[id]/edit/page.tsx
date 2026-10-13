import { notFound } from "next/navigation";
import { getBlogById, getAllCategories, getAllTags } from "@/lib/cms/store";
import { BlogEditor } from "@/components/admin/BlogEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <BlogEditor initialBlog={blog} categories={categories} tags={tags} />
    </div>
  );
}
