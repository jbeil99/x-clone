import { axi, authAxios } from "./useAxios";

// TODO: Get the user id form token
export const userProfile = async (username) => {
    const res = await authAxios.get(`auth/users/${username}/`)
    return res.data
}

export const registerUser = async (data) => {
    const res = await axi.post('/auth/users/', data)
    return res.data
}

export const login = async (data) => {
    const res = await axi.post('auth/jwt/create/', data)
    const { access, refresh } = res.data

    sessionStorage.setItem('access', access)
    sessionStorage.setItem('refresh', refresh)
    const user = await currentUser()
    return user
}


export const currentUser = async () => {
    const res = await authAxios.get(`auth/users/me`)
    return res.data
}

import axios from "axios";

export const updateProfile = async (formData) => {
  const response = await axios.patch("http://127.0.0.1:8000/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Keep the Content-Type for file uploads
    },
  });
  return response.data;
};