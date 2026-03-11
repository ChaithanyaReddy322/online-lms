import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`} className="group">
      <Card className="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition duration-300">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Level Badge */}
          <Badge className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            {course.courseLevel}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-1">
            {course.courseTitle}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {course.creator?.name}
            </span>
          </div>

          {/* Price */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              ₹{course.coursePrice}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
