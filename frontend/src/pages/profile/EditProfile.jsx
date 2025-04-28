import axios from "axios";
import { useFormik } from "formik";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema using zod
const editProfileSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  bio: z.string().max(255, { message: "Bio must not exceed 255 characters" }),
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "Avatar must be less than 5MB",
    }),
  cover_image: z
    .instanceof(File)
    .optional()
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "Cover image must be less than 5MB",
    }),
});

export const updateProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch("http://127.0.0.1:8000/profile/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const EditProfile = ({ user, close }) => {
  const queryClient = useQueryClient();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user.username] });
      toast.success("Profile updated");
      close();
    },
    onError: (error) => {
      console.error("Error Response:", error.response || error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: user.name || "",
      bio: user.bio || "",
      avatar: null,
      cover_image: null,
    },
    validationSchema: zodResolver(editProfileSchema), // Use zod for validation
    onSubmit: (values) => {
      const { name, bio, avatar, cover_image } = values;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);
      if (cover_image) formData.append("cover_image", cover_image);

      updateProfileMutation.mutate(formData);
    },
  });

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

              <form onSubmit={formik.handleSubmit}>
                <input
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Your Name"
                  className="border-b-[1px] border-neutral-800 w-full p-5 cursor-pointer my-3 bg-transparent outline-neutral-800"
                />
                {formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}

                <textarea
                  id="bio"
                  name="bio"
                  onChange={formik.handleChange}
                  value={formik.values.bio}
                  placeholder="About you"
                  className="border-b-[1px] border-neutral-800 w-full p-5 cursor-pointer my-3 bg-transparent outline-neutral-800"
                />
                {formik.errors.bio && (
                  <p className="text-red-500 text-sm">{formik.errors.bio}</p>
                )}

                {/* Avatar Upload */}
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("avatar", file);
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
                {formik.errors.avatar && (
                  <p className="text-red-500 text-sm">{formik.errors.avatar}</p>
                )}

                {/* Cover Image Upload */}
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("cover_image", file);
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
                {formik.errors.cover_image && (
                  <p className="text-red-500 text-sm">{formik.errors.cover_image}</p>
                )}

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
