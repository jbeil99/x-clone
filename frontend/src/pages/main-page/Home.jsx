import React, { useRef, useState, useEffect } from "react";
import Tab from "../../components/tab";
import AllPosts from "./components/AllPosts";
import { Image, MapPin, Calendar, Link as LinkIcon, Globe2, Film, BarChart2, Smile, PlusCircle, Settings } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function MainPage() {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState(null);
    const [location, setLocation] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [showPoll, setShowPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollDuration, setPollDuration] = useState({ days: 1, hours: 0, minutes: 0 });
    const [showExplore, setShowExplore] = useState(false);

    const fileInputRef = useRef(null);
    const emojiRef = useRef(null);

    const handleEmojiSelect = (emoji) => {
        setContent(content + emoji.native);
        setShowEmoji(false);
    };

    const handleMediaClick = () => {
        fileInputRef.current.click();
    };

    const handleMediaChange = (e) => {
        setMedia(e.target.files[0]);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`${position.coords.latitude},${position.coords.longitude}`);
                },
                () => {
                    alert("Location access denied.");
                }
            );
        }
    };

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("content", content);
        if (media) formData.append("media", media);
        if (location) formData.append("location", location);
        if (showPoll && pollOptions.some(opt => opt.trim() !== "")) {
            formData.append("poll", JSON.stringify(pollOptions));
            formData.append("poll_duration", JSON.stringify(pollDuration));
        }

        await fetch("http://localhost:8000/api/posts/", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            body: formData,
        });
        setContent("");
        setMedia(null);
        setLocation("");
    };

    useEffect(() => {
        if (!showEmoji) return;

        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmoji]);

    if (showExplore) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-gray-800">
                    <div className="flex items-center px-4 py-3 gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-gray-900 text-white rounded-full py-2 pl-10 pr-4 outline-none border border-gray-800 focus:border-blue-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            </span>
                        </div>
                        <button className="ml-2 p-2 rounded-full hover:bg-gray-800">
                            <Settings className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                    <div className="flex border-b border-gray-800">
                        {['For You', 'Trending', 'News', 'Sports', 'Entertainment'].map(tab => (
                            <button key={tab} className="flex-1 py-3 text-center font-bold hover:bg-gray-900 focus:outline-none text-white border-b-2 border-transparent focus:border-blue-500">
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <div className="text-center text-gray-400 mt-10">Explore content goes here...</div>
                </div>
            </div>
        );
    }

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
                            {showPoll ? (
                                <div className="w-full">
                                    <div className="text-lg font-semibold mb-2 text-white">Ask a question</div>
                                    <div className="my-2 bg-gray-900/80 p-3 rounded-xl border border-gray-700">
                                        {pollOptions.map((option, idx) => (
                                            <div key={idx} className="flex items-center mb-2 relative">
                                                <label className="absolute -top-5 left-0 text-xs text-gray-400">Choice {idx + 1}</label>
                                                <input
                                                    type="text"
                                                    maxLength={25}
                                                    className="flex-1 bg-transparent border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 pr-14"
                                                    placeholder={`Choice ${idx + 1}`}
                                                    value={option}
                                                    onChange={e => {
                                                        const newOptions = [...pollOptions];
                                                        newOptions[idx] = e.target.value;
                                                        setPollOptions(newOptions);
                                                    }}
                                                />
                                                <span className="absolute right-3 top-2 text-xs text-gray-500">{option.length} / 25</span>
                                                {idx === pollOptions.length - 1 && pollOptions.length < 4 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-blue-400 text-2xl font-bold flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-900/30"
                                                        onClick={() => setPollOptions([...pollOptions, ""])}
                                                    >
                                                        +
                                                    </button>
                                                )}
                                                {pollOptions.length > 2 && idx === pollOptions.length - 1 && (
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-400 text-xl font-bold flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-900/30"
                                                        onClick={() => setPollOptions(pollOptions.slice(0, -1))}
                                                    >
                                                        –
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <div className="flex gap-4 mt-4 mb-2">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Poll length</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="bg-gray-800 border border-gray-600 rounded-lg p-1 text-white"
                                                        value={pollDuration.days}
                                                        onChange={e => setPollDuration({ ...pollDuration, days: Number(e.target.value) })}
                                                    >
                                                        {[...Array(8).keys()].map(i => (
                                                            <option key={i+1} value={i+1}>{i+1}</option>
                                                        ))}
                                                    </select>
                                                    <span className="text-xs text-gray-400 self-center">Days</span>
                                                    <select
                                                        className="bg-gray-800 border border-gray-600 rounded-lg p-1 text-white"
                                                        value={pollDuration.hours}
                                                        onChange={e => setPollDuration({ ...pollDuration, hours: Number(e.target.value) })}
                                                    >
                                                        {[...Array(24).keys()].map(i => (
                                                            <option key={i} value={i}>{i}</option>
                                                        ))}
                                                    </select>
                                                    <span className="text-xs text-gray-400 self-center">Hours</span>
                                                    <select
                                                        className="bg-gray-800 border border-gray-600 rounded-lg p-1 text-white"
                                                        value={pollDuration.minutes}
                                                        onChange={e => setPollDuration({ ...pollDuration, minutes: Number(e.target.value) })}
                                                    >
                                                        {[0, 5, 10, 15, 30, 45].map(i => (
                                                            <option key={i} value={i}>{i}</option>
                                                        ))}
                                                    </select>
                                                    <span className="text-xs text-gray-400 self-center">Minutes</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-red-500 text-sm mt-2 hover:underline"
                                            onClick={() => { setShowPoll(false); setPollOptions(["", ""]); }}
                                        >
                                            Remove poll
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                            <textarea 
                                        className="w-full bg-transparent outline-none resize-none text-xl mb-1 placeholder:text-gray-400 text-white"
                                placeholder="What's happening?"
                                        rows="2"
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                    />
                                    <div className="flex items-center gap-1 mb-2">
                                        <Globe2 className="w-4 h-4 text-blue-500" />
                                        <span className="text-blue-500 text-sm font-bold cursor-pointer hover:underline">Everyone can reply</span>
                                    </div>
                                    <div className="border-b border-gray-700 mb-2" />
                                </>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <div className="flex gap-2 text-blue-500">
                                    <button type="button" className="p-1.5 hover:bg-blue-900/30 rounded-full cursor-pointer" onClick={handleMediaClick}>
                                        <Image className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleMediaChange}
                                    />
                                    <button type="button" className="p-1.5 hover:bg-blue-900/30 rounded-full cursor-pointer" onClick={handleMediaClick}>
                                        <Film className="w-5 h-5" />
                                    </button>
                                    <button type="button" className="p-1.5 hover:bg-blue-900/30 rounded-full cursor-pointer" onClick={() => setShowEmoji(!showEmoji)}>
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    {showEmoji && (
                                        <div ref={emojiRef} className="absolute z-50 mt-2">
                                            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
                                        </div>
                                    )}
                                    <button type="button" className="p-1.5 hover:bg-blue-900/30 rounded-full cursor-pointer" onClick={handleLocation}>
                                        <MapPin className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    className="bg-gray-700 text-white px-5 py-1.5 rounded-full font-bold opacity-80 hover:opacity-100 transition"
                                    onClick={handlePost}
                                    disabled={!content && !media}
                                >
                                    Post
                                </button>
                            </div>
                            {media && <div className="text-xs text-blue-400 mt-1">{media.name}</div>}
                            {location && <div className="text-xs text-blue-400 mt-1">{location}</div>}
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