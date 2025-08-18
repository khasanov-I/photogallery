import { JSX } from "react";
import { MainPage } from "../../../pages/MainPage/MainPage";
import { SearchPage } from "../../../pages/SearchPage/SearchPage";
import { UsersPage } from "../../../pages/UsersPage/UsersPage";
import LoginPage from "../../../pages/LoginPage/LoginPage";
import RegisterPage from "../../../pages/RegisterPage/RegisterPage";
import ProfilePage from "../../../pages/ProfilePage/ProfilePage";
import NotFoundPage from "../../../pages/NotFoundPage/NotFoundPage";

export type AppRouterProps = {
    path: string,
    element: JSX.Element
}

export const routeConfig: Record<string, AppRouterProps> = {
    main: {
        path: '/',
        element: <MainPage />,
    },
    search: {
        path: '/search',
        element: <SearchPage />,
    },
    users: {
        path: '/users',
        element: <UsersPage />,
    },
    login: {
        path: '/login',
        element: <LoginPage />,
    },
    register: {
        path: '/register',
        element: <RegisterPage />,
    },
    profile: {
        path: '/profile/:id',
        element: <ProfilePage />,
    },
    // LAST
    notFound: {
        path: '*',
        element: <NotFoundPage />,
    },
};
