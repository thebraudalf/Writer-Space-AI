import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice.js";

function Home() {
  const { activePosts, loading, error } = useSelector((state) => state.post);
  const [post, setPost] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (activePosts) {
      setPost(activePosts);
    }
  }, [activePosts]);

  if (post.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-2xl font-bold hover:text-gray-500">
              Login to read posts
            </h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full py-8">
      <div className="flex flex-wrap">
        {post.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
