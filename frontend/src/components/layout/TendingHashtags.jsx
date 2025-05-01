import { useEffect, useState } from "react"
import { getTrendingHashtag } from "../../api/hashtags";
import { Link } from "react-router";
export default function TrendingHashtags() {
    const [trending, setTrending] = useState([])
    useEffect(() => {
        const getTrends = async () => {
            try {
                const res = await getTrendingHashtag()
                setTrending(res)
            } catch (e) {
                console.log(e)
            }
        }
        getTrends()
    }, []);


    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-4 text-white">What's happening</h2>
            <div className="space-y-4">
                {trending.map((hashtag, i) => {
                    return (<Link to={`/hashtags/${hashtag.name}`} className="cursor-pointer pb-2" key={hashtag.name + i}>
                        <div className="font-bold text-white">#{hashtag.name}</div>
                        <div className="text-sm text-gray-400">{hashtag.count} posts</div>
                    </Link>)
                })}

            </div>
        </div>
    )
}