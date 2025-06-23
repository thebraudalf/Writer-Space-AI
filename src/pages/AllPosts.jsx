import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice.js";

function AllPosts() {
  const { activePosts } = useSelector((state) => state.post)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllPosts())
  }, [dispatch]);

  return (
    <div className="w-full py-8">
      <Container
        Childern={
          <div className="flex flex-wrap">
            {activePosts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
}

export default AllPosts;
