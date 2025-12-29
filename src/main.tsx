import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary";
import "./index.css";

// Wrap App with a production-safe ErrorBoundary so one component
// crash cannot blank the entire page in production deployments.
createRoot(document.getElementById("root")!).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);
