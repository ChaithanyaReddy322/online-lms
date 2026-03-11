import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import API from "@/lib/api";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";



const LectureTab = () => {
  const { courseId, lectureId } = useParams();

  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setMediaProgress(true);

    try {
      const res = await API.post(`/api/v1/media/upload-video`, formData, {
        onUploadProgress: ({ loaded, total }) => {
          setUploadProgress(Math.round((loaded * 100) / total));
        },
      });

      if (res.data.success) {
        setUploadVideoInfo({
          videoUrl: res.data.data.url,
          publicId: res.data.data.public_id,
        });
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Video upload failed");
    } finally {
      setMediaProgress(false);
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message);
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update lecture");
    }
  }, [isSuccess, error, data]);

  useEffect(() => {
    if (removeSuccess && removeData) {
      toast.success(removeData.message);
    }
  }, [removeSuccess, removeData]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button
          disabled={removeLoading}
          variant="destructive"
          onClick={removeLectureHandler}
        >
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Ex. Introduction to Javascript"
          />
        </div>

        <div className="my-5">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit"
          />
        </div>

        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} />
          <Label>Is this video FREE</Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <Button disabled={isLoading} onClick={editLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
