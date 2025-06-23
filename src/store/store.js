import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import storageSlice from "./storageSlice.js";
import postEditorSlice from "./postEditorSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    post: postSlice,
    postEditor: postEditorSlice,
    storage: storageSlice,
  },
});

export default store;
