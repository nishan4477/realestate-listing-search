"use client";

import { AppControllerGetListingsQueryParams } from "@/app/_generated/api/realEstateApiComponents";
import { useEffect, useState } from "react";

interface FilterBarProps {
  initialFilters: AppControllerGetListingsQueryParams;
  onApply: (filters: AppControllerGetListingsQueryParams) => void;
}

export const FilterBar = ({ initialFilters, onApply }: FilterBarProps) => {
  const [filters, setFilters] =
    useState<AppControllerGetListingsQueryParams>(initialFilters);

  // Sync state if initialFilters change from URL (e.g. back button)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (
    key: keyof AppControllerGetListingsQueryParams,
    value: string | number | boolean | undefined,
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Clean up empty strings or nulls to keep URL clean
      if (value === "" || value === "any") {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({});
    onApply({});
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by title, suburb..."
            className="block w-full text-black pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-colors sm:text-sm"
            value={filters.searchTerm || ""}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors font-medium text-sm"
          >
            Clear Filters
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md font-medium text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Property Type */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Property Type
          </label>
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            value={filters.propertyType || "any"}
            onChange={(e) => handleChange("propertyType", e.target.value)}
          >
            <option value="any">Any Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Beds */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Bedrooms
          </label>
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            value={filters.beds || "any"}
            onChange={(e) =>
              handleChange(
                "beds",
                e.target.value === "any" ? "any" : Number(e.target.value),
              )
            }
          >
            <option value="any">Any Beds</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>

        {/* Baths */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Bathrooms
          </label>
          <select
            className="block w-full py-2.5 px-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            value={filters.baths || "any"}
            onChange={(e) =>
              handleChange(
                "baths",
                e.target.value === "any" ? "any" : Number(e.target.value),
              )
            }
          >
            <option value="any">Any Baths</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3 Baths</option>
            <option value="4">4+ Baths</option>
          </select>
        </div>

        {/* Min Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Min Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">रू</span>
            </div>
            <input
              type="number"
              placeholder="Min"
              min="0"
              className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors sm:text-sm"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleChange(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : "",
                )
              }
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Max Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">रू</span>
            </div>
            <input
              type="number"
              placeholder="Max"
              min="0"
              className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors sm:text-sm"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleChange(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : "",
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100 gap-4">
        {/* Sorting */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          <div className="space-y-1">
            <select
              className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 cursor-pointer"
              value={filters.sortBy || "createdAt"}
              onChange={(e) => handleChange("sortBy", e.target.value)}
            >
              <option value="createdAt">Date Listed</option>
              <option value="price">Price</option>
              <option value="beds">Bedrooms</option>
              <option value="baths">Bathrooms</option>
            </select>
          </div>
          <div className="space-y-1">
            <select
              className="block w-full py-2 px-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 cursor-pointer"
              value={filters.sortOrder || "desc"}
              onChange={(e) => handleChange("sortOrder", e.target.value)}
              disabled={!filters.sortBy}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Admin Toggle */}
        <div className="w-full sm:w-auto flex items-center">
          <label className="flex items-center cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!filters.isAdmin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("isAdmin", e.target.checked)
                }
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${filters.isAdmin ? "bg-indigo-600" : "bg-gray-300"}`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${filters.isAdmin ? "transform translate-x-4" : ""}`}
              ></div>
            </div>
            <div className="ml-3 text-sm font-semibold text-gray-700 flex items-center">
              Admin View
              <svg
                className="w-4 h-4 ml-1 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.984 3.984 0 01-2.673-1.033c-.113.506-.576.883-1.127.883H8.8c-.55 0-1.014-.377-1.127-.883A3.984 3.984 0 015 15a3.989 3.989 0 01-2.673-1.033 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5.824 9.192l-1.296-4.043 2.115 1.058a1 1 0 01.554.55L6.5 11h-2.32zM15.5 11l.951-2.246a1 1 0 01.554-.55l2.115-1.058-1.296 4.043H15.5H15.5zM12.196 5.378L10 6.257l-2.196-.879L10 3.737l2.196 1.641zM6.617 11.5l1.5-3.5L10 8l1.883 0 1.5 3.5h-6.766z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
