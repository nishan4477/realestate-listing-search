"use client";

import { useAppControllerGetListingById } from "@/app/_generated/api/realEstateApiComponents";
import { Breadcrumb } from "@/components";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ListingDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isAdmin = searchParams.get("isAdmin") === "true";

  const { data, isLoading, isError, error } = useAppControllerGetListingById({
    pathParams: { id },
    queryParams: { isAdmin },
  });

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-indigo-500 animate-pulse">
          Loading property details...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error loading property
          </h2>
          <p className="text-gray-500 mb-6">
            {error instanceof Error
              ? error.message
              : "The property could not be found or an error occurred."}
          </p>
          <Link
            href="/listing"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full"
          >
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const listing = data?.data;

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-500">
          Property not found.
        </div>
      </div>
    );
  }

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <Breadcrumb title={listing.title} />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                {listing.propertyType}
              </span>
              <span className="flex items-center text-gray-500 text-sm">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                {listing.suburb}
              </span>
              {isAdmin && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200 ml-2">
                  Admin View
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {listing.title}
            </h1>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Asking Price
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-indigo-600">
              NPR {listing.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Images & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl p-2 sm:p-4 shadow-sm border border-gray-100">
              <div className="aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-gray-100 relative mb-4 flex items-center justify-center">
                {hasImages ? (
                  <img
                    src={listing.images[activeImage].url}
                    alt={`Property image ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg
                      className="w-20 h-20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {hasImages && listing.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {listing.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? "border-indigo-600 shadow-md ring-2 ring-indigo-600 ring-offset-2" : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"}`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Description
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-600 text-lg leading-relaxed">
                {listing.description ? (
                  <p className="whitespace-pre-line">{listing.description}</p>
                ) : (
                  <p className="italic text-gray-400">
                    No description provided for this property.
                  </p>
                )}
              </div>
            </div>

            {/* Internal Notes (Admins Only) */}
            {isAdmin && listing.internalNotes && (
              <div className="bg-yellow-50 rounded-3xl p-6 shadow-sm border border-yellow-200 mt-8">
                <div className="flex items-center mb-4 text-yellow-800">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <h3 className="font-bold">Internal Notes</h3>
                </div>
                <p className="text-yellow-700 text-sm whitespace-pre-line">
                  {listing.internalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Details & Action */}
          <div className="space-y-8">
            {/* Quick Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Property Overview
              </h3>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl">
                  <span className="flex items-center text-sm font-medium text-gray-500 mb-1">
                    <svg
                      className="w-5 h-5 mr-1"
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
                    Bedrooms
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {listing.beds}
                  </span>
                </div>

                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl">
                  <span className="flex items-center text-sm font-medium text-gray-500 mb-1">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      ></path>
                    </svg>
                    Bathrooms
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {listing.baths}
                  </span>
                </div>

                <div className="flex flex-col bg-gray-50 p-4 rounded-2xl col-span-2">
                  <span className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {listing.suburb}
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mt-6">
                Property ID:{" "}
                <span className="font-mono">
                  {listing.id.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `,
        }}
      />
    </div>
  );
}

export default function ListingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-xl font-semibold text-gray-500 animate-pulse">
            Loading property...
          </div>
        </div>
      }
    >
      <ListingDetailContent />
    </Suspense>
  );
}
