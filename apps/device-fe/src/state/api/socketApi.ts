import { createApi } from "@reduxjs/toolkit/query/react";
import {
	incrementConnectionAttempt,
	resetAttempts,
} from "@state/features/appSlice";
import { io } from "socket.io-client";
import { SOCKET_RECONNECTION_ATTEMPTS } from "@/lib/constants.ts";

interface Event<T> {
	name: string;
	data: T;
}

export interface DHT22Data {
	temperature?: number;
	humidity?: number;
	scale?: "C" | "F";
}

const socket = io("http://localhost:3000", {
	reconnectionAttempts: SOCKET_RECONNECTION_ATTEMPTS,
});

let dispatcher;

const connected = (dispatch?) => {
	if (dispatch) dispatch(resetAttempts());
	return new Promise<void>((resolve) => {
		socket.on("connect", resolve);
		socket.on("connect_error", (e) => {
			console.log("error connecting", { error: e });
			if (dispatch) dispatch(incrementConnectionAttempt());
		});
	});
};

const socketEmitterBatch = (
	emitter: "on" | "off",
	events: string[] = [],
	listener: () => void,
) => {
	events.forEach((event) => {
		socket[emitter](event, listener);
	});
};

export const SocketApi = createApi({
	reducerPath: "socket",
	async baseQuery(options: Event<any>) {
		await connected();

		socket.emit(options.name, options.data);

		return { data: options };
	},
	// baseQuery: fetchBaseQuery({ baseUrl: "/" }),
	endpoints: (build) => ({
		// sendEvent: build.mutation<Event<{ turd: string }>, string>({
		// 	queryFn() {
		// 		return { turd: "blah" };
		// 	},
		// 	query(event) {
		// 		return {
		// 			name: event,
		// 			data: {},
		// 		};
		// 	},
		// }),
		DHT22SensorEvents: build.query<DHT22Data, void>({
			queryFn() {
				return { data: { temperature: 0, humidity: 0, scale: "C" } };
			},
			// async onQueryStarted(_arg, { dispatch }) {
			// 	socket.on("connect_error", (e) => {
			// 		console.log("connect error", e);
			// 		dispatch(incrementConnectionAttempt());
			// 	});
			// },
			async onCacheEntryAdded(
				_arg,
				{ dispatch, cacheEntryRemoved, updateCachedData, cacheDataLoaded },
			) {
				await cacheDataLoaded;
				dispatcher = dispatch;
				await connected(dispatcher);

				const listener = (data: DHT22Data) => {
					updateCachedData((currentCacheData) => {
						return {
							...currentCacheData,
							...data,
						};
					});
				};

				socket.on("sensor:DHT22", listener);
				await cacheEntryRemoved;
				socket.off("sensor:DHT22", listener);
			},
		}),
		timerEvents: build.query({
			queryFn() {
				return { data: [] };
			},
			async onCacheEntryAdded(
				_arg,
				{ dispatch, cacheEntryRemoved, updateCachedData, cacheDataLoaded },
			) {
				await cacheDataLoaded;
				dispatcher = dispatch;
				await connected(dispatcher);

				const listener = (data: []) => {
					updateCachedData((currentCacheData) => {
						return {
							...currentCacheData,
							...data,
						};
					});
				};

				socket.on("timer", listener);
				await cacheEntryRemoved;
				socket.off("timer", listener);
			},
		}),
		status: build.query<{ connected: boolean }, void>({
			queryFn() {
				return { data: { connected: socket.connected } };
			},
			async onCacheEntryAdded(
				_arg,
				{ cacheEntryRemoved, updateCachedData, cacheDataLoaded },
			) {
				await cacheDataLoaded;

				const listener = () => {
					updateCachedData((currentCacheData) => {
						currentCacheData.connected = socket.connected;
					});
				};

				socketEmitterBatch("on", ["connect", "disconnect"], listener);
				await cacheEntryRemoved;
				socketEmitterBatch("off", ["connect", "disconnect"], listener);
			},
		}),
		retry: build.query<void, void>({
			queryFn() {
				if (!socket.connected) socket.connect();
				if (dispatcher) dispatcher(resetAttempts());

				return { data: undefined };
			},
		}),
	}),
});

export const {
	// useSendEventMutation,
	useDHT22SensorEventsQuery,
	useStatusQuery,
	useLazyRetryQuery,
} = SocketApi;
