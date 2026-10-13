import { getCMSSettings } from "@/lib/cms/store";
import { SettingsManager } from "@/components/admin/SettingsManager";

export default async function AdminSettingsPage() {
  const settings = await getCMSSettings();

  return (
    <div className="space-y-6">
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
