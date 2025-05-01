import { useEffect, useState } from "react"
import { getWhoToFollow } from "../../api/users"

export default function WhoToFollow() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await getWhoToFollow()
                setUsers(res)
            } catch (e) {
                console.log(e.response)
            }
        }
        getUsers()
    }, [])
    return (
        <div className="bg-black border border-gray-800 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Who to follow</h2>
            <div className="space-y-4">
                {users.map((u, i) => {
                    return (
                        <div className="flex items-center justify-between" key={u.id + i}>
                            <div className="flex items-center gap-3">
                                <img src={u.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div className="font-bold text-white">{u.display_name}</div>
                                    <div className="text-gray-400 text-sm">@{u.username}</div>
                                </div>
                            </div>
                            <button className="bg-white text-black rounded-full px-4 py-1 font-bold">Follow</button>
                        </div>

                    )
                })}
            </div>
        </div>
    )
}