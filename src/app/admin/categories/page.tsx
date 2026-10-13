import { getAllCategories } from "@/lib/cms/store";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
