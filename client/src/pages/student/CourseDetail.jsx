import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";

import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to load course details</h1>;

  const course = data?.course;
  const purchased = data?.purchased;

  const handleContinueCourse = () => {
    if (purchased) navigate(`/course-progress/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      {/* ================= HERO HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col items-start gap-4 max-w-4xl">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {course?.courseTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-indigo-100 text-sm md:text-base">
              {course?.subTitle || "Master new skills with this course"}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-100">
              <span>
                Created by{" "}
                <span className="font-semibold underline">
                  {course?.creator?.name}
                </span>
              </span>

              <span className="flex items-center gap-1">
                <BadgeInfo size={14} />
                {course?.createdAt?.split("T")[0]}
              </span>

              <span>
                {course?.enrolledStudents?.length || 0} students enrolled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              About this course
            </h2>
            <div
              className="prose dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: course?.description || "",
              }}
            />
          </section>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course?.lectures?.length || 0} lectures
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture) => (
                <div
                  key={lecture._id}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {lecture.isPreviewFree || purchased ? (
                    <PlayCircle
                      size={16}
                      className="text-green-500"
                    />
                  ) : (
                    <Lock size={16} />
                  )}
                  <span>{lecture.lectureTitle}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-4 space-y-4">
              {course?.lectures?.[0]?.videoUrl && (
                <div className="aspect-video rounded-md overflow-hidden">
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={course.lectures[0].videoUrl}
                    controls
                  />
                </div>
              )}

              <h3 className="font-semibold">
                {course?.lectures?.[0]?.lectureTitle ||
                  "Preview Lecture"}
              </h3>

              <Separator />

              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                ₹{course?.coursePrice}
              </div>
            </CardContent>

            <CardFooter>
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full"
                >
                  Continue Learning
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
