import Tab from "../../components/tab";
import AllPosts from "./components/AllPosts";
import { Image, MapPin, Calendar, Link as LinkIcon, Globe2, Film, BarChart2, Smile, PlusCircle } from 'lucide-react';

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

                <div className="px-4 pt-3 pb-0 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex gap-3">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-11 h-11 rounded-full object-cover mt-1" />
                        <div className="flex-1 min-w-0">
                            <textarea 
                                className="w-full bg-transparent outline-none resize-none text-xl mb-1 placeholder:text-gray-400 text-white"
                                placeholder="What's happening?"
                                rows="2"
                            />
                            <div className="flex items-center gap-1 mb-2">
                                <Globe2 className="w-4 h-4 text-blue-500" />
                                <span className="text-blue-500 text-sm font-bold cursor-pointer hover:underline">Everyone can reply</span>
                            </div>
                            <div className="border-b border-gray-700 mb-2" />
                            <div className="flex items-center justify-between py-2">
                                <div className="flex gap-2 text-blue-500">
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><Image className="w-5 h-5" /></button>
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><Film className="w-5 h-5" /></button>
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><BarChart2 className="w-5 h-5" /></button>
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><Smile className="w-5 h-5" /></button>
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><Calendar className="w-5 h-5" /></button>
                                    <button className="p-1.5 hover:bg-blue-900/30 rounded-full"><MapPin className="w-5 h-5" /></button>
                                </div>
                                <button className="bg-gray-700 text-white px-5 py-1.5 rounded-full font-bold opacity-80 hover:opacity-100 transition">Post</button>
                            </div>
                        </div>
                    </div>
                </div>

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