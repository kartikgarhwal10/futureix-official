import { getAllTags } from "@/lib/cms/store";
import { TagManager } from "@/components/admin/TagManager";

export default async function AdminTagsPage() {
  const tags = await getAllTags();

  return (
    <div className="space-y-6">
      <TagManager initialTags={tags} />
    </div>
  );
}
