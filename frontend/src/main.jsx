import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/theme/ThemeProvider";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </SocketContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
