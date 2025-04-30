import { ArrowLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Tweet from "../../components/tweet/Tweet";
import { getBookmarks } from "../../api/tweets";
import { Link } from "react-router";


export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookmarks, setFilteredBookmarks] = useState([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await getBookmarks();
                setBookmarks(res.results);
                setFilteredBookmarks(res.results);
            } catch (e) {
                console.log(e);
            }
        };
        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBookmarks(bookmarks);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = bookmarks.filter(bookmark =>
                bookmark.content?.toLowerCase().includes(query) ||
                bookmark.author?.name?.toLowerCase().includes(query) ||
                bookmark.author?.username?.toLowerCase().includes(query)
            );
            setFilteredBookmarks(filtered);
        }
    }, [searchQuery, bookmarks]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="max-w-xl mx-auto bg-black text-white min-h-screen">
            <div className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur-md px-4 py-3 flex items-center border-b border-gray-800">
                <Link className="mr-6" to="/">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h2 className="font-bold text-xl">Bookmarks</h2>
            </div>

            <div className="px-4 py-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="bg-gray-900 text-white w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search Bookmarks"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="px-2">
                {filteredBookmarks.length > 0 ? (
                    filteredBookmarks.map((bookmark, i) => (
                        <Tweet key={bookmark.id || i} tweet={bookmark} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <p className="text-lg font-medium">No bookmarks found</p>
                        {searchQuery ? (
                            <p className="text-sm mt-2">Try searching for something else</p>
                        ) : (
                            <p className="text-sm mt-2">You haven't added any bookmarks yet</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}