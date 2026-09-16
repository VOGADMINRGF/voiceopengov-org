import { redirect } from "next/navigation";
import { VOG_JOIN_PATH } from "@/config/links";

export default function LegacyContributionRolesPage() {
  redirect(VOG_JOIN_PATH);
}
