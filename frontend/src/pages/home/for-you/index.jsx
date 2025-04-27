import {posts as postData} from "../../../mock/posts";
import Tweet from "../../../components/Tweet";
import {useState} from "react";

const ForYou = () => {
	const [posts, setPosts] = useState(postData)

	return (
		<div className="divide-y divide-gray-200 dark:divide-gray-800">
			{posts.map((post, key) => (
				<Tweet tweet={post} key={post.id + key} />
			))}
		</div>
	)
}

export default ForYou; 