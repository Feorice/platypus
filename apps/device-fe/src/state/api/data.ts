import type { ITimer } from "@/lib/types.ts";
import { api } from "./api";

export const dataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTimers: builder.query<
			{
				timers?: ITimer[];
				error?: string;
				ok: boolean;
			},
			{ hidden?: boolean }
		>({
			query: (arg) => ({ url: "timer", params: arg }),
			providesTags: (result) => {
				if (result?.timers) {
					return [
						...result.timers.map(({ id }) => {
							return { type: "Timers", id } as const;
						}),
						{ type: "Timers" as const, id: "LIST" },
					];
				}

				return [{ type: "Timers", id: "LIST" }];
			},
		}),
		enableTimer: builder.mutation<ITimer, Partial<ITimer> & Pick<ITimer, "id">>(
			{
				query: ({ id, ...patch }) => ({
					url: `timer/${id}/enable`,
					method: "POST",
					body: patch,
				}),
				invalidatesTags: (t) => [{ type: "Timers", id: t?.id }],
				// transformResponse: (response: { data: ITimer }) => response.data,
				// async onQueryStarted(arg, {}) {},
				// async onCacheEntryAdded(arg, {}) {},
			},
		),
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
					url: `timer/${id}/updateTime`,
					method: "POST",
					body: patch,
				}),
				// invalidatesTags: ['Timers'],
				transformResponse: (response: { data: ITimer }) => response.data,
				// async onQueryStarted(arg, {}) {},
				// async onCacheEntryAdded(arg, {}) {},
			},
		),
	}),
});

export const {
	useGetTimersQuery,
	useUpdateTimerMutation,
	useCreateTimerMutation,
	useEnableTimerMutation,
} = dataApi;
