import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@state/features/appSlice.ts";
import counterReducer from "@state/features/counter/counterSlice.ts";
import { api } from "./api/api.ts";
import { SocketApi } from "./api/socketApi.ts";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		app: appReducer,
		[api.reducerPath]: api.reducer,
		[SocketApi.reducerPath]: SocketApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(SocketApi.middleware, api.middleware),
});
