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
	}),
});

export const { useGetTimersQuery } = dataApi;
