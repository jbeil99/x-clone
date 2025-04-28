import React, { useRef, useState, useEffect } from "react";
import Tab from "../../components/tab";
import AllPosts from "./components/AllPosts";
import TweetForm from "./components/TweetForm";
import { useSelector } from "react-redux";
export default function MainPage() {
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    console.log(loading, error, isAuthenticated, user)
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
                    <AllPosts />
                </Tab.Content>
                <Tab.Content id="following">
                    <div className="p-4 text-center text-gray-500">
                        Follow some accounts to see their posts here.
                    </div>
                </Tab.Content>
            </Tab >
        </div >
    )
} 