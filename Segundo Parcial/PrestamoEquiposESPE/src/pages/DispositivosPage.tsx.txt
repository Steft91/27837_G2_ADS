import React from 'react';
import { Monitor, Laptop, Tablet, Camera, Mic } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const deviceCategories = [
  { name: 'Proyectores', icon: Monitor, available: 8, total: 12 },
  { name: 'Laptops', icon: Laptop, available: 15, total: 20 },
  { name: 'Tablets', icon: Tablet, available: 10, total: 15 },
  { name: 'Cámaras', icon: Camera, available: 5, total: 8 },
  { name: 'Micrófonos', icon: Mic, available: 12, total: 15 },
];

const DispositivosPage: React.FC = () => {
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
            const availabilityPercent = (category.available / category.total) * 100;
            
            return (
              <Card key={category.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {category.name}
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
