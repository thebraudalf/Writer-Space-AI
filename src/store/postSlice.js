import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import service from "../appwrite/config";

// retrieve slug post from the db
export const fetchSlugPost = createAsyncThunk(
  "posts/fetchPostBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const post = await service.getPost(slug);
      return post;
    } catch (error) {
      if (error.code === 404) {
        return rejectWithValue("Post not found");
      }
    }
  }
);

// retrieve all posts from the db
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const posts = await service.getPosts();
      return posts.documents;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// delete a post from the db
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug, { rejectWithValue }) => {
    try {
      await service.deletePost(slug);
      return slug;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  activePosts: [], // Array of all active posts
  slugPost: null, //
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    setSlugPost: (state, action) => {
      state.slugPost = action.payload.slugPost;
      state.loading = false;
      state.error = null;
    },
    setActivePosts: (state, action) => {
      state.activePosts = action.payload.activePosts;
      state.loading = false;
      state.error = null;
    },
    clearSlugPost: (state) => {
      state.slugPost = null;
      state.error = null; // Clear any related errors as well
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all active Posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.activePosts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Post by Slug
      .addCase(fetchSlugPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlugPost.fulfilled, (state, action) => {
        state.slugPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchSlugPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete a post
      .addCase(deletePost.pending, (state) => {
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const slug = action.payload;
        state.activePosts = state.activePosts.filter(
          (post) => post.slug !== slug
        );
        if (state.slugPost?.slug === slug) {
          state.slugPost = null;
        }
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActivePosts, setSlugPost, clearSlugPost, setLoading, setError } =
  postSlice.actions;

export default postSlice.reducer;
