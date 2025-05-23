import { lazy, Suspense, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from './contexts/AuthContext';
import { LoadContextProvider } from './contexts/LoadContext';

import './App.scss';

const MainLayout = lazy(() => import("./layouts/main/MainLayout"));
const AdmPainel = lazy(() => import("./pages/adm_dashboard/Painel"));
const AdmAlunos = lazy(() => import("./pages/adm_dashboard/Alunos"));
const AdmProfs = lazy(() => import("./pages/adm_dashboard/Profs"));

const TeacherDashboard = lazy(() => import("./pages/techer_dashboard/TeacherDashboard"));

const StudantWelcomePage = lazy(() => import("./pages/studant/WelcomePage"));

const Layout = lazy(() => import("./layouts/login/LoginLayout"));
const Login = lazy(() => import("./pages/login/Login"));

const Turma = lazy(() => import("./pages/turmas/Turmas"));

function App() {
    return (
        <Suspense>
            <LoadContextProvider>
                <AuthContextProvider>
                    <ApplyContext />
                </AuthContextProvider>
            </LoadContextProvider>
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
                { path: '/aceder-turma', element: <Turma /> },
                { path: '/login', element: <Login /> },
                { path: '/', element: <Navigate to='/aceder-turma' replace /> },
                { path: '/*', element: <Navigate to='/aceder-turma' replace /> },
            ]
        }
    ]);

    if (!user) return (<RouterProvider router={generalRoutes} key="guest" />);

    const { tipo } = user;

    const admDashboardRoutes = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: `/adm/painel`, element: <AdmPainel /> },
                { path: `/adm/alunos`, element: <AdmAlunos /> },
                { path: `/adm/profs`, element: <AdmProfs /> },
                { path: '/', element: <Navigate to={`/adm/painel`} replace /> },
                { path: '/*', element: <Navigate to={`/adm/painel`} replace /> },
            ]
        }
    ]);

    const studantRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Navigate to={`/`} replace /> },
                { path: `/`, element: <StudantWelcomePage /> },
                { path: '/*', element: <Navigate to={`/`} replace /> }
            ]
        }
    ]);

    const profDashboardRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/', element: <Navigate to={`/prof/`} replace /> },
                { path: `/prof/`, element: <TeacherDashboard /> },
                { path: '/*', element: <Navigate to={`/prof/`} replace /> }
            ]
        },
    ]);
    
    const route = tipo === 'adm' ? admDashboardRoutes : tipo === 'estudante' ? studantRoutes : profDashboardRoutes;

    return <RouterProvider router={route} key={user.tipo} />
}

export default App
