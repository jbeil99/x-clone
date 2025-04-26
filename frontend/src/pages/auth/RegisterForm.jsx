import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Calendar, AtSign, Lock, Phone } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";
import { registerUser } from "../../api/users"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';


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

export default function RegisterForm({ toggleForm }) {
  const [backErrors, setBackErrors] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
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
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    const submitData = new FormData();

    Object.keys(data).forEach(key => {
      submitData.append(key, data[key]);
    });

    try {
      const result = await registerUser(submitData);
      if (result) {
        navigate("/login");
        toast(`Registration successful! check ${result.email} to activate the account`);
      }
    } catch (error) {
      console.log(error.response.data);
      for (const k in error.response.data) {
        if (k === 'non_field_errors') {
          setBackErrors(error.response.data);
        } else {
          setError(k, {
            type: 'manual',
            message: error.response.data[k].join("/n")
          })
        }

      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-black rounded-lg p-6 border border-gray-800">
        <div className="flex justify-center mb-6">
          <FaXTwitter size={40} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:underline ml-1"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}