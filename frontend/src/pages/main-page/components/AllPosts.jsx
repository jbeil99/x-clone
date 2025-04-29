import Tweet from "../../../components/tweet/Tweet";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from "../../../store/slices/tweets";

const AllPosts = () => {
    const [posts, setPosts] = useState([])
    const { loading, error, tweets } = useSelector((state) => state.tweets);
    const dispatch = useDispatch()
    useEffect(() => {

        dispatch(fetchTweets())

    }, [dispatch])
    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {!loading ? tweets?.map((tweet, key) => (
                <Tweet tweet={tweet} key={tweet.id} />
            )) : "loading"}
        </div>
    )
}

export default AllPosts; 