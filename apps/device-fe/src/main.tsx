import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";
import { store } from "@state/store.ts";
import { Provider } from "react-redux";
import App from "./App.tsx";
import Header from "./components/Header.tsx";
import Status from "./pages/Status.tsx";
import Test from "./pages/Test.tsx";
import reportWebVitals from "./reportWebVitals.ts";

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Header />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: App,
});

const testRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/test",
	component: Test,
});

const statusRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/status",
	component: Status,
});

const routeTree = rootRoute.addChildren([indexRoute, testRoute, statusRoute]);

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
