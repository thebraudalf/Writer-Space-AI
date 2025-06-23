import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import service from "../appwrite/config";

// function to upload featured image
export const uploadFeaturedImage = createAsyncThunk(
  "storage/uploadFeaturedImage",
  async (file, { rejectWithValue }) => {
    try {
      if (!file || !(file instanceof File)) {
        throw new Error("A valid file is required to upload.");
      }
      const uploadFile = await service.uploadFile(file);
      return uploadFile; // return file data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// function to get featured image
export const getFeaturedImage = createAsyncThunk(
  "storage/getFeaturedImage",
  async (fileId, { rejectWithValue }) => {
    try {
      if (!fileId || typeof fileId !== "string") {
        throw new Error("A valid file Id is required to preview.");
      }
      const getFile = service.getfilePreview(fileId);
      return { fileId: fileId, url: getFile };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// function to delete featured image
export const deleteFile = createAsyncThunk(
  "storage/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      if (!fileId || typeof fileId !== "string") {
        throw new Error("A valid file Id is required to delete the file");
      }
      await service.deleteFile(fileId);
      return fileId; // Return the file Id
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// initial state for the storage slice
const initialState = {
  uploadedFiles: [], // Array of file data
  filesToPreview: {}, // Object of files to preview
  error: null,
};

// storage slice for file upload or preview
const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    addUploadedFiles: (state, action) => {
      state.uploadedFiles.push(action.payload);
    },
    setFilesToPreview: (state, action) => {
      const { fileId, url } = action.payload;
      state.filesToPreview[fileId] = url;
    },
    deleteUploadedFile: (state, action) => {
      state.uploadedFiles = state.uploadedFiles.filter(
        (file) => file.$id !== action.payload
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload File
      .addCase(uploadFeaturedImage.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadFeaturedImage.fulfilled, (state, action) => {
        state.uploadedFiles.push(action.payload);
      })
      .addCase(uploadFeaturedImage.rejected, (state, action) => {
        state.error = action.payload;
      })
      // File to Preview
      .addCase(getFeaturedImage.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeaturedImage.fulfilled, (state, action) => {
        const { fileId, url } = action.payload;
        state.filesToPreview[fileId] = url;
      })
      .addCase(getFeaturedImage.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete File
      .addCase(deleteFile.pending, (state, action) => {
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.uploadedFiles = state.uploadedFiles.filter(
          (file) => file.$id !== action.payload
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  addUploadedFiles,
  setError,
  deleteUploadedFile,
  setFilesToPreview,
} = storageSlice.actions;

export default storageSlice.reducer;
