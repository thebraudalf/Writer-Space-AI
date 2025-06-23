import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container } from "../components/index.js";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSlugPost,
  deletePost as deleteSlugPost,
  clearSlugPost,
} from "../store/postSlice.js";
import { deleteFile, getFeaturedImage } from "../store/storageSlice.js";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const { slugPost } = useSelector((state) => state.post);
  const urlToPreview = useSelector((state) =>
    post ? state.storage.filesToPreview[post.featuredImage] : null
  );

  const dispatch = useDispatch();

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      dispatch(fetchSlugPost(slug));
    } else navigate("/");

    // Cleanup function: Clear slugPost when component unmounts or slug changes
    return () => {
      dispatch(clearSlugPost());
    };
  }, [slug, navigate, dispatch]);

  useEffect(() => {
    if (slugPost) {
      setPost(slugPost);
    }
  }, [slugPost]);

  useEffect(() => {
    if (post && post.featuredImage && !urlToPreview) {
      dispatch(getFeaturedImage(post.featuredImage));
    }
  }, [dispatch, post, urlToPreview]);

  const deletePost = () => {
    dispatch(deleteSlugPost(slug));
    if (post) {
      dispatch(deleteFile(post.featuredImage));
      navigate("/");
    }
  };

  return post ? (
    <div className="py-8">
      <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
        <img src={urlToPreview} alt={post.title} className="rounded-xl" />

        {isAuthor && (
          <div className="absolute right-6 top-6">
            <Link to={`/edit-post/${post.$id}`}>
              <Button bgColor="bg-green-500" className="mr-3" childern={"Edit"}>
                Edit
              </Button>
            </Link>
            <Button
              bgColor="bg-red-500"
              onClick={deletePost}
              childern={"Delete"}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold">{post.title}</h1>
      </div>
      <div className="browser-css">{parse(post.content)}</div>
    </div>
  ) : null;
}
