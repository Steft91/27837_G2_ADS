import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Mail, 
  Monitor, 
  Package, 
  Clock,
  LogOut 
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3A784F] text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center justify-center">
          <div className="w-40 h-40 bg-card rounded-full flex items-center justify-center shadow-lg">
            <img width={95} src='https://encuestas.espe.edu.ec/tmp/assets/46dd5aad/ESPE.png'/>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        {/* Header */}
        <header className="h-16 bg-[#D9D9D9] flex items-center justify-end px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-sidebar-foreground font-medium text-sm">
                {user?.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-dark font-medium">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppSidebar;
