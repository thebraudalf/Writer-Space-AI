import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index.js";
import appwriteService from "../../appwrite/config.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  setCreatePostData,
  setUpdatePostData,
  updatePost,
} from "../../store/postEditorSlice.js";
import { uploadFeaturedImage } from "../../store/storageSlice.js";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, reset } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const { createPostData, updatePostData, error } = useSelector(
    (state) => state.postEditor
  );

  useEffect(() => {
    if (createPostData) {
      navigate(`/post/${createPostData.$id}`);
      dispatch(setCreatePostData(null)); // clear old state
    }
  }, [createPostData, navigate, dispatch]);

  useEffect(() => {
    if (updatePostData) {
      navigate(`/post/${updatePostData.$id}`);
      dispatch(setUpdatePostData(null)); // clear old state
    }
  }, [updatePostData, navigate, dispatch]);

  // new submit function
  const submit = async (data) => {
    try {
      if (post) {
        let file = null;
        if (data.image[0]) {
          // Dispatch the uploadFeaturedImage thunk and unwrap the result
          const uploadResult = await dispatch(
            uploadFeaturedImage(data.image[0])
          ).unwrap();
          file = uploadResult;
        }
        dispatch(
          updatePost({
            postData: post,
            postSubmitData: data,
            fileUploadData: file,
          })
        );
      } else {
        let file = null;
        if (data.image[0]) {
          // Dispatch the uploadFeaturedImage thunk and unwrap the result
          const uploadResult = await dispatch(
            uploadFeaturedImage(data.image[0])
          ).unwrap();
          file = uploadResult;
        }

        if (file) {
          const postSubmitData = { ...data, featuredImage: file.$id };
          dispatch(createPost({ postSubmitData, userData: userData }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // old submit function
  /*const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };*/

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getfilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
