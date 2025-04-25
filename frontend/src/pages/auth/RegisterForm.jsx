// RegisterForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Calendar, AtSign, Lock } from 'lucide-react';
import { FaXTwitter } from "react-icons/fa6";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
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
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
});

export default function RegisterForm({ toggleForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      birthdate: '',
      username: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    alert("Registration successful!");
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
                {...register("name")}
                className="w-full p-2 pl-10 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
          >
            Sign up
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