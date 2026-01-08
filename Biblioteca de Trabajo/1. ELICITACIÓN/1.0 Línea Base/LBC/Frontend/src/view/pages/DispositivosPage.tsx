import React, { useEffect, useState } from 'react';
import { Monitor, Laptop, Tablet, Camera, Mic } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';

import { Dispositivo } from "@/datos/model/dispositivoModel";
import { DispositivoRepository } from "@/datos/repository/dispositivoRepository";
import { DispositivoController } from "@/controller/dispositivoController";
import { RepositoryObserver } from "@/datos/repository/repositoryObserver";
import { DeviceDisponibility } from '@/types';

const repository = new DispositivoRepository();
const controller = new DispositivoController(repository);

const DispositivosPage: React.FC = () => {
  const [deviceCategories, setDeviceCategories] = useState<DeviceDisponibility[]>([]);

  useEffect(() => {
    setDeviceCategories(controller.obtenerDisponibles());

    const observer: RepositoryObserver<Dispositivo> = {
      update(data) {
        console.log('[Observer] Datos actualizados, refrescando vista:', data);
        setDeviceCategories(controller.obtenerDisponibles());
      },
  
      error(err) {
        console.error('[Observer] Error detectado:', err.message);
      }
    };
  
    repository.attach(observer);
      
    return () => repository.detach(observer);
  }, []);

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">Consulta la disponibilidad de equipos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deviceCategories.map((category) => {
            const Icon = category.icon;
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