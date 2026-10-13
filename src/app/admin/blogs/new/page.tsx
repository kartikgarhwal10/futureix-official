import { getAllCategories, getAllTags } from "@/lib/cms/store";
import { BlogEditor } from "@/components/admin/BlogEditor";

export default async function NewBlogPage() {
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <BlogEditor categories={categories} tags={tags} />
    </div>
  );
}
