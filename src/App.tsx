import { lazy, Suspense, useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthContextProvider, AuthContext } from './contexts/AuthContext';
import { LoadContextProvider } from './contexts/LoadContext';

import './App.scss';

// Layouts - Contém componentes padrão de várias telas. ex: Menu (para telas que usam)
const MenuLayout = lazy(() => import("./layouts/menu/MenuLayout"));
const Layout = lazy(() => import("./layouts/geral/Layout"));

// Login - Telas para validação de identidade e turmas
const Login = lazy(() => import("./pages/login/Login"));
const LoginProfAdm = lazy(() => import("./pages/login/LoginProfAdm"));
const Turmas = lazy(() => import("./pages/turmas/Turmas"));

// Painel Estudante - Telas para estudantes em diferentes situações
const StudantWelcomePage = lazy(() => import("./pages/studant/WelcomePage"));

// Painel Professor - Telas para monitoramento de turmas
const TeacherDashboard = lazy(() => import("./pages/techer_dashboard/TeacherDashboard"));

// Painel Administrador - Telas para monitoramento geral do sistema e gestão de estudantes
const AdmPainel = lazy(() => import("./pages/adm_dashboard/Painel"));
const AdmAlunos = lazy(() => import("./pages/adm_dashboard/Alunos"));
const AdmFaltas = lazy(() => import("./pages/adm_dashboard/Faltas"));

function ApplyContext() {
    const { user } = useContext(AuthContext)!;

    const generalRoutes = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: '/aceder-turma', element: <Turmas /> },
                { path: '/login', element: <Login /> },
                { path: '/login-prof-adm', element: <LoginProfAdm /> },
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
            element: <MenuLayout />,
            children: [
                { path: `/adm/painel`, element: <AdmPainel /> },
                { path: `/adm/alunos`, element: <AdmAlunos /> },
                { path: `/adm/faltas`, element: <AdmFaltas /> },
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
                { path: '/', element: <Navigate to={`/estudante`} replace /> },
                { path: `/estudante`, element: <StudantWelcomePage /> },
                { path: '/*', element: <Navigate to={`/estudante`} replace /> }
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

export default App
