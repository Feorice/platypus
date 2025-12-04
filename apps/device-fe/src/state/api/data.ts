import { api } from "./api";

export const dataApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getTimers: builder.query<
			{
				timers?: {
					relay: string;
					id: number;
					enabled: boolean;
					isOn: boolean;
					startTime: string;
					endTime: string;
				}[];
				error?: string;
				ok: boolean;
			},
			void
		>({
			query: () => ({ url: "timer" }),
		}),
	}),
});

export const { useGetTimersQuery } = dataApi;
