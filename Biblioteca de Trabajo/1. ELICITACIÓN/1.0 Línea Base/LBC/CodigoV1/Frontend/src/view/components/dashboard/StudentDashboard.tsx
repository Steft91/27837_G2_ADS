import React from 'react';
import { Monitor, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for active loan
const mockActiveLoan = {
  id: 'PRY001',
  equipment: 'Proyector MAGCUBIC HY300',
  location: 'Aula - A302',
  date: '2025-12-09',
  startTime: '10:00 am',
  endTime: '12:00 pm',
  code: 'QR25179876',
  status: 'Activo',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
      </div>

      {/* Active Loan */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Préstamo Activo</h2>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                {mockActiveLoan.equipment}
              </CardTitle>
              <Badge className="bg-success text-success-foreground">
                {mockActiveLoan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{mockActiveLoan.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Horario:</span>
                <span className="font-medium">{mockActiveLoan.startTime} - {mockActiveLoan.endTime}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Código de préstamo:</p>
              <p className="text-lg font-bold text-primary">{mockActiveLoan.code}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">

          <CardContent className="p-6 text-center">
            <button onClick={() => navigate('/solicitar')} >
              <Monitor className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">Solicitar Préstamo</h3>
              <p className="text-sm text-muted-foreground">Reserva un equipo tecnológico</p>
            </button>
          </CardContent>

        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <button onClick={() => navigate('/historial')} >
              <Calendar className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">Ver Historial</h3>
              <p className="text-sm text-muted-foreground">Consulta tus préstamos anteriores</p>
            </button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 mx-auto text-primary mb-3" />
            <h3 className="font-semibold">Horarios Disponibles</h3>
            <p className="text-sm text-muted-foreground">Consulta disponibilidad</p>
          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default StudentDashboard;
