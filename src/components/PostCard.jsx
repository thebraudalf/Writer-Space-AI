import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedImage } from "../store/storageSlice.js";

function PostCard({ $id, title, featuredImage }) {
  const urlToPreview = useSelector((state) => state.storage.filesToPreview[featuredImage]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!urlToPreview) {
      dispatch(getFeaturedImage(featuredImage));
    }
  }, [dispatch, featuredImage, urlToPreview]);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4">
        <div className="w-full justify-center mb-4">
          <img src={urlToPreview} alt={title} className="rounded-xl" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
