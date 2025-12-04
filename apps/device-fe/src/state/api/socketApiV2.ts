const apiPrefix = 'api';

import { io, type Socket } from 'socket.io-client';

// Create the socket instance only once for a specific socket.io namespace.
export const createSocketFactory = (wsNamespace: string) => {
	let _socket: Socket;

	return async (): Promise<Socket> => {
		if (!_socket) {
			const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);

			_socket = io(API_URL.replace(apiPrefix, wsNamespace), {
				auth: {
					[ACCESS_TOKEN]: accessToken,
				},
				transports: ['websocket', 'polling'],
				withCredentials: true,
			});
		}

		if (_socket.disconnected) {
			_socket.connect();
		}

		return _socket;
	};
};

// Since I use socket.io, i've made the socketEmitAsPromise to transform the response as a promise by using the callback of socket.io response.
// My API return either {data: xxx, error: null} OR {data: null, error: xxx}.
// So in the callback I can either reject or resolve my response and use the queryFulfilled of RTKq perfectly !
export const socketEmitAsPromise = (socket: Socket) => {
	return <TData = any>(message: string, data: TData): Promise<any> => {
		return new Promise((resolve, reject) => {
			socket.emit(message, data, (response: WsResponse<TData>) => {
				if (response.error) {
					reject(response);
				} else {
					resolve(response);
				}
			});
		});
	};
};

const getSocket = createSocketFactory('events');

export const eventChatApi = rootApi.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		sendMessage: builder.mutation<
			IEventChatMessageActivity,
			{ message: string; eventId: string }
		>({
			queryFn: async (data) => {
				const socket = await getSocket();

				return socketEmitAsPromise(socket)(EventWsMessages.SEND_MESSAGE, data);
			},
			async onQueryStarted(data, { dispatch, queryFulfilled, getState }) {
				let me = userApi.endpoints.me.select()(getState()).data;

				if (!me) {
					me = await dispatch(userApi.endpoints.me.initiate()).unwrap();
				}

				const patchResult = dispatch(
					eventChatApi.util.updateQueryData(
						'readActivities',
						data.eventId,
						(draft) => {
							draft.push({
								id: nanoid(), // Thanks RTK for the nanoid export :P
								message: data.message,
								author: me!,
								eventId: data.eventId,
								type: EventChatActivitiesType.MESSAGE,
								updatedAt: new Date().toISOString(),
								createdAt: new Date().toISOString(),
							});
						},
					),
				);

				try {
					// Since the response is a Promise now (see comment above socketEmitAsPromise), I can use queryFulfilled
					const result = await queryFulfilled;

					dispatch(
						eventApi.util.updateQueryData(
							'readAllEventsWhereImInvolved',
							undefined,
							(draft) => {
								const index = draft.findIndex(
									(item) => item.id === data.eventId,
								);

								if (index !== -1) {
									draft[index].chatActivities = [result.data];
								}
							},
						),
					);
				} catch {
					patchResult.undo();

					toast.error(dispatch)('Une erreur est survenue.');

					dispatch(
						eventChatApi.util.invalidateTags([
							{ type: 'EventChatActivities', id: data.eventId },
						]),
					);
				}
			},
		}),
		readActivities: builder.query<IEventChatActivity[], string>({
			keepUnusedDataFor: 0,
			providesTags: (_, __, eventId) => [
				{ type: 'EventChatActivities', id: eventId },
			],
			query: (eventId) => `events/${eventId}/chat-activities`,
			transformResponse(baseQueryReturnValue: IEventChatActivity[]) {
				return baseQueryReturnValue.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
				);
			},
			async onCacheEntryAdded(
				eventId,
				{ updateCachedData, cacheDataLoaded, cacheEntryRemoved },
			) {
				const socket = await getSocket();

				// Add the items to the previous one fetched by the HTTP query at first
				const listener = (activity: IEventChatActivity) => {
					updateCachedData((draft) => {
						draft.push(activity);
					});
				};

				try {
					await cacheDataLoaded;

					socket.on(EventWsMessages.SEND_ACTIVITY_BACK, listener);
				} catch (err) {
					console.error(err);
				}

				await cacheEntryRemoved;

				socket.removeListener(EventWsMessages.SEND_ACTIVITY_BACK, listener);
			},
		}),
	}),
});
