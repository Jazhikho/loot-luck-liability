import React from "react";
import ReactDOM from "react-dom/client";
import Game from "./Game.jsx";
import { I18nProvider } from "./i18n/index.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <Game />
    </I18nProvider>
  </React.StrictMode>
);
