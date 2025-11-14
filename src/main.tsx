// import { StrictMode } from "";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserContextProvider } from "./context/UserContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <UserContextProvider>
    <ThemeProvider>
      <AppWrapper>
        <Toaster richColors/>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </UserContextProvider>,
);
