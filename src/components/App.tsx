import React from "react";
import { hot } from "react-hot-loader";
import { Link, Route } from "react-router-dom";
import { AsyncAboutPage, AsyncHomePage } from "./pages";

export class RootApp extends React.Component {
    public render() {
        return <div>
            <Route exact path="/" component={AsyncHomePage} />
            <Route path="/about" component={AsyncAboutPage} />

            <div>links</div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </div>;
    }
}

export const App = hot(module)(RootApp);
