import React from "react";
import { hot } from "react-hot-loader";

export class RootApp extends React.Component {
    public render() {
        return <div>App</div>;
    }
}

export const App = hot(module)(RootApp);
