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

export const activateAccount = async (uid, token) => {
    const res = await axi.post('auth/users/activation/', {
        uid,
        token,
    });
    return res
};