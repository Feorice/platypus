import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@state/hooks";
import { SOCKET_RECONNECTION_ATTEMPTS } from "@/lib/constants.ts";

interface AppState {
	attempts: number;
}

const initialState: AppState = {
	attempts: 0,
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		incrementConnectionAttempt: (state) => {
			if (state.attempts < SOCKET_RECONNECTION_ATTEMPTS) {
				state.attempts++;
			}
		},
		resetAttempts: (state) => {
			state.attempts = 0;
		},
	},
});

export const { incrementConnectionAttempt, resetAttempts } = appSlice.actions;
export const selectAttempts = ({ app }: RootState) => app.attempts;
export default appSlice.reducer;
