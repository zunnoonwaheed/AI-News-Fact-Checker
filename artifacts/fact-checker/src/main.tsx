import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Configure API client to connect to backend server
// In production, set VITE_API_URL to your deployed backend URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
setBaseUrl(apiUrl);

createRoot(document.getElementById("root")!).render(<App />);
