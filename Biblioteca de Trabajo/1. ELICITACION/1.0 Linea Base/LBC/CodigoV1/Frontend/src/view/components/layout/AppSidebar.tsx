import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Mail, 
  Monitor, 
  Package, 
  Clock,
  LogOut,
  Menu, // Importamos icono de hamburguesa
  X     // Importamos icono de cerrar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['estudiante', 'tecnico', 'admin'] },
  { icon: FileText, label: 'Realizar Solicitud', path: '/solicitar', roles: ['estudiante'] },
  { icon: History, label: 'Historial Solicitudes', path: '/historial', roles: ['estudiante'] },
  { icon: Mail, label: 'Solicitud Especial', path: '/solicitud-especial', roles: ['estudiante'] },
  { icon: Mail, label: 'Aprobar Solicitudes', path: '/aprobar-solicitudes', roles: ['tecnico', 'admin'] },
  { icon: Package, label: 'Inventario', path: '/inventario', roles: ['tecnico', 'admin'] },
  { icon: Clock, label: 'Préstamos', path: '/prestamos', roles: ['tecnico', 'admin'] },
  { icon: Monitor, label: 'Dispositivos', path: '/dispositivos', roles: ['estudiante'] },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú en móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* Overlay (Fondo oscuro) para móviles cuando el menú está abierto */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        // Clases base
        "max-h-screen fixed inset-y-0 left-0 z-50 w-64 bg-[#3A784F] text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out",
        // Lógica Móvil: Si está abierto translate-x-0, si no, oculto a la izquierda
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        // Lógica Desktop (md): Siempre visible y relativo (ocupa espacio físico)
        "md:sticky md:translate-x-0"
      )}>
        
        {/* Botón X para cerrar en móvil dentro del sidebar */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-white md:hidden hover:bg-white/10 p-1 rounded"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 flex items-center justify-center">
          <div className="w-40 h-40 bg-card rounded-full flex items-center justify-center shadow-lg">
             <img width={95} src='https://encuestas.espe.edu.ec/tmp/assets/46dd5aad/ESPE.png' alt="Logo"/>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              // Cerramos el menú al hacer clic en un link (UX móvil)
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground hover:bg-[#e94d4d]"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#D9D9D9] flex items-center justify-between px-6 sticky top-0 z-30">
          
          {/* Botón Hamburguesa (Solo visible en Móvil) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-black/10 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-dark" />
          </button>

          {/* User Info (Alineado a la derecha) */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-sidebar-foreground font-medium text-sm">
                {user?.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-dark font-medium hidden sm:block">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppSidebar;