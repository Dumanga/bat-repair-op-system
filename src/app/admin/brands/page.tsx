import { redirect } from "next/navigation";

export default function LegacyBrandsRedirect() {
  redirect("/operation/admin/brands");
}
