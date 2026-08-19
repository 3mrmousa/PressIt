import { getHistory } from "@/features/compress/serverIndex";
import Image from "next/image";
import HistoryPagination from "@/components/history/HistoryPagination";
import DownloadButton from "@/components/history/DownloadButton";
import DeleteButton from "@/components/history/DeleteButton";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const data = await getHistory({ page: Number(page) || 1, limit: 8 });
  const history = data?.data?.history;
  const pages = data?.data?.pages;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-linear-to-b from-white to-purple-50 px-6 py-12 mt-12">
      <div className="w-full max-w-6xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">History</h1>
        <p className="text-gray-500 mb-8">
          View your past activities and processed files here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white rounded-2xl shadow-sm border border-purple-100 p-8 min-h-100">
          {history && history.length > 0 ? (
            history.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.images.compressedImage.secureUrl}
                    alt="Compressed result"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {item.ratio && (
                    <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-purple-400/30">
                      -{item.ratio}%
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-3 bg-gray-50/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Original</span>
                    <span className="font-semibold text-gray-700">
                      {item.originalSize}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
                    <span className="text-purple-600 font-medium">
                      Compressed
                    </span>
                    <span className="font-bold text-purple-700">
                      {item.compressedSize}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between 
                  "
                  >
                    <DeleteButton id={item._id} />
                    <p className="text-xs text-gray-400 text-center pt-1 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <DownloadButton
                      url={item.images.compressedImage.secureUrl}
                      imageName={item.originalName}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center min-h-50">
              <p className="text-gray-400 text-center">
                History content will be displayed here.
              </p>
            </div>
          )}
        </div>
        <HistoryPagination page={Number(page) || 1} pages={pages || 1} />
      </div>
    </div>
  );
}
