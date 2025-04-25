import { axi, authAxios } from "./useAxios";

// TODO: Get the user id form token
export const userProfile = async (username) => {
    const res = await authAxios.get(`auth/users/${username}/`)
    return res.data
}

export const register = async (data) => {
    await axi.post('/users/register/', data)
}

export const login = async (data) => {
    const res = await axi.post('auth/jwt/create/', data)
    const { access, refresh } = res.data

    sessionStorage.setItem('access', access)
    sessionStorage.setItem('refresh', refresh)
}


export const currentUser = async () => {
    const res = await authAxios.get(`/users/me`)
    return res.data
}