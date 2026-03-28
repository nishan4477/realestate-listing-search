import { ListingItemDto } from "@/app/_generated/api/realEstateApiSchemas";
import Link from "next/link";

interface ListingCardProps {
  listing: ListingItemDto;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link href={`/listing/${listing.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col border border-gray-100">
        <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0].url} 
              alt={listing.title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
              No Image
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {listing.propertyType}
          </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
          <p className="text-gray-500 mb-4 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {listing.suburb}
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span>{listing.beds} Beds</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                <span>{listing.baths} Baths</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
              <span className="text-2xl font-bold text-indigo-600">
                NPR {listing.price.toLocaleString()}
              </span>
              <span className="text-indigo-600 font-medium group-hover:underline flex items-center">
                View details
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
