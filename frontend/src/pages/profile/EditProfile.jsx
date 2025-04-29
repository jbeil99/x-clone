import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import * as z from "zod";

// Validation schema using zod
const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  bio: z.string().max(255, { message: "Bio must not exceed 255 characters" }),
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

// API call to update profile
export const updateProfile = async (formData) => {
  const token = sessionStorage.getItem("access");
  const response = await axios.patch("http://127.0.0.1:8000/profile/edit/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const EditProfile = ({ user, close, refetchProfileData }) => {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
  const [coverPreview, setCoverPreview] = useState(user.cover_image || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      avatar: null,
      cover_image: null,
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar[0]);
    if (data.cover_image) formData.append("cover_image", data.cover_image[0]);

    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      refetchProfileData(); // Refresh user data
      close(); // Close the modal
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#202327] h-[700px] w-[600px] rounded-md">
        <button onClick={close}>
          <AiOutlineCloseCircle className="text-white text-2xl absolute top-3 right-3 cursor-pointer" />
        </button>
        <div className="flex min-h-full items-center justify-center sm:px-6 lg:px-8">
          <div className="m-1 p-1">
            <div className="w-[300px] max-w-md space-y-8 md:w-[400px] lg:w-[400px]">
              <h2 className="mt-6 text-center text-3xl text-grey">Edit Profile</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Field */}
                <input
                  id="name"
                  {...register("name")}
                  placeholder="Your Name"
                  className="border-b-[1px] border-neutral-800 w-full p-5 cursor-pointer my-3 bg-transparent outline-neutral-800"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}

                {/* Bio Field */}
                <textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="About you"
                  className="border-b-[1px] border-neutral-800 w-full p-5 cursor-pointer my-3 bg-transparent outline-neutral-800"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message}</p>
                )}

                {/* Avatar Field */}
                <input
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setValue("avatar", event.target.files);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                  className="my-4"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-24 h-24 object-cover rounded-full mx-auto my-2"
                  />
                )}
                {errors.avatar && (
                  <p className="text-red-500 text-sm">{errors.avatar.message}</p>
                )}

                {/* Cover Image Field */}
                <input
                  type="file"
                  accept="image/*"
                  {...register("cover_image")}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setValue("cover_image", event.target.files);
                    setCoverPreview(URL.createObjectURL(file));
                  }}
                  className="my-3"
                />
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-32 object-cover rounded-md mx-auto my-2"
                  />
                )}
                {errors.cover_image && (
                  <p className="text-red-500 text-sm">{errors.cover_image.message}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-sky-700 mt-11 my-2 w-full hover:bg-sky-500 p-2 px-5 rounded-full text-white font-bold"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
