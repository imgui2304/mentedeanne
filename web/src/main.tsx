import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Dashboard } from './features/dashboard/Dashboard.tsx';
import { CreatePage } from './features/editor/pages/Create/CreatePage.tsx';
import { InterfacePage } from './features/editor/pages/Interface/InterfacePage.tsx';
// import { Dashboard } from './pages/Dashboard.tsx';

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Verifica se há um token no localStorage
};

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const router = createBrowserRouter([
  {
    path: "/login",
    element: <App />, // App só mostra LoginPage
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: "/create/:type",
    element: <PrivateRoute><CreatePage /></PrivateRoute>,
  },
  {
    path: "/documentos/:id",
    element: <PrivateRoute><InterfacePage /></PrivateRoute>,
  },
  {
    path: "/",
    element: <PrivateRoute><Dashboard /></PrivateRoute>, // raiz redireciona para dashboard se logado
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
