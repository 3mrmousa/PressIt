export function HeaderText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-7xl font-bold text-black rounded-full px-3 py-1 ${className}`}
    >
      {children}
    </div>
  );
}
