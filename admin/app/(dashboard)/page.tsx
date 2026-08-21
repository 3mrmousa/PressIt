import { getAdminStats } from "../../features/admin/serverIndex";
import DataCard from "../../components/ui/DataCard";
import SubscriptionTable from "../../components/ui/SubscriptionTable";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const { data: stats, pagination } = await getAdminStats(page, limit);

  const cardsData = [
    {
      title: "Users",
      value: stats?.totalUsers || 0,
      icon: "users",
      bgColor: "bg-blue-50",
    },
    {
      title: "Managers",
      value: stats?.totalManagers || 0,
      icon: "user-tie",
    },
    {
      title: "Free Users",
      value: stats?.totalFreeUsers || 0,
      icon: "user-circle",
    },
    {
      title: "Plus Users",
      value: stats?.totalPlusUsers || 0,
      icon: "user-circle",
    },
    {
      title: "Pro Users",
      value: stats?.totalProUsers || 0,
      icon: "user-circle",
    },
    {
      title: "Active Subscriptions",
      value: stats?.totalActiveSubscriptions || 0,
      icon: "check-circle",
    },
    {
      title: "Canceled Subscriptions",
      value: stats?.totalCanceledSubscriptions || 0,
      icon: "times-circle",
    },
    {
      title: "Earnings",
      value: stats?.totalEarnings || 0,
      icon: "dollar-sign",
      bgColor: "bg-green-50",
      fontColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col flex-1 font-sans p-8">
      <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold text-gray-900
           text-shadow-lg"
          >
            Dashboard Overview
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {cardsData.map((card) => (
            <DataCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </div>
        <div>
          <SubscriptionTable
            subscriptions={stats?.subscriptions || []}
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
          />
        </div>
      </main>
    </div>
  );
}
