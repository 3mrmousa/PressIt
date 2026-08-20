import { redirect } from "next/navigation";
import { getMe } from "../../features/auth/serverIndex";
import Sidebar from "../../components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await getMe();
  } catch (error) {
  }

  if (!user?.data || user.data.role !== "admin") {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen">
      <aside className="sticky z-40 top-0 left-0 h-screen shrink-0">
        <Sidebar />
      </aside>
      <div className="flex-1 min-w-0 mt-8 md:mt-0">{children}</div>
    </div>
  );
}
