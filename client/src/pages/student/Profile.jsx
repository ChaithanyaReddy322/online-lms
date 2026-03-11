import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

/* ============================
    PROFILE PAGE
============================ */
const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data, isLoading } = useLoadUserQuery();
  const user = data?.user;

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  /* ============================
      Initialize form values
  ============================ */
  useEffect(() => {
    if (user?.name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name);
    }
  }, [user]);

  /* ============================
      Feedback
  ============================ */
  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile updated");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, error, updateUserData]);

  /* ============================
      Helpers
  ============================ */
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  /* ============================
      Normalize enrolled courses
      (🔥 fixes your crash)
  ============================ */
  const enrolledCourses = Array.isArray(user?.enrolledCourses)
    ? user.enrolledCourses
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your personal information
          </p>
        </div>

        {/* PROFILE CARD */}
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28">
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <Info label="Name" value={user?.name} />
              <Info label="Email" value={user?.email} />
              <Info label="Role" value={user?.role?.toUpperCase()} />

              {/* Edit Profile */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="mt-3">
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your account information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label>Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label>Profile Photo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={onChangeHandler}
                        className="col-span-3"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      disabled={updateUserIsLoading}
                      onClick={updateUserHandler}
                    >
                      {updateUserIsLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* ENROLLED COURSES */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Enrolled Courses
          </h2>

          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You haven’t enrolled in any courses yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {enrolledCourses.map((course) => (
                <Course key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

/* ============================
    Reusable Info Row
============================ */
const Info = ({ label, value }) => (
  <div className="text-sm">
    <span className="font-medium text-gray-900 dark:text-gray-100">
      {label}:
    </span>
    <span className="ml-2 text-gray-700 dark:text-gray-300">
      {value || "-"}
    </span>
  </div>
);

export default Profile;
