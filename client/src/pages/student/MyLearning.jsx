import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user?.enrolledCourses || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            My Learning
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Continue where you left off
          </p>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myLearning.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

/* ============================
   Skeleton Loader
============================ */
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-48 rounded-xl bg-gray-200 dark:bg-slate-800 animate-pulse"
      />
    ))}
  </div>
);

/* ============================
   Empty State
============================ */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h2 className="text-lg font-semibold mb-2">
      You haven’t enrolled in any courses yet
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Explore courses and start learning today 🚀
    </p>
  </div>
);
