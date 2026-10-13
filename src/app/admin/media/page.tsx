import { getAllMedia } from "@/lib/cms/store";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div className="space-y-6">
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
