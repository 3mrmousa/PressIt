import React from "react";

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function MyButton({
  children,
  className = "",
  ...props
}: MyButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg bg-purple-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";
  const finalClasses = `${baseClasses} ${className}`;

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
}
