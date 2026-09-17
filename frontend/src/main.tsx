import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2600,
        style: {
          background: "var(--panel)",
          color: "var(--ink)",
          border: "1px solid var(--line)",
          borderRadius: "10px",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          boxShadow: "var(--shadow-pop)",
        },
        success: { iconTheme: { primary: "var(--signal)", secondary: "var(--panel)" } },
        error: { iconTheme: { primary: "var(--red)", secondary: "var(--panel)" } },
      }}
    />
    <App />
  </StrictMode>
);
