"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { getSystemLogs, deleteAllSystemLogs } from "../../../features/admin";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [time, setTime] = useState<string>("");
  const [isClearing, setIsClearing] = useState(false);

  const handleClearLogs = () => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-lg pointer-events-auto flex flex-col p-6 ring-1 ring-black ring-opacity-5`}>
          <div className="flex items-start gap-4">
            <div className="shrink-0 bg-red-100 rounded-full p-2">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-bold text-gray-900">
                Clear all system logs?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete all system logs? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6 w-full justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                setIsClearing(true);
                try {
                  const res = await deleteAllSystemLogs();
                  if (res.success) {
                    setLogs([]);
                    toast.success(res.message || "All logs deleted successfully");
                  }
                } catch (error: any) {
                  toast.error(error.message || "Failed to delete logs");
                } finally {
                  setIsClearing(false);
                }
              }}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Yes, delete all
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  useEffect(() => {
    async function fetchLogs() {
      const res = await getSystemLogs();
      if (res.success) {
        setLogs(res.data || []);
      }
    }
    fetchLogs();

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:3001";
    const socket: Socket = io(backendUrl, {
      withCredentials: true,
    });

    socket.on("new-system-log", (newLog: any) => {
      console.log("Received new log in real-time!", newLog);
      setLogs((prevLogs: any) => [newLog, ...prevLogs]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const time = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(time);
  }, []);
  
  return (
    <div className=" flex flex-col flex-1 font-sans p-8">
      <main className="flex flex-1 w-full flex-col max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-shadow-lg">
            System Logs
          </h1>
          <button
            onClick={handleClearLogs}
            disabled={isClearing || logs.length === 0}
            className="flex items-center gap-2 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
            {isClearing ? "Clearing..." : "Clear Logs"}
          </button>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-auto bg-gray-900 p-6 rounded-xl w-full shadow-lg border border-gray-800 flex flex-col gap-4">
          <p className="text-red-400 text-sm font-mono text-end border-b border-gray-800 pb-2">{time}</p>
          {logs.map((log: any, index: number) => (
            <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${log.level === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {log.level || 'info'}
                </span>
                <span className="text-gray-400 text-sm font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                {log.meta?.ip && <span className="text-gray-500 text-sm ml-auto font-mono">IP: {log.meta.ip}</span>}
              </div>
              <p className="text-base font-medium text-gray-100">{log.message}</p>
              {(log.meta?.method || log.meta?.url) && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  {log.meta?.method && <span className="font-mono text-purple-400 bg-purple-400/10 px-1.5 rounded">{log.meta.method}</span>}
                  {log.meta?.url && <span className="font-mono text-gray-400">{log.meta.url}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
