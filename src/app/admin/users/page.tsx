import { redirect } from "next/navigation";

export default function LegacyUsersRedirect() {
  redirect("/operation/admin/users");
}
