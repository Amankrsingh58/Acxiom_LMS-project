import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import authReducer from "./services/slices/AuthSlice";
import { authApi } from "./services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, authApi.middleware),
});
