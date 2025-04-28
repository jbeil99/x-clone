import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = import.meta.env.VITE_BACKEND_URL

export const axi = axios.create({
    baseURL,
})

export const authAxios = axios.create({
    baseURL,
    withCredentials: true,
})

authAxios.interceptors.request.use(async (config) => {
  const access = sessionStorage.getItem("access");
  const refresh = sessionStorage.getItem("refresh");

  if (access) {
    const decoded = jwtDecode(access);
    const exp = new Date(decoded.exp * 1000);
    const now = new Date();

    if (exp.getTime() < now.getTime()) {
      // إذا انتهت صلاحية رمز الوصول، قم بتحديثه
      try {
        const response = await axi.post("/auth/jwt/refresh/", { refresh });
        const { access: newAccess } = response.data;
        sessionStorage.setItem("access", newAccess);
        config.headers.Authorization = `Bearer ${newAccess}`;
      } catch (error) {
        console.error("Failed to refresh token:", error.response || error);
        sessionStorage.clear();
        window.location.href = "/login"; // إعادة التوجيه إلى صفحة تسجيل الدخول
      }
    } else {
      config.headers.Authorization = `Bearer ${access}`;
    }
  }

  return config;
});






