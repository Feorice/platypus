import logo from "@assets/images/logo.svg";
import { decrement, increment } from "@state/features/counter/counterSlice";
import type { RootState } from "@state/hooks";
import { useAppDispatch, useAppSelector } from "@state/hooks";

function App() {
	const count = useAppSelector((state: RootState) => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
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
