export const Tag = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`font-semibold text-sm text-gray-600 bg-white shadow-lg shadow-purple-500/30 rounded-full px-3 py-1 ${className}`}
    >
      {children}
    </div>
  );
};
