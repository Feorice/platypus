import { api } from "./api";

const dataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTimers: builder.query({
			query: () => ({ url: "timers" }),
		}),
	}),
});

export const { useGetTimersQuery } = dataApi;
