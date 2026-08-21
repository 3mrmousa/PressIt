import ManagerTable from "../../../components/ui/ManagerTable";
import { getAllManagers } from "../../../features/admin/serverIndex";
import CreateManager from "../../../components/ui/CreateManager";

export default async function ManagersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const { data: managers, pagination } = await getAllManagers(page, limit);

  return (
    <div className="min-h-screen flex flex-col flex-1 font-sans p-8">
      <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 text-shadow-lg"
          >
            Managers Page
          </h1>
          <CreateManager />
        </div>
        <div>
          <ManagerTable
            managers={managers?.managers || []}
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
          />
        </div>
      </main>
    </div>
  );
}
