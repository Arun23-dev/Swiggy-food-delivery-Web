import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "../src/Store/Store.js"
import { TooltipProvider } from '@/components/ui/tooltip'
createRoot(document.getElementById("root")).render(
  <StrictMode>

    <Provider store={store}>
      <TooltipProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TooltipProvider>
    </Provider>
  // </StrictMode>,
);
