import Tab from "../../components/tab";
import AllPosts from "./components/AllPosts";
import TweetForm from "./components/TweetForm";

export default function MainPage() {
    return (
        <div className="min-h-screen">
            <Tab activeTab="all-posts">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md dark:bg-black/80">
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
                    <AllPosts />
                </Tab.Content>
                <Tab.Content id="following">
                    <div className="p-4 text-center text-gray-500">
                        Follow some accounts to see their posts here.
                    </div>
                </Tab.Content>
            </Tab>
        </div>
    )
} 