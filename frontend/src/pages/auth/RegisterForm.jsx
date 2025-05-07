import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Calendar, AtSign, Lock, Phone, Camera, ArrowLeft, ArrowRight } from 'lucide-react';
import { registerUser } from "../../api/users"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';

const registerSchema = z.object({
  display_name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobile_phone: z.string()
    .regex(/^(01)[0-2|5]{1}[0-9]{8}$/, {
      message: "Please enter a valid Egyptian phone number (e.g., 01xxxxxxxxx)"
    }),
  birthdate: z.string().refine(date => {
    const selectedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    return age >= 13;
  }, { message: "You must be at least 13 years old to register" }),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(15, { message: "Username must not exceed 15 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers and underscores" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  re_password: z.string()
    .min(1, { message: "Confirm password is required" })
}).refine((data) => data.password === data.re_password, {
  message: "Passwords do not match",
  path: ["re_password"],
});

export default function RegisterForm({ setDialogType }) {
  const [backErrors, setBackErrors] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: '',
      email: '',
      mobile_phone: '',
      birthdate: '',
      username: '',
      password: '',
      re_password: ''
    },
    mode: 'onChange'
  });

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const submitData = new FormData();

    // Add form data
    Object.keys(data).forEach(key => {
      submitData.append(key, data[key]);
    });

    if (profileImage) {
      submitData.append('avatar', profileImage);
    }

    try {
      const result = await registerUser(submitData);
      if (result) {
        toast(`Registration successful! Check ${result.email} to activate the account`);
      }
    } catch (error) {
      console.log(Object.values(error.response.data)
        .flat()
        .join("; "))
      let errorMessage;
      if (error.status == 400) {
        errorMessage = Object.values(error.response.data)
          .flat()
          .join("; ");
      }
      setBackErrors(errorMessage ? errorMessage : "unexpected error happend")
      setCurrentStep(1);


    } finally {
      setIsSubmitting(false);
      setDialogType()
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep === 1 ? 'bg-blue-500' : 'bg-blue-700'}`}>
          1
        </div>
        <div className="w-16 h-1 bg-gray-700">
          <div className={`h-full bg-blue-500`} style={{ width: currentStep > 1 ? '100%' : '0%' }}></div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${currentStep === 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>
          2
        </div>
      </div>
    </div>
  );

  return (
    <>
      <StepIndicator />

      {currentStep === 1 ? (
        // Step 1: Personal information
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Name"
                {...register("display_name")}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <Phone className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="tel"
                placeholder="Egyptian Phone Number (e.g., 01xxxxxxxxx)"
                {...register("mobile_phone")}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              />
              {errors.mobile_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile_phone.message}</p>
              )}
            </div>

            <div className="relative">
              <Calendar className="absolute top-3 left-3 text-gray-500" size={18} />
              <input
                type="date"
                placeholder="Birth date"
                {...register("birthdate")}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 text-gray-400"
              />
              {errors.birthdate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <AtSign className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("re_password")}
              className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
            />
            {errors.re_password && (
              <p className="text-red-500 text-sm mt-1">{errors.re_password.message}</p>
            )}
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <span>Next</span>
            <ArrowRight className="ml-2" size={18} />
          </button>
        </form>
      ) : (
        // Step 2: Profile Image
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center space-y-6">
            <h3 className="text-lg font-medium text-white">Add Profile Picture</h3>
            <p className="text-gray-400">Upload a profile photo (optional)</p>

            {/* Image preview */}
            <div className="mb-6">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-800 mx-auto flex items-center justify-center border-2 border-dashed border-gray-600">
                  <Camera size={40} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* File input */}
            <div className="flex justify-center mb-4">
              <label className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer inline-flex items-center transition duration-300">
                <Camera size={18} className="mr-2" />
                <span>Choose Image</span>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Navigation buttons */}
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2" size={18} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Sign up"}
              </button>
            </div>
          </div>
        </form>
      )}

      {backErrors && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mt-4">
          <p > {backErrors}</p>
        </div>
      )}
    </>
  );
}