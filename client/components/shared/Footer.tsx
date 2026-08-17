import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link
            href="/"
            className="text-lg font-bold bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
          >
            PressIt
          </Link>
          <p className="text-sm text-gray-400 text-center">
            Compress images beautifully and securely. Zero storage, absolute privacy. No images are ever saved.
          </p>
        </div>

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} PressIt. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
