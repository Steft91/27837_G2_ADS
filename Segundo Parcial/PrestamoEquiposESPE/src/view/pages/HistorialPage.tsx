import React from 'react';
import { History, Calendar, Monitor, Clock } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Badge } from '@/view/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { LoanStatus } from '@/types';

const mockHistory = [
  { id: 'PRY001', equipment: 'Proyector MAGCUBIC HY300', date: '2025-12-01', time: '10:00 am - 12:00 pm', status: 'Devuelto' as LoanStatus },
  { id: 'LAP002', equipment: 'Laptop HP ProBook', date: '2025-11-28', time: '2:00 pm - 4:00 pm', status: 'Devuelto' as LoanStatus },
  { id: 'TAB001', equipment: 'Tablet Samsung Galaxy', date: '2025-11-25', time: '9:00 am - 11:00 am', status: 'Devuelto' as LoanStatus },
];

const getStatusColor = (status: LoanStatus) => {
  switch (status) {
    case 'Activo': return 'bg-success text-success-foreground';
    case 'Devuelto': return 'bg-muted text-muted-foreground';
    case 'Pendiente': return 'bg-warning text-warning-foreground';
    case 'Vencido': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const HistorialPage: React.FC = () => {
  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Historial de Solicitudes</h1>
        </div>

        <div className="space-y-4">
          {mockHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Monitor className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.equipment}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
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
          ))}
        </div>
      </div>
    </AppSidebar>
  );
};

export default HistorialPage;
