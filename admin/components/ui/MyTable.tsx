import Pagination from "./Pagination";

export default function MyTable({
  title = "Data",
  cols,
  data,
  currentPage,
  totalPages,
}: {
  title?: string;
  cols?: string[];
  data?: any[];
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="w-full mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              {cols &&
                cols.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 font-medium text-center">
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text0center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              data.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {(Array.isArray(row) ? row : Object.values(row)).map((item: any, colIndex: number) => (
                    <td key={colIndex} className="px-6 py-4 text-center">
                      <div className="font-medium text-gray-900">{item}</div>
                    </td>
                  ))}
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
