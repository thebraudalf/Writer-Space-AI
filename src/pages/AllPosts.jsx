import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config.js";
import { Container, PostCard } from "../components/index.js";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container
        Childern={
          <div className="flex flex-wrap">
            {posts.map((post) => (
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
