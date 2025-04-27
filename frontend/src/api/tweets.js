import { authAxios } from "./useAxios";

export const getTweets = async () => {
    const res = await authAxios.get(`tweets`)
    return res.data
}

export const addTweet = async (data) => {
    const formData = new FormData();
    formData.append('content', data.content);

    // Append the image File object
    if (data.image) {
        formData.append('image', data.image);
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
