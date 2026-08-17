import Link from "next/link";

export const Button = ({
  children,
  className,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) => {
  const commonClasses = `bg-linear-to-r from-purple-600 to-purple-400 rounded-full
       px-6 py-3 cursor-pointer text-white hover:scale-105 hover:shadow-lg
       hover:shadow-purple-500/40 transition-all duration-300 inline-block text-center ${className || ""}`;

  if (href) {
    return (
      <Link href={href} className={commonClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={commonClasses}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
