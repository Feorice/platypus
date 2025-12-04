import { useLazyRetryQuery, useStatusQuery } from "@state/api/socketApi.ts";
import { selectAttempts } from "@state/features/appSlice";
import { useAppSelector } from "@state/hooks";
import { SOCKET_RECONNECTION_ATTEMPTS } from "@/lib/constants.ts";

const StatusPage = () => {
	const { data } = useStatusQuery();
	const [handleRetry] = useLazyRetryQuery();
	const connectAttempts = useAppSelector(selectAttempts);

	const getStatusMessage = () => {
		if (data?.connected) return "connected";

		return "disconnected";
	};

	const getRetries = () => {
		console.log("connect attempts", connectAttempts);
		if (connectAttempts > 0 && connectAttempts < SOCKET_RECONNECTION_ATTEMPTS) {
			return <div>Connection attempts: {connectAttempts}</div>;
		} else if (connectAttempts === SOCKET_RECONNECTION_ATTEMPTS) {
			return <div>Reached max connection attempts</div>;
		}

		return null;
	};

	return (
		<div>
			<div>Status: {data?.connected ? "Connected" : "Disconnected"}</div>
			<div>{getRetries()}</div>
			<button type="button" onClick={() => handleRetry(undefined, false)}>
				Retry
			</button>
		</div>
	);
};

export default StatusPage;
