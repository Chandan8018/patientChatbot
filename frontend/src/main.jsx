import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/theme/ThemeProvider";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <SocketContextProvider>
          <ErrorBoundary>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ErrorBoundary>
        </SocketContextProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
