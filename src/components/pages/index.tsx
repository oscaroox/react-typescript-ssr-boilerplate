import Loadable from "react-loadable";
import { Loading } from "../Loading";

export const AsyncHomePage = Loadable({
    loader: () => import("./HomePage"),
    loading: Loadable,
});

export const AsyncAboutPage = Loadable({
    loader: () => import("./AboutPage"),
    loading: Loadable,
});
