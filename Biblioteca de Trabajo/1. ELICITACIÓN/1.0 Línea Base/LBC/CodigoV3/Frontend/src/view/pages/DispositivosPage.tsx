import React, { useEffect, useState } from 'react';
import { Monitor, Laptop, Tablet, Camera, Mic, Loader2 } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';

import { DeviceDisponibility } from '@/types';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const DispositivosPage: React.FC = () => {
  const [deviceCategories, setDeviceCategories] = useState<DeviceDisponibility[]>([]);
  const [loading, setLoading] = useState(false);

  const processDevices = (devices: any[]): DeviceDisponibility[] => {
    const iconMap: any = {
      'Proyector': Monitor,
      'Laptop': Laptop,
      'Pantalla Inteligente': Tablet,
      'Cámara': Camera,
      'Micrófono': Mic,
    };
    const tipoCounts: any = {};

    devices.forEach(d => {
      const tipo = d.type || d.tipo;
      if (!tipo) return;
      const tipoTrim = tipo.trim();

      if (!tipoCounts[tipoTrim]) tipoCounts[tipoTrim] = { available: 0, total: 0 };
      tipoCounts[tipoTrim].total++;

      if (d.status === 'Disponible' || d.estado === 'Disponible') {
        tipoCounts[tipoTrim].available++;
      }
    });

    return Object.entries(tipoCounts).map(([type, stats]: [string, any]) => ({
      type,
      available: stats.available,
      total: stats.total,
      icon: iconMap[type] || Monitor
    }));
  };

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await api.getDispositivos();
        setDeviceCategories(processDevices(response.content));
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Error",
          description: "No se pudo cargar la disponibilidad de dispositivos",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">Consulta la disponibilidad de equipos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deviceCategories.map((category) => {
            const Icon = category.icon || Monitor;
            const availabilityPercent = category.total > 0
              ? (category.available / category.total) * 100
              : 0;

            return (
              <Card key={category.type} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {category.type}
                    </CardTitle>
                    <Badge
                      className={
                        availabilityPercent > 50
                          ? 'bg-success text-success-foreground'
                          : availabilityPercent > 20
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-destructive text-destructive-foreground'
                      }
                    >
                      {category.available} disponibles
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Disponibles</span>
                      <span className="font-medium text-foreground">{category.available} / {category.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${availabilityPercent}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppSidebar>
  );
};

export default DispositivosPage;