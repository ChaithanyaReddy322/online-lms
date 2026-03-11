import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  /* ============================
      Side effects
  ============================ */
  useEffect(() => {
    if (completedSuccess && markCompleteData) {
      toast.success(markCompleteData.message);
      refetch();
    }
    if (inCompletedSuccess && markInCompleteData) {
      toast.success(markInCompleteData.message);
      refetch();
    }
  }, [
    completedSuccess,
    inCompletedSuccess,
    markCompleteData,
    markInCompleteData,
    refetch,
  ]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  const courseDetails = data?.data?.courseDetails;
  const progress = data?.data?.progress || [];
  const completed = data?.data?.completed || false;

  const initialLecture =
    currentLecture || courseDetails?.lectures?.[0];

  const isLectureCompleted = (lectureId) =>
    progress.some(
      (prog) => prog.lectureId === lectureId && prog.viewed
    );

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f]">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-900 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">
            {courseDetails?.courseTitle}
          </h1>

          <Button
            onClick={
              completed
                ? () => inCompleteCourse(courseId)
                : () => completeCourse(courseId)
            }
            variant={completed ? "outline" : "default"}
          >
            {completed ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            ) : (
              "Mark as completed"
            )}
          </Button>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VIDEO PLAYER */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            {initialLecture && (
              <video
                src={currentLecture?.videoUrl || initialLecture.videoUrl}
                controls
                className="w-full aspect-video bg-black"
                onPlay={() =>
                  handleLectureProgress(
                    currentLecture?._id || initialLecture._id
                  )
                }
              />
            )}
          </Card>

          <h2 className="text-lg font-semibold">
            {currentLecture?.lectureTitle ||
              initialLecture?.lectureTitle}
          </h2>
        </div>

        {/* LECTURE LIST */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Course Lectures
          </h2>

          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {courseDetails?.lectures?.map((lecture, index) => {
              const active =
                lecture._id === currentLecture?._id;

              return (
                <Card
                  key={lecture._id}
                  onClick={() => handleSelectLecture(lecture)}
                  className={`cursor-pointer transition border ${
                    active
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <CirclePlay className="text-gray-400" />
                      )}

                      <div>
                        <CardTitle className="text-sm font-medium">
                          {index + 1}. {lecture.lectureTitle}
                        </CardTitle>
                      </div>
                    </div>

                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-600"
                      >
                        Done
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
