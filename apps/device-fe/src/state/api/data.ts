import type { ITimer } from "../../lib/types";
import { api } from "./api";

export const dataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTimers: builder.query<
			{
				timers?: ITimer[];
				error?: string;
				ok: boolean;
			},
			void
		>({
			query: () => ({ url: "timer" }),
		}),
		createTimer: builder.mutation<ITimer, ITimer>({
			query: (data) => ({
				url: "timer/create",
				method: "POST",
				body: data,
			}),
		}),
		updateTimer: builder.mutation<ITimer, Partial<ITimer> & Pick<ITimer, "id">>(
			{
				query: ({ id, ...patch }) => ({
					url: `timer/${id}/update`,
					method: "PUT",
					body: patch,
				}),
				invalidatesTags: ["Timers"],
				transformResponse: (response: { data: ITimer }) => response.data,
				async onQueryStarted(arg, {}) {},
				async onCacheEntryAdded(arg, {}) {},
			},
		),
	}),
});

export const {
	useGetTimersQuery,
	useUpdateTimerMutation,
	useCreateTimerMutation,
} = dataApi;
