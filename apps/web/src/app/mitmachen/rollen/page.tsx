import { redirect } from "next/navigation";
import { VOG_ROLES_PATH } from "@/config/links";

export default function LegacyContributionRolesPage() {
  redirect(VOG_ROLES_PATH);
}
