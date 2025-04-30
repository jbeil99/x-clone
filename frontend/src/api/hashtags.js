import { authAxios } from "./useAxios";


export const getHashtagTweets = async (hashtag) => {
    const res = await authAxios.get(`hashtags/${hashtag}`)
    return res.data
}

export const getHashtagLatestTweets = async (hashtag) => {
    const res = await authAxios.get(`hashtags/${hashtag}?filter=latest`)
    return res.data
}

export const getTrendingHashtag = async () => {
    const res = await authAxios.get(`trending_hashtags`)
    return res.data
}