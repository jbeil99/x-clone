import Tab from "../../components/tab";
import ForYou from "./components/ForYou";
import TweetForm from "./components/TweetForm";
import Following from "./components/Following";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from "../../store/slices/tweets";
import { useEffect } from "react";

export default function MainPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchTweets());
    }, [dispatch]);
    return (
        <div className="min-h-screen bg-black">
            <Tab activeTab="all-posts">
                <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
                    <Tab.Items>
                        <Tab.Item id="all-posts">
                            For You
                        </Tab.Item>
                        <Tab.Item id="following">
                            Following
                        </Tab.Item>
                    </Tab.Items>
                </div>

                <TweetForm />

                <Tab.Content id="all-posts">
                    <ForYou />
                </Tab.Content>
                <Tab.Content id="following">
                    <Following />
                </Tab.Content>
            </Tab >
        </div >
    )
} 