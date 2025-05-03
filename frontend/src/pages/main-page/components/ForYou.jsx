import Tweet from "../../../components/tweet/Tweet";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from "../../../store/slices/tweets";

const ForYou = () => {
    const { loading, error, tweets, nextPageUrl, hasMore } = useSelector((state) => state.tweets);
    const dispatch = useDispatch()

    const loadMoreTweets = () => {
        if (!loading && hasMore && nextPageUrl) {
            dispatch(fetchTweets(nextPageUrl));
            setPage(nextPageUrl);
        }
    };

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {tweets?.length > 0 ? (
                <>
                    {tweets.map((tweet) => (
                        <div key={tweet.id}>
                            <Tweet tweet={tweet} />
                        </div>
                    ))}

                    {hasMore && (
                        <div className="py-4 flex justify-center items-center">
                            <button
                                onClick={loadMoreTweets}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Load More Tweets'}
                            </button>
                        </div>
                    )}

                    {!hasMore && (
                        <div className="py-4 flex justify-center items-center">
                            <p className="text-gray-500 dark:text-gray-400">No more tweets to load</p>
                        </div>
                    )}
                </>
            ) : (
                !loading && (
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
            )}

            {loading && tweets.length === 0 && (
                <div className="py-4 flex justify-center items-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading tweets...</p>
                </div>
            )}
        </div>
    );
}

export default ForYou;