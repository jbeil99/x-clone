import { posts as postsData } from "../../../data/posts";
import Tweet from "../../../components/Tweet";
import { useState, useEffect } from "react";
import { getTweets } from "../../../api/tweets";
const AllPosts = () => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await getTweets();
                setIsLoading(false)
                setPosts(res.results)
            } catch (error) {
                console.log(error)
            }
        }
        getPosts()
    }, [])

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post, key) => (
                <Tweet tweet={post} key={post.id + key} />
            ))}
        </div>
    )
}

export default AllPosts; 