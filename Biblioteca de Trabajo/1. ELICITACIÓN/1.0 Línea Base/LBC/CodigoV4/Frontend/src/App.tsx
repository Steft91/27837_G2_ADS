import { Toaster } from "@/view/components/ui/toaster";
import { Toaster as Sonner } from "@/view/components/ui/sonner";
import { TooltipProvider } from "@/view/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./view/pages/LoginPage";
import DashboardPage from "./view/pages/DashboardPage";
import SolicitarPrestamoPage from "./view/pages/SolicitarPrestamoPage";
import InventarioPage from "./view/pages/InventarioPage";
import PrestamosPage from "./view/pages/PrestamosPage";
import HistorialPage from "./view/pages/HistorialPage";
import DispositivosPage from "./view/pages/DispositivosPage";
import SolicitudEspecialPage from "./view/pages/SolicitudEspecialPage";
import AprobarSolicitudesPage from "./view/pages/AprobarSolicitudesPage";
import NotFound from "./view/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ 
  children, 
  roles 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/solicitar" 
        element={
          <ProtectedRoute roles={['estudiante']}>
            <SolicitarPrestamoPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/historial" 
        element={
          <ProtectedRoute roles={['estudiante']}>
            <HistorialPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dispositivos" 
        element={
          <ProtectedRoute roles={['estudiante']}>
            <DispositivosPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inventario" 
        element={
          <ProtectedRoute roles={['tecnico', 'admin']}>
            <InventarioPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/prestamos" 
        element={
          <ProtectedRoute roles={['tecnico', 'admin']}>
            <PrestamosPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/solicitud-especial" 
        element={
          <ProtectedRoute roles={['estudiante']}>
            <SolicitudEspecialPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/aprobar-solicitudes" 
        element={
          <ProtectedRoute roles={['tecnico', 'admin']}>
            <AprobarSolicitudesPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
