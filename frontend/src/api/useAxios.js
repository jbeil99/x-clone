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
    const access = sessionStorage.getItem('access')

    config.headers = {
        'Authorization': `Bearer ${access}`,
    }

    const decoded = jwtDecode(access)

    const exp = new Date(decoded.exp * 1000)
    const now = new Date()
    const five = 1000 * 60 * 5

    if (exp.getTime() - now.getTime() < five) {

        try {
            const oldRefresh = sessionStorage.getItem('refresh')
            const res = await axi.post('/jwt/refresh/', { oldRefresh })
            const { access, refresh } = res.data

            sessionStorage.setItem('access', access)
            sessionStorage.setItem('refresh', refresh)

        } catch (err) {
            sessionStorage.clear()
            window.location.href = '/login'
        }
    } else {
        return config
    }

    return config
})






