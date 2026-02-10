import { redirect } from "next/navigation";

export default function LegacyRepairsRedirect() {
  redirect("/operation/admin/repairs");
}
