export const BodyText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`text-lg text-gray-600 ${className}`}>{children}</div>;
};
