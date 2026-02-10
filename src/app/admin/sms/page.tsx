import { redirect } from "next/navigation";

export default function LegacySmsRedirect() {
  redirect("/operation/admin/sms");
}
