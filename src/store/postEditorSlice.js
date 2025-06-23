import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import service from "../appwrite/config";

// creates a new post in db with a unique slug
export const createPost = createAsyncThunk(
  "postEditor/createPost",
  async (post, { rejectWithValue }) => {
    try {
      const { postSubmitData, userData } = post;

      // Validation
      if (!postSubmitData.title || !postSubmitData.content) {
        throw new Error("Title and content are required.");
      }

      // Ensurnig the slug is unique
      let uniqueSlug = postSubmitData.slug;
      let suffix = 1;
      while (true) {
        try {
          // Check if a post with this slug already exists
          await service.getPost(uniqueSlug);
          // if the above call succeeds, the slug exists, so append a suffix
          uniqueSlug = `${postSubmitData.slug}-${suffix}`;
          suffix++;
        } catch (error) {
          // if the slug doesn't exist, we can use it
          break;
        }
      }

      // update the postData with the unique slug
      const finalPostData = {
        ...postSubmitData,
        slug: uniqueSlug,
        userId: userData.$id,
      };

      const finalPost = await service.createPost(finalPostData);
      return finalPost;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// updates an existing post in the db with a unique slug
export const updatePost = createAsyncThunk(
  "postEditor/updatePost",
  async (post, { rejectWithValue }) => {
    try {
      const { postData, postSubmitData, fileUploadData } = post;

      // Validation
      if (!postSubmitData.title || !postSubmitData.content) {
        throw new Error("Title and content are required.");
      }

      // Ensuring the slug is unique (but if the slug hasn't changed)
      const originalPost = await service
        .getPost(postData.$id)
        .catch(() => null);

      if (!originalPost) {
        throw new Error("Post not found");
      }

      // Delete the existing featured image from db
      let newFeaturedImageId = originalPost.featuredImage; // Start with the existing image ID

      if (fileUploadData) {
        // If a new file was uploaded
        // Delete the old featured image if it exists
        if (originalPost.featuredImage) {
          await service.deleteFile(originalPost.featuredImage);
        }
        newFeaturedImageId = fileUploadData.$id; // Set the new image ID
      } else if (
        postSubmitData.image &&
        postSubmitData.image.length === 0 &&
        originalPost.featuredImage
      ) {
        await service.deleteFile(originalPost.featuredImage);
        newFeaturedImageId = null; // No featured image
      }

      /*let uniqueSlug = postSubmitData.slug;
      if (originalPost.$id !== postSubmitData.slug) {
        // Slug has changed, so check for uniqueness
        let suffix = 1;
        while (true) {
          try {
            const existingPost = await service.getPost(uniqueSlug);
            
            // if the existing post is not the one we're updating, append a suffix
            if (existingPost.$id !== originalPost.$id) {
              uniqueSlug = `${postSubmitData.slug}-${suffix}`;
              suffix++;
            } else {
              break;
            }
          } catch (error) {
            // if the slug doesn't exist, we can see it
            break;
          }
        }
      }*/

      // update the postdata with the unique slug
      const finalPostData = {
        ...postSubmitData,
        //slug: uniqueSlug,
        featuredImage: newFeaturedImageId,
      };

      // update the post
      const updatedPost = await service.updatePost(postData.$id, finalPostData);
      return updatedPost;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  createPostData: null,
  updatePostData: null,
  error: null,
};

const postEditorSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    setCreatePostData: (state, action) => {
      state.createPostData = action.payload;
    },
    setUpdatePostData: (state, action) => {
      state.updatePostData = action.payload;
    },
    clearCreatePostData: (state) => {
      state.createPostData = null;
      state.error = null;
    },
    clearUpdatePostData: (state) => {
      state.updatePostData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createPostData = action.payload;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updatePostData = action.payload;
      })
      .addCase(updatePost.rejected, (state, action) => {
        console.error("Update failed:", action.payload);
        state.error = action.payload;
      });
  },
});

export const {
  setCreatePostData,
  setUpdatePostData,
  clearCreatePostData,
  clearUpdatePostData,
} = postEditorSlice.actions;

export default postEditorSlice.reducer;
