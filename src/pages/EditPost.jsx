import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components/index.js";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSlugPost, fetchSlugPost } from "../store/postSlice.js";

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const slugPost = useSelector((stata) => stata.post.slugPost);
  const dispatch = useDispatch();

  useEffect(() => {
    if (slug) {
      dispatch(fetchSlugPost(slug));
    } else {
      navigate("/");
    }

    // Cleanup function: Clear slugPost when component unmounts or slug changes
    return () => {
      dispatch(clearSlugPost());
    };
  }, [slug, navigate, dispatch]);

  // Set local state `post` when `slugPost` from Redux updates
  useEffect(() => {
    if (slugPost) {
      setPost(slugPost);
    }
  }, [slugPost]);

  return post ? (
    <div className="py-8">
      <Container Childern={<PostForm post={post} />} />
    </div>
  ) : null;
}

export default EditPost;
