import Tweet from "../../../components/tweet/Tweet";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from "../../../store/slices/tweets";

const Following = () => {
    const [posts, setPosts] = useState([])
    const { loading, error, followingTweets } = useSelector((state) => state.tweets);
    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(fetchTweets())

    }, [dispatch])
    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {!loading ? (
                followingTweets?.length > 0 ? (
                    followingTweets.map((tweet, key) => (
                        <Tweet tweet={tweet} key={tweet.id} />
                    ))
                ) : (
                    <div className="py-8 flex justify-center items-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <svg className="mx-auto h-12 w-12 fill-current" viewBox="0 0 24 24">
                                <path d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zM18 10a6 6 0 1 0-12 0 6 6 0 0 0 12 0zM8 17h8v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1z" />
                            </svg>
                            <p className="mt-2 text-sm">No tweets from followed users yet.</p>
                            <p className="mt-1 text-xs">Follow more accounts to see their posts!</p>
                        </div>
                    </div>
                )
            ) : (
                <div className="py-8 flex justify-center items-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading tweets...</p>
                </div>
            )}
        </div>
    )
}

export default Following;