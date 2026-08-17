export function HeaderStyled({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`font-bold bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </div>
  );
}
