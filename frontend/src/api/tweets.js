import { authAxios } from "./useAxios";

export const getTweets = async () => {
    const res = await authAxios.get(`tweets`)
    return res.data
}
export const getTweetByID = async (id) => {
    const res = await authAxios.get(`tweets/${id}`)
    return res.data
}

export const getTweetReplies = async (id) => {
    const res = await authAxios.get(`tweets/${id}/replies`)
    return res.data
}
export const addTweet = async (data, parent = null) => {
    console.log(parent)
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.media) {
        formData.append('media', data.media);
    }
    if (parent) {
        formData.append('parent', parent);
    }

    const res = await authAxios.post('tweets', formData, {

        headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
}

export const likeTweet = async (id) => {
    const res = await authAxios.post(`tweets/${id}/likes`)
    return res.data
}

export const retweet = async (id) => {
    const res = await authAxios.post(`tweets/${id}/retweet/`)
    return res.data
}

export const bookmark = async (id) => {
    const res = await authAxios.post(`tweets/${id}/bookmark/`)
    return res.data
}

export const getBookmarks = async () => {
    const res = await authAxios.get(`bookmarks/`)
    return res.data
}


export const getUserTweets = async (id) => {
    const res = await authAxios.get(`user/${id}/tweets`)
    return res.data
}

export const getUserLikes = async (id) => {
    const res = await authAxios.get(`user/${id}/likes`)
    return res.data
}

export const getUserReplies = async (id) => {
    const res = await authAxios.get(`user/${id}/replies`)
    return res.data
}
export const getRandomPosts = async (limit = 10) => {
    try {
        const res = await authAxios.get(`tweets/random?limit=${limit}`);
        return res.data;
    } catch (error) {
        return [];
    }
}
