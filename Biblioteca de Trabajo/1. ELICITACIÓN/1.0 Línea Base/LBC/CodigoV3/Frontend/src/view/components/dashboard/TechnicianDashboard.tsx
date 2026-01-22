import React, { useEffect, useState, useMemo } from 'react';
import { Monitor, Package, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Loan {
  _id: string;
  code: string;
  userId: {
    name: string;
    email: string;
  };
  idDispositivo: {
    name: string;
    type: string;
  };
  start: string;
  end: string;
  status: 'ACTIVO' | 'FINALIZADO' | 'MORA' | 'CANCELADO';
}

const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loansResponse = await api.getPrestamos();
        setLoans(loansResponse.content || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { activeLoans, overdueLoans, pendingReturnsCount, stats } = useMemo(() => {
    const now = new Date();

    // "Pendiente de entrega" (interpreted as Active loans currently out)
    const active = loans.filter(l => l.status === 'ACTIVO' && new Date(l.end) > now);

    // "En Mora" (Explicit MORA status or Active but past end date)
    const overdue = loans.filter(l => l.status === 'MORA' || (l.status === 'ACTIVO' && new Date(l.end) < now));

    // Stats
    const totalActive = active.length + overdue.length;
    const pendingReturns = totalActive; // Total devices out
    // Since we don't have total equipment count from this API, we can either fetch devices or just show loan stats.
    // For now I'll just keep the loan stats accurate.

    return {
      activeLoans: active,
      overdueLoans: overdue,
      pendingReturnsCount: pendingReturns,
      stats: {
        activeLoans: totalActive,
        mora: overdue.length,
        todayLoans: loans.filter(l => {
          const today = new Date().toISOString().split('T')[0];
          return new Date(l.start).toISOString().split('T')[0] === today;
        }).length
      }
    };
  }, [loans]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Panel de control - {user?.role === 'admin' ? 'Administrador' : 'Técnico'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm text-muted-foreground">En Mora</p>
                <p className="text-3xl font-bold text-destructive">{stats.mora}</p>
              </div>
              <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Solicitados Hoy</p>
                <p className="text-3xl font-bold text-foreground">{stats.todayLoans}</p>
              </div>
              <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendiente de Entrega (Active Loans) */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Pendiente de Entrega (Activos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No hay préstamos activos pendientes de entrega.</p>
            ) : (
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="flex items-center justify-between p-3 bg-muted/50 border border-border/50 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{loan.idDispositivo?.name}</p>
                      <p className="text-sm text-primary font-medium">{loan.userId?.name || 'Desconocido'}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-xs text-muted-foreground">Devolución:</p>
                      <p className="text-sm font-medium text-foreground">
                        {format(new Date(loan.end), "HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* En Mora (Overdue Loans) */}
        <Card className="h-full border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              En Mora
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueLoans.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No hay préstamos en mora.</p>
            ) : (
              <div className="space-y-4">
                {overdueLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/10 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{loan.idDispositivo?.name}</p>
                      <p className="text-sm text-destructive font-medium">{loan.userId?.name || 'Desconocido'}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <Badge variant="destructive">Vencido</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(loan.end), "d MMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
