import Link from "next/link";
import React from "react";

interface MyLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function MyLink({
  href,
  children,
  className = "",
  ...props
}: MyLinkProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg bg-purple-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";
  const finalClasses = `${baseClasses} ${className}`;

  return (
    <Link href={href} className={finalClasses} {...props}>
      {children}
    </Link>
  );
}
