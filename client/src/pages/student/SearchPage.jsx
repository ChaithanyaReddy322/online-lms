import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses?.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Search Results
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing results for{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              “{query}”
            </span>
          </p>
        </div>

        {/* BODY */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* FILTER */}
          <aside className="w-full lg:w-1/4">
            <Filter handleFilterChange={handleFilterChange} />
          </aside>

          {/* RESULTS */}
          <main className="flex-1 space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <CourseSkeleton key={idx} />
              ))
            ) : isEmpty ? (
              <CourseNotFound />
            ) : (
              data?.courses?.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

/* ============================
   Empty State
============================ */
const CourseNotFound = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <AlertCircle className="text-red-500 h-12 w-12 mb-4" />
    <h2 className="text-xl font-semibold mb-2">
      No courses found
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Try changing filters or searching with a different keyword.
    </p>
    <Link to="/">
      <Button variant="outline">Browse All Courses</Button>
    </Link>
  </div>
);

/* ============================
   Skeleton Loader
============================ */
const CourseSkeleton = () => (
  <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
    <Skeleton className="h-28 w-48 rounded-md" />

    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-20 mt-2" />
    </div>

    <div className="flex items-end">
      <Skeleton className="h-6 w-12" />
    </div>
  </div>
);
