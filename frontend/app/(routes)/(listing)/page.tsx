"use client";

import {
  AppControllerGetListingsQueryParams,
  useAppControllerGetListings,
} from "@/app/_generated/api/realEstateApiComponents";
import { FilterBar, ListingCard } from "@/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type PropertyType = "house" | "apartment" | "townhouse" | "land" | "commercial";

type SortBy = "price" | "createdAt" | "beds" | "baths";

type SortOrder = "asc" | "desc";

function ListingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Extract initial filters from search parameters
  const getInitialFilters = () => {
    const filters: AppControllerGetListingsQueryParams = {};
    if (searchParams.has("searchTerm"))
      filters.searchTerm = searchParams.get("searchTerm")!;
    if (searchParams.has("propertyType"))
      filters.propertyType = searchParams.get("propertyType") as PropertyType;
    if (searchParams.has("beds"))
      filters.beds = Number(searchParams.get("beds"));
    if (searchParams.has("baths"))
      filters.baths = Number(searchParams.get("baths"));
    if (searchParams.has("minPrice"))
      filters.minPrice = Number(searchParams.get("minPrice"));
    if (searchParams.has("maxPrice"))
      filters.maxPrice = Number(searchParams.get("maxPrice"));
    if (searchParams.has("sortBy"))
      filters.sortBy = searchParams.get("sortBy") as SortBy;
    if (searchParams.has("sortOrder"))
      filters.sortOrder = searchParams.get("sortOrder") as SortOrder;
    if (searchParams.has("isAdmin"))
      filters.isAdmin = searchParams.get("isAdmin") === "true";
    return filters;
  };

  const initialFilters = getInitialFilters();

  const { data, isLoading, isError, error } = useAppControllerGetListings({
    queryParams: initialFilters,
  });

  const handleApplyFilters = (
    newFilters: AppControllerGetListingsQueryParams,
  ) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 sm:text-5xl">
          Property Listings
        </h1>

        <FilterBar
          initialFilters={initialFilters}
          onApply={handleApplyFilters}
        />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xl font-semibold text-gray-400 animate-pulse">
              Loading listings...
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center bg-white rounded-2xl border border-red-100 shadow-sm">
            <div className="text-xl font-semibold text-red-500">
              Error:{" "}
              {error instanceof Error
                ? error?.message
                : "Could not load listings."}
            </div>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            No listings found matching your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.data.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isAdmin={initialFilters.isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-xl font-semibold text-gray-500 animate-pulse">
            Loading app...
          </div>
        </div>
      }
    >
      <ListingPageContent />
    </Suspense>
  );
}
