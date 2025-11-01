import React, { useEffect, useState } from "react";
import Profile from "./Profile/Profile";
import CreatePost from "./Posts/CreatePost";
import PostCard from "./Posts/PostCard";
import { getPosts } from "../api/posts";
import { API_URL } from "../constant/constant";

export function DashboardWrapper({ token, user }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async (token) => {
    const data = await getPosts(token);
    setPosts(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    fetchPosts(token);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-gray-100 container max-w-7xl mx-auto min-h-screen p-4 sm:p-6 md:p-8">
    
      <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col items-center">
        <div className="mb-6 text-2xl sm:text-3xl font-bold text-center lg:text-left">
          Social Network
        </div>
        <Profile />
      </div>

    
      <div className="flex-1 w-full lg:w-2/3 xl:w-3/4 mx-auto">
        <CreatePost token={token} onPostCreated={fetchPosts} />
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            token={token}
            user={user}
            onPostUpdate={fetchPosts}
          />
        ))}
      </div>
    </div>
  );
}


export default function Dashboard() {
    const [user, setUser] = useState()
    const [token, setToken] = useState()
    useEffect(() => {
        const setTokenGetUser = async () => {
            const token = localStorage.getItem("access")
            setToken(token)
            const res = await fetch(`${API_URL}/profile/`, {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                navigate("/");
            }
        }
        setTokenGetUser()
    }, [])
    return <div className="bg-gray-100">
      
        <DashboardWrapper
        token={token}
        user={user}
        />
        </div>

}