import { lazy, Suspense, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from './contexts/AuthContext';

import './App.scss';

const MainLayout = lazy(() => import("./layouts/main/MainLayout"));
const AdmTurmas = lazy(() => import("./pages/adm_dashboard/Turmas"));
const AdmAlunos = lazy(() => import("./pages/adm_dashboard/Alunos"));
const AdmProfs = lazy(() => import("./pages/adm_dashboard/Profs"));

const TeacherDashboard = lazy(() => import("./pages/techer_dashboard/TeacherDashboard"));

const StudantWelcomePage = lazy(() => import("./pages/studant/WelcomePage"));

const Layout = lazy(() => import("./layouts/login/LoginLayout"));
const Login = lazy(() => import("./pages/login/Login"));

function App() {
    return (
        <Suspense>
            <AuthContextProvider>
                <ApplyContext />
            </AuthContextProvider>
        </Suspense>
    )
}

function ApplyContext() {
    const { user } = useContext(AuthContext)!;

    const generalRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/login', element: <Login /> },
                { path: '/', element: <Navigate to='/login' replace /> },
                { path: '/*', element: <Navigate to='/login' replace /> },
            ]
        }
    ]);

    if (!user) return (<RouterProvider router={generalRoutes} />);

    const { type, id } = user;

    const admDashboardRoutes = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: `/adm/${id}/turmas`, element: <AdmTurmas /> },
                { path: `/adm/${id}/alunos`, element: <AdmAlunos /> },
                { path: `/adm/${id}/profs`, element: <AdmProfs /> },
                { path: '/', element: <Navigate to={`/adm/${id}/turmas`} replace /> },
                { path: '/*', element: <Navigate to={`/adm/${id}/turmas`} replace /> },
            ]
        }
    ]);

    const studantRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Navigate to={`/${id}`} replace /> },
                { path: `/${id}`, element: <StudantWelcomePage /> },
                { path: '/*', element: <Navigate to={`/${id}`} replace /> }
            ]
        }
    ]);

    const profDashboardRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Navigate to={`/prof/${id}`} replace /> },
                { path: `/prof/${id}`, element: <TeacherDashboard /> },
                { path: '/*', element: <Navigate to={`/prof/${id}`} replace /> }
            ]
        },
    ]);

    const route = type === 'adm' ? admDashboardRoutes : type === 'studant' ? studantRoutes : profDashboardRoutes;

    return <RouterProvider router={route} />
}

export default App
