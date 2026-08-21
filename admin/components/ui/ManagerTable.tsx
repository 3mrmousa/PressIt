import Link from "next/link";
import { User } from "../../features/admin/types";
import Pagination from "./Pagination";

export default function ManagerTable({
  managers,
  currentPage,
  totalPages,
}: {
  managers: User[];
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="w-full mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Managers</h3>
        <p className="text-sm text-gray-600">Total managers: {managers.length}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="px-6 py-4 font-medium text-center">Name</th>
              <th className="px-6 py-4 font-medium text-center">Email</th>
              <th className="px-6 py-4 font-medium text-center">Role</th>
              <th className="px-6 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {managers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No managers found.
                </td>
              </tr>
            ) : (
              managers.map((manager: User) => (
                <tr
                  key={manager._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <div className="font-medium text-gray-900">
                      {manager.firstName} {manager.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-center">
                    {manager.email}
                  </td>
                  <td className="px-6 py-4 capitalize flex justify-center">
                    <span className="text-green-600 bg-green-200 text-xs rounded-full p-2 font-medium w-fit">
                      {manager.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-center">
                    <Link
                      href={`/managers/${manager._id}`}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md cursor-pointer"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
