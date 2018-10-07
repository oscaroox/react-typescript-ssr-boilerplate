import React from "react";
import { hot } from "react-hot-loader";
import "./About.css";

export class AboutPage extends React.Component<any, any> {
  public render() {
    return (
      <div>
        About Page
      </div>
    );
  }
}

export default hot(module)(AboutPage);
