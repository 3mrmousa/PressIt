import { redirect } from "next/navigation";
import { getMe } from "../../features/auth/serverIndex";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user?.data || user.message !== "success" || user.data.role !== "admin") {
    redirect("/login");
  }
  return (
    <>
      {/* <Sidebar /> */}
      <div className="flex-1">{children}</div>
    </>
  );
}
