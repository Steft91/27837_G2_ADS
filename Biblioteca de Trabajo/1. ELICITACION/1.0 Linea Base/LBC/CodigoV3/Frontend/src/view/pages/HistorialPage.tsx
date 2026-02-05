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
    case 'PENDIENTE': return 'bg-warning text-warning-foreground';
    case 'MORA': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const HistorialPage: React.FC = () => {
  const [loans, setLoans] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]); // To map names
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    fetchData();
  }, []);

  const getDeviceName = (id: string) => {
    const device = devices.find(d => d._id === id || d.id === id);
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
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
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
