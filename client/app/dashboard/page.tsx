import { getHistory, getLatestRun } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { User } from "@/types/metrics";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const history = await getHistory();
  const latest = await getLatestRun();

  return (
    <DashboardClient
      user={session.user as User}
      history={history}
      latest={latest}
    />
  );
}
