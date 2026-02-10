import { redirect } from "next/navigation";

export default function LegacySettingsRedirect() {
  redirect("/operation/admin/settings");
}
