import SearchTab from "../../components/SearchTemp";
import { getHashtagTweets, getHashtagLatestTweets } from "../../api/hashtags";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Hashtags() {
    const { name } = useParams();
    const [tweets, setTweets] = useState([])
    const [latest, setLatest] = useState([])
    useEffect(() => {
        const getTweets = async () => {
            try {
                const res = await getHashtagTweets(name)
                const latest = await getHashtagLatestTweets(name)
                setTweets(res.results)
                setLatest(latest.results)
            } catch (e) {
                console.log(e)
            }
        }
        getTweets()
    }, [])
    return (
        <SearchTab top={tweets} latest={latest} />
    )
}