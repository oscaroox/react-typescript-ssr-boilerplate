import React from "react";
import { hydrate } from "react-dom";
import Loadable from "react-loadable";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/App";

const component = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

Loadable.preloadReady()
.then(() => {
    hydrate(component, document.getElementById("root"));
});
