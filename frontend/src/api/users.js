import { axi, authAxios } from "./useAxios";

// TODO: Get the user id form token
// export const getUserProfile = async (username) => {
//     const res = await authAxios.get(`profile/`)
//     return res.data
// }

export const getUserByUsername = async (username) => {
    let res;
    if (username) {
        res = await authAxios.get(`profile/${username}/`)
    } else {
        res = await authAxios.get('/auth/users/me',)
    }
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

export const googleLogin = async (credentialResponse) => {
    const res = await axi.post('auth/google/', { token: credentialResponse.credential })
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



export const updateProfile = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar);
    if (data.cover_image) formData.append("cover_image", data.cover_image);
    console.log(formData)
    const res = await authAxios.patch('profile/edit/', formData, {

        headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
}



export const getWhoToFollow = async () => {
    const res = await authAxios.get(`who-to-follow/`)
    return res.data
}

export const follow = async (username) => {
    const res = await authAxios.post(`user/${username}/follow/`)
    return res.data
}

export const followers = async (username) => {
    const res = await authAxios.get(`user/${username}/followers`)
    return res.data
}
export const followings = async (username) => {
    const res = await authAxios.get(`user/${username}/following`)
    return res.data
}