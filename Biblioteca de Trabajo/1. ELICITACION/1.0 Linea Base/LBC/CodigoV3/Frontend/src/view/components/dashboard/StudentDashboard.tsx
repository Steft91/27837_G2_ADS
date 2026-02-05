import React, { useEffect, useState } from 'react';
import { Monitor, Calendar, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeLoan, setActiveLoan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const fetchActiveLoan = async () => {
      setLoading(true);
      try {
        // Backend doesn't explicitly have "get active loan" but we can list all and find active
        // But checking the router I see /active endpoint!
        // router.get('/activo', auth, ...)
        // Wait, I didn't add getPrestamoActivo to api.ts service. I should check that or use getPrestamos and filter.
        // Let's check api.ts again or just use getPrestamos and filter
        // Actually, backend router says: router.get('/activo', auth, async (req, res) => { ... })
        // Let's assume I should update api.ts to include it, or just use creating a new function here if I can't edit api.ts easily (I can).
        // Let's modify api.ts first? Or just use fetch in component for now if api.ts edit is another step.
        // I prefer editing api.ts for consistency.

        // However, I can try to fetch from /prestamos and filter for 'ACTIVO' since I already have getPrestamos().

        const res = await api.getPrestamos();
        const active = res.content.find((p: any) => p.status === 'ACTIVO');

        if (active) {
          setActiveLoan(active);
          // Fetch device info
          try {
            const deviceRes = await api.getDispositivos(); // Optimization: get single device if endpoint exists
            // Endpoint /api/dispositivos/:id might exist? router.get('/:id'...) in dispositivoRouter.
            // But I didn't add getDispositivo(id) to api.ts. I only added getDispositivos().
            // I'll fetch all and find.
            const device = deviceRes.content.find((d: any) => d._id === active.idDispositivo || d.id === active.idDispositivo);
            setDeviceInfo(device);
          } catch (e) {
            console.error("Error fetching device info", e);
          }
        }

      } catch (err) {
        console.error("Error fetching active loan", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchActiveLoan();
    }
  }, [user]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatTime = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return '';
    const start = new Date(startStr);
    const end = new Date(endStr);
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
      </div>

      {/* Active Loan */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Préstamo Activo</h2>

        {loading ? (
          <div className="border rounded-lg p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : activeLoan ? (
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  {deviceInfo ? `${deviceInfo.type || deviceInfo.tipo} ${deviceInfo.marca || ''}` : 'Dispositivo'}
                </CardTitle>
                <Badge className="bg-success text-success-foreground">
                  {activeLoan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{formatDate(activeLoan.start)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="font-medium">{formatTime(activeLoan.start, activeLoan.end)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Código de préstamo:</p>
                <p className="text-lg font-bold text-primary">{activeLoan.code}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground">
              No tienes ningún préstamo activo en este momento.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">

          <CardContent className="p-6 text-center">
            <button onClick={() => navigate('/solicitar')} className="w-full h-full flex flex-col items-center">
              <Monitor className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">Solicitar Préstamo</h3>
              <p className="text-sm text-muted-foreground">Reserva un equipo tecnológico</p>
            </button>
          </CardContent>

        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <button onClick={() => navigate('/historial')} className="w-full h-full flex flex-col items-center">
              <Calendar className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">Ver Historial</h3>
              <p className="text-sm text-muted-foreground">Consulta tus préstamos anteriores</p>
            </button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <button onClick={() => navigate('/dispositivos')} className="w-full h-full flex flex-col items-center">
              <Clock className="h-12 w-12 mx-auto text-primary mb-3" />
              <h3 className="font-semibold">Horarios Disponibles</h3>
              <p className="text-sm text-muted-foreground">Consulta disponibilidad</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div >
  );
};

export default StudentDashboard;
