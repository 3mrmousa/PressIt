import { getAdminStats } from "../../features/admin/serverIndex";
import DataCard from "../../components/ui/DataCard";
import SubscriptionTable from "../../components/ui/SubscriptionTable";

export default async function Dashboard() {
  const { data: stats } = await getAdminStats();
  console.log("stats", stats);

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
    <div className="min-h-screen flex flex-col flex-1 bg-zinc-50 font-sans p-8">
      <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold text-gray-900
           text-shadow-lg text-shadow-purple-300"
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
          <SubscriptionTable subscriptions={stats?.subscriptions || []} />
        </div>
      </main>
    </div>
  );
}
