import {createBrowserRouter} from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage.tsx";
import MainPage from "../pages/MainPage.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import RegisterPage from "../pages/auth/RegisterPage.tsx";
import SalePage from "../pages/home/SalePage.tsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path: "/",
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            }, {
                path: "/sale",
                element: <SalePage/>
            }
        ]
    }
]);
export default router;