import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import App from "./App";
import "@fontsource/oleo-script";
import "@fontsource/roboto";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);
