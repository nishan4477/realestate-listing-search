import Link from "next/link";

interface BreadcrumbProps {
  title: string;
}

export const Breadcrumb = ({ title }: BreadcrumbProps) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="hover:text-indigo-600 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Listings
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
};
