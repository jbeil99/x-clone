export default function WhoToFollow() {
    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Who to follow</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <div className="font-bold text-white">hussien</div>
                            <div className="text-gray-400 text-sm">@Al Doctor</div>
                        </div>
                    </div>
                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <div className="font-bold text-white">ON Sport</div>
                            <div className="text-gray-400 text-sm">@ONTimeSports</div>
                        </div>
                    </div>
                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <div className="font-bold text-white">Ahmed Shobier</div>
                            <div className="text-gray-400 text-sm">@ShobierOfficial</div>
                        </div>
                    </div>
                    <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                </div>
            </div>
            <button className="text-blue-500 hover:underline mt-4">Show more</button>
        </div>
    )
}