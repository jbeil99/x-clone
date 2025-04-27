import { authAxios } from "./useAxios";

export const getTweets = async () => {
    const res = await authAxios.get(`tweets`)
    return res.data
}

export const addTweet = async (data) => {
    const res = await authAxios.post('tweets', data)
    return res.data
}

export const likeTweet = async (id) => {
    const res = await authAxios.post(`tweets/${id}/likes`)
    return res.data
}
