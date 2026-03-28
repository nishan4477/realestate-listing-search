"use client";

import { useAppControllerGetListings } from "@/app/_generated/api/realEstateApiComponents";
import { ListingCard } from "@/components";

export default function ListingPage() {
  const { data, isLoading, isError, error } = useAppControllerGetListings({});

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading listings...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-red-500">
          Error loading listings: {(error as any)?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  const listings = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 sm:text-5xl">
          Property Listings
        </h1>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            No listings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
