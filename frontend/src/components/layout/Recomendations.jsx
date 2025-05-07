import {
    Search, X, User, Hash
} from 'lucide-react';
import TrendingHashtags from './TendingHashtags';
import WhoToFollow from './WhoToFollow';
import { useState, useEffect, useRef } from 'react';
import { authAxios } from '../../api/useAxios';
import { Link } from 'react-router-dom';

export default function Recomendations() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchType, setSearchType] = useState('users'); 
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            
            let mockResults = [];
            
            if (searchType === 'users') {
                if (query.toLowerCase().includes('m')) {
                    mockResults = [
                        { id: 1, name: 'Mahmoud Essa', username: 'mahmoud', avatar_url: '/media/profile_pics/1741138785965.jpg' },
                        { id: 2, name: 'Mohamed Ali', username: 'mohamed', avatar_url: '/media/profile_pics/default.jpg' }
                    ];
                }
            } else {
                if (query.toLowerCase().includes('n')) {
                    mockResults = [
                        { id: 1, name: '#news', tweet_count: 42 },
                        { id: 2, name: '#nature', tweet_count: 18 }
                    ];
                }
            }
            
            setSearchResults(mockResults);
            setShowResults(true);
            
          
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, searchType]);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const toggleSearchType = () => {
        setSearchType(prev => prev === 'users' ? 'hashtags' : 'users');
    };

    return (
        <div className="w-[350px] px-4 py-4">
            <div ref={searchRef} className="bg-black border border-gray-800 rounded-2xl mb-4 relative">
                <div className="flex items-center px-4 py-2">
                    <Search className="h-5 w-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowResults(true)}
                        className="bg-transparent ml-2 outline-none w-full text-white placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="text-gray-500 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button 
                        onClick={toggleSearchType} 
                        className={`ml-2 p-1 rounded-full ${searchType === 'users' ? 'bg-blue-500' : 'bg-green-500'}`}
                        title={`Currently searching for ${searchType}. Click to search for ${searchType === 'users' ? 'hashtags' : 'users'}`}
                    >
                        {searchType === 'users' ? (
                            <User className="h-4 w-4 text-white" />
                        ) : (
                            <Hash className="h-4 w-4 text-white" />
                        )}
                    </button>
                </div>

                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-lg max-h-[300px] overflow-y-auto z-10">
                        {searchResults.map((result, index) => (
                            <div key={index} className="p-3 hover:bg-gray-900 border-b border-gray-800 last:border-b-0">
                                {searchType === 'users' ? (
                                    <Link to={`/profile/${result.username}`} className="flex items-center" onClick={() => setShowResults(false)}>
                                        <img src={result.avatar_url || '/default-avatar.png'} alt={result.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <div className="font-bold text-white">{result.name}</div>
                                            <div className="text-gray-500">@{result.username}</div>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link to={`/hashtags/${result.name.replace('#', '')}`} className="flex items-center" onClick={() => setShowResults(false)}>
                                        <Hash className="w-10 h-10 p-2 bg-green-500 bg-opacity-20 text-green-500 rounded-full mr-3" />
                                        <div>
                                            <div className="font-bold text-white">{result.name}</div>
                                            <div className="text-gray-500">{result.tweet_count} tweets</div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {showResults && searchQuery && searchResults.length === 0 && !isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-lg z-10">
                        <div className="p-4 text-center text-gray-500">
                            No {searchType} found for "{searchQuery}"
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="bg-black border border-gray-800 rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-bold mb-4 text-white">Subscribe to Premium</h2>
                <p className="mb-4 text-white">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                <button className="bg-blue-500 text-white rounded-full py-2 px-4 font-bold">
                    Subscribe
                </button>
            </div> */}
            <TrendingHashtags />
            <WhoToFollow />
        </div>
    )
}