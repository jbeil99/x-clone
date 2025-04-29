import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { useSelector } from "react-redux";
import { updateProfile } from "../../api/users";
import { Camera, X, Calendar } from "lucide-react";
import { format } from "date-fns";

// Import shadcn components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  bio: z.string().max(255, { message: "Bio must not exceed 255 characters" }),
  location: z.string().optional(),
  date_of_birth: z.string().optional(), // Made optional without age restriction
  avatar: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      { message: "Avatar must be less than 5MB" }
    )
    .optional(),
  cover_image: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      { message: "Cover image must be less than 5MB" }
    )
    .optional(),
});

const EditProfile = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.display_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      date_of_birth: user?.date_of_birth || "", // Initialize from user data if exists
      avatar: null,
      cover_image: null,
    },
  });

  // Set initial previews from user data on component mount
  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarPreview(user.avatar_url);
    }

    if (user?.cover_image) {
      setCoverPreview(user.cover_image);
    }

    // Set the date_of_birth field with user data if it exists
    if (user?.date_of_birth) {
      setValue("date_of_birth", user.date_of_birth);
    }
  }, [user, setValue]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("avatar", file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("cover_image", file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-black text-white border-gray-800">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-4">
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Edit profile</DialogTitle>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-1 bg-white text-black rounded-full hover:bg-gray-200"
          >
            Save
          </Button>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* Cover Image */}
          <div className="relative w-full h-48 bg-gray-900">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-48 object-cover"
              />
            ) : null}

            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                onClick={() => coverInputRef.current.click()}
                className="w-10 h-10 bg-black bg-opacity-60 rounded-full p-0 hover:bg-opacity-80"
              >
                <Camera className="h-5 w-5" />
              </Button>

              {coverPreview && (
                <Button
                  variant="ghost"
                  onClick={() => setCoverPreview(null)}
                  className="w-10 h-10 bg-black bg-opacity-60 rounded-full p-0 ml-4 hover:bg-opacity-80"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          {/* Avatar */}
          <div className="relative ml-4 -mt-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full border-4 border-black overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            <Button
              variant="ghost"
              onClick={() => avatarInputRef.current.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-black bg-opacity-60 rounded-full p-0 hover:bg-opacity-80"
            >
              <Camera className="h-4 w-4" />
            </Button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="p-6 mt-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-400 text-sm">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="bg-transparent border-0 border-b border-gray-800 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-600"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-400 text-sm">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="bg-transparent border-0 border-b border-gray-800 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-600 resize-none min-h-24"
              />
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio.message}</p>
              )}
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-400 text-sm">Location</Label>
              <Input
                id="location"
                {...register("location")}
                className="bg-transparent border-0 border-b border-gray-800 rounded-none px-0 focus-visible:ring-0 focus-visible:border-gray-600"
              />
            </div>

            {/* Birthday Field */}
            <div className="space-y-2 relative">
              <Label htmlFor="date_of_birth" className="text-gray-400 text-sm">Birth date (optional)</Label>
              <div className="relative">
                <Calendar className="absolute top-3 left-3 text-gray-500" size={18} />
                <input
                  id="date_of_birth"
                  type="date"
                  {...register("date_of_birth")}
                  className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 text-gray-400"
                />
              </div>
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;