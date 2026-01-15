import React from 'react';
import { Monitor, Users, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const stats = {
  activeLoans: 12,
  pendingReturns: 5,
  availableEquipment: 28,
  totalEquipment: 45,
};

const upcomingLoans = [
  { id: 'PRY002', user: 'Ana García', equipment: 'Proyector', time: '2:00 pm - 4:00 pm', location: 'B201' },
  { id: 'PRY003', user: 'Luis Mendoza', equipment: 'Laptop', time: '3:00 pm - 5:00 pm', location: 'A105' },
  { id: 'PRY004', user: 'María Torres', equipment: 'Proyector', time: '4:00 pm - 6:00 pm', location: 'C302' },
];

const activeLoans = [
  { id: 'PRY001', user: 'Carlos Robles', equipment: 'Proyector MAGCUBIC', startTime: '10:00 am', endTime: '12:00 pm', status: 'Activo' },
  { id: 'LAP001', user: 'Pedro Sánchez', equipment: 'Laptop HP', startTime: '9:00 am', endTime: '1:00 pm', status: 'Activo' },
  { id: 'TAB001', user: 'Laura Díaz', equipment: 'Tablet Samsung', startTime: '8:00 am', endTime: '10:00 am', status: 'Por vencer' },
];

const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Panel de control - {user?.role === 'admin' ? 'Administrador' : 'Técnico'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Préstamos Activos</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeLoans}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Devoluciones Pendientes</p>
                <p className="text-3xl font-bold text-foreground">{stats.pendingReturns}</p>
              </div>
              <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Equipos Disponibles</p>
                <p className="text-3xl font-bold text-foreground">{stats.availableEquipment}</p>
              </div>
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Equipos</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalEquipment}</p>
              </div>
              <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Préstamos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeLoans.map((loan) => (
                <div 
                  key={loan.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{loan.equipment}</p>
                    <p className="text-sm text-muted-foreground">{loan.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{loan.startTime} - {loan.endTime}</p>
                    <Badge 
                      className={
                        loan.status === 'Activo' 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-warning text-warning-foreground'
                      }
                    >
                      {loan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Loans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximos Préstamos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLoans.map((loan) => (
                <div 
                  key={loan.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{loan.equipment}</p>
                    <p className="text-sm text-muted-foreground">{loan.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{loan.time}</p>
                    <p className="text-xs text-muted-foreground">{loan.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
