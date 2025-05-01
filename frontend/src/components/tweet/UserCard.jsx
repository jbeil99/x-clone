import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@/components/ui/hover-card';

import { useEffect, useState } from 'react';
import { getUserByUsername } from '../../api/users';
import { Link } from 'react-router';
import UserInfo from './UserInfo';

export default function UserCard({ username, match }) {
    const [user, setUser] = useState()
    const [isFollowing, setIsFollowing] = useState(user?.ifollow);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await getUserByUsername(username)
                setUser(res)
                setIsFollowing(res.ifollow)
            } catch (e) {
                console.log(e)
            }

        }
        getUserData()
    }, [])

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Link to={`/profile/${username}`}>
                    <span className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer">
                        {match[1]}
                    </span>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-0 bg-black text-white border border-gray-700">
                <UserInfo user={user} isFollowing={isFollowing} setIsFollowing={setIsFollowing} />
            </HoverCardContent>
        </HoverCard>
    )
}