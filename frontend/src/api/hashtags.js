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

export const getExploreNews = async (sortBy = 'created_at') => {
    try {
        const res = await authAxios.get(`explore/news/?category=news&sort=${sortBy}`)
        return res.data
    } catch (error) {
        return { results: [] }
    }
}

export const getExploreSports = async (sortBy = 'created_at') => {
    try {
        const res = await authAxios.get(`explore/sports/?category=sports&sort=${sortBy}`)
        return res.data
    } catch (error) {
        return { results: [] }
    }
}
