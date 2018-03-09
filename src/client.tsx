import React from "react";
import { hydrate } from "react-dom";
import Loadable from "react-loadable";
import { BrowserRouter as Routes } from "react-router-dom";
import { App } from "./components/App";

const component = (
    <Routes>
        <App />
    </Routes>
);

Loadable.preloadReady()
.then(() => {
    hydrate(component, document.getElementById("root"));
});
