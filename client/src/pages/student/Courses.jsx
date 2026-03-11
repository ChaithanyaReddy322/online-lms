import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError)
    return (
      <p className="text-center text-red-500 py-10">
        Some error occurred while fetching courses.
      </p>
    );

  return (
    <section className="bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Our Courses
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Hand-picked courses to help you grow your skills
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;

/* ---------------- Skeleton ---------------- */

const CourseSkeleton = () => {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>

        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};
