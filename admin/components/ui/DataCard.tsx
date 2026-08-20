import { Users, UserCog, UserCircle, CheckCircle, XCircle, DollarSign, LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: number | string;
  icon: string;
  bgColor?: string;
  fontColor?: string;
}

const iconMap: Record<string, LucideIcon> = {
  "users": Users,
  "user-tie": UserCog,
  "user-circle": UserCircle,
  "check-circle": CheckCircle,
  "times-circle": XCircle,
  "dollar-sign": DollarSign,
};

export default function DataCard({ title, value, icon }: DataCardProps) {
  const IconComponent = iconMap[icon] || Users;
  
  const displayValue = icon === "dollar-sign" 
    ? `$${Number(value).toLocaleString()}`
    : Number(value).toLocaleString();

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">
            {displayValue}
          </h3>
        </div>
        <div className="p-3 rounded-lg text-purple-600">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-purple-500" />
    </div>
  );
}
