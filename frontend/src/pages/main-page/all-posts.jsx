import {posts as postsData} from "../../data/posts";
import Tweet from "../../components/Tweet";
import {useState} from "react";

const AllPosts = () => {
    const [posts, setPosts] = useState(postsData)

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {posts.map((post, key) => (
                <Tweet tweet={post} key={post.id + key} />
            ))}
        </div>
    )
}

export default AllPosts; 