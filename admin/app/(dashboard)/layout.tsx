import { redirect } from "next/navigation";
import { getMe } from "../../features/auth/serverIndex";
import { getAdminSettings } from "../../features/admin/serverIndex";
import Sidebar from "../../components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  let settings;
  try {
    user = await getMe();
    const settingsRes = await getAdminSettings();
    settings = settingsRes?.data;
  } catch (error) {
  }

  if (!user?.data || (user.data.role !== "admin" && user.data.role !== "manager")) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen">
      <aside className="sticky z-40 top-0 left-0 h-screen shrink-0">
        <Sidebar logoUrl={settings?.logo?.secure_url} siteName={settings?.siteName} />
      </aside>
      <div className="flex-1 min-w-0 mt-8 md:mt-0">{children}</div>
    </div>
  );
}
