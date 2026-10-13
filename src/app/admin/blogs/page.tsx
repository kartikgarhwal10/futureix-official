import { getAllBlogsAdmin, getAllCategories } from "@/lib/cms/store";
import { BlogListTable } from "@/components/admin/BlogListTable";

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin(false);
  const categoriesData = await getAllCategories();
  const categoryNames = categoriesData.map((c) => c.name);

  return (
    <div className="space-y-6">
      <BlogListTable initialBlogs={blogs} categories={categoryNames} />
    </div>
  );
}
