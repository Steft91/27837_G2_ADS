import React, { useEffect, useState } from 'react';
import { History, Calendar, Monitor, Clock, Loader2 } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Badge } from '@/view/components/ui/badge';
import { Card, CardContent } from '@/view/components/ui/card'; // Check imports
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVO': return 'bg-success text-success-foreground';
    case 'FINALIZADO': return 'bg-muted text-muted-foreground';
    case 'PENDIENTE_ENTREGA': return 'bg-yellow-500 text-white';
    case 'PENDIENTE': return 'bg-warning text-warning-foreground';
    case 'MORA': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const HistorialPage: React.FC = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]); // To map names
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loansRes, devicesRes] = await Promise.all([
        api.getPrestamos(), // Returns history for student
        api.getDispositivos()
      ]);
      setLoans(loansRes.content);
      setDevices(devicesRes.content);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "No se pudo cargar el historial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de anular este préstamo?')) return;
    try {
      await api.deletePrestamo(id);
      toast({ title: "Préstamo anulado" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getDeviceName = (deviceOrId: any) => {
    if (typeof deviceOrId === 'object' && deviceOrId !== null) {
      return `${deviceOrId.type || deviceOrId.tipo || ''} ${deviceOrId.name || deviceOrId.nombre || ''}`;
    }
    const device = devices.find(d => d._id === deviceOrId || d.id === deviceOrId);
    if (device) return `${device.type || device.tipo} ${device.marca || ''} ${device.modelo || ''}`;
    return 'Dispositivo desconocido';
  };

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

  if (loading) {
    return (
      <AppSidebar>
        <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AppSidebar>
    );
  }

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Historial de Solicitudes</h1>
        </div>

        <div className="space-y-4">
          {loans.length === 0 ? (
            <p className="text-muted-foreground">No tienes solicitudes en el historial.</p>
          ) : (
            loans.map((item) => (
              <Card key={item._id || item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Monitor className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{getDeviceName(item.idDispositivo)}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.start)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(item.start, item.end)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      {item.status === 'PENDIENTE_ENTREGA' && (
                        <button
                          onClick={() => handleCancel(item._id || item.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Anular
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppSidebar>
  );
};

export default HistorialPage;
