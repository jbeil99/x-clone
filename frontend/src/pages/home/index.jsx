import StickyHeader from "../../components/sticky-header";
import Tab from "../../components/tab";
import ForYou from "./for-you";
import { Image, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';

export default function Home() {
	return (
		<div className="min-h-screen">
			<Tab activeTab="for-you">
				<StickyHeader title="Home">
					<Tab.Items>
						<Tab.Item id="for-you">
							For You
						</Tab.Item>
						<Tab.Item id="followings">
							Following
						</Tab.Item>
					</Tab.Items>
				</StickyHeader>

				{/* Post composer */}
				<div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
					<div className="flex gap-4">
						<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
						<div className="flex-1">
							<textarea 
								className="w-full bg-transparent outline-none resize-none text-xl mb-3" 
								placeholder="What's happening?"
								rows="1"
							/>
							<div className="flex justify-between items-center">
								<div className="flex gap-2 text-blue-500">
									<button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full">
										<Image className="w-5 h-5" />
									</button>
									<button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full">
										<MapPin className="w-5 h-5" />
									</button>
									<button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full">
										<Calendar className="w-5 h-5" />
									</button>
									<button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full">
										<LinkIcon className="w-5 h-5" />
									</button>
								</div>
								<button className="bg-blue-500 text-white px-4 py-1.5 rounded-full font-bold opacity-50">
									Post
								</button>
							</div>
						</div>
					</div>
				</div>

				<Tab.Content id="for-you">
					<ForYou />
				</Tab.Content>
				<Tab.Content id="followings">
					<div className="p-4 text-center text-gray-500">
						Follow some accounts to see their posts here.
					</div>
				</Tab.Content>
			</Tab>
		</div>
	)
} 