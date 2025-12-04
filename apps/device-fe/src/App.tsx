import logo from "@assets/images/logo.svg";
import { useDHT22SensorEventsQuery } from "@state/api/socketApi";
import { decrement, increment } from "@state/features/counter/counterSlice";
import { useAppDispatch, useAppSelector } from "@state/hooks";
import type { RootState } from "@state/store";
import Atmosphere from "@/components/Atmosphere";

function App() {
	const count = useAppSelector((state: RootState) => state.counter.value);
	const dispatch = useAppDispatch();
	const { data: sensor } = useDHT22SensorEventsQuery();

	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
				<div>Data from App component: {sensor?.temperature}</div>
				<div>
					Data from Atmosphere component: <Atmosphere />
				</div>
				<img
					src={logo}
					className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
					alt="logo"
				/>
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="text-[#61dafb] hover:underline"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<a
					className="text-[#61dafb] hover:underline"
					href="https://tanstack.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn TanStack
				</a>
				<div>
					<button
						type="button"
						aria-label="Increment value"
						onClick={() => dispatch(increment())}
					>
						Increment
					</button>
					<span>{count}</span>
					<button
						type="button"
						aria-label="Decrement value"
						onClick={() => dispatch(decrement())}
					>
						Decrement
					</button>
				</div>
			</header>
		</div>
	);
}

export default App;
