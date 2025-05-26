import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Dashboard } from './pages/Dashboard.tsx';

const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // Verifica se há um token no localStorage
};

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
  {
    path: "/login",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
