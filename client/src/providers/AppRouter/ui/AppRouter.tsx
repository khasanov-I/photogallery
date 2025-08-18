import {JSX, Suspense, memo, useCallback} from 'react';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import {AppRouterProps, routeConfig} from '../config/routeConfig';
import {Layout} from './Layout';

export const AppRouter = memo((): JSX.Element => {
    const renderWithWrapper = useCallback((route: AppRouterProps) => {
        const element = (
            <Suspense fallback="Загрузка">
                {route.element}
            </Suspense>
        );
        return (
            <Route
                key={route.path}
                path={route.path}
                element={element}/>
        );
    }, []);

    const router = createBrowserRouter(createRoutesFromElements(<Route element={<Layout />}>
        {Object.values(routeConfig).map(renderWithWrapper)}
    </Route>));

    return (
        <RouterProvider router={router} />
    );
});
