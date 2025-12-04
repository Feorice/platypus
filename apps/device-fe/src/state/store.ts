import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@state/features/appSlice.ts";
import counterReducer from "@state/features/counter/counterSlice.ts";
import { SocketApi } from "./api/socketApi.ts";

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		app: appReducer,
		[SocketApi.reducerPath]: SocketApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(SocketApi.middleware),
});
