import React, { useEffect, useState, useMemo } from 'react';
import { Monitor, Package, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/view/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
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

  // Validation Modal State
  const [showValidation, setShowValidation] = useState(false);
  const [validationCode, setValidationCode] = useState('');
  const [validating, setValidating] = useState(false);

  const fetchLoans = async () => {
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

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleValidate = async () => {
    if (!validationCode) return;
    setValidating(true);
    try {
      await api.validatePrestamo(validationCode);
      toast({ title: "Préstamo validado exitosamente", variant: "default" });
      setShowValidation(false);
      setValidationCode('');
      fetchLoans();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setValidating(false);
    }
  };

  const { pendingDelivery, overdueLoans, stats } = useMemo(() => {
    const now = new Date();

    // "Pendiente de entrega" - Actually PENDIENTE_ENTREGA
    const pending = loans.filter(l => l.status === 'PENDIENTE_ENTREGA');

    // "Active" - Loans that are currently out working fine
    const active = loans.filter(l => l.status === 'ACTIVO');

    // "En Mora" (Explicit MORA status or Active but past end date)
    const overdue = loans.filter(l => l.status === 'MORA' || (l.status === 'ACTIVO' && new Date(l.end) < now));

    // Stats
    const totalActive = active.length + pending.length + overdue.length;

    return {
      pendingDelivery: pending,
      overdueLoans: overdue,
      pendingReturnsCount: totalActive,
      stats: {
        activeLoans: active.length,
        pending: pending.length,
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Panel de control - {user?.role === 'admin' ? 'Administrador' : 'Técnico'}</p>
        </div>
        <Button onClick={() => setShowValidation(true)}>
          Validar Préstamo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Por Entregar</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos (Entregados)</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendiente de Entrega */}
        <Card className="h-full border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Package className="h-5 w-5" />
              Pendientes de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingDelivery.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No hay préstamos pendientes de entrega.</p>
            ) : (
              <div className="space-y-4">
                {pendingDelivery.map((loan) => (
                  <div
                    key={loan._id}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg hover:bg-yellow-100/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{loan.idDispositivo?.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{loan.userId?.name || 'Desconocido'}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => setShowValidation(true)}
                    >
                      Entregar
                    </Button>
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

      {/* Validation Dialog */}
      <Dialog open={showValidation} onOpenChange={setShowValidation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validar Entrega de Préstamo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted mb-4 rounded-md text-sm text-muted-foreground">
              Solicita al estudiante el <strong>código QR</strong> o el código de texto que aparece en su solicitud.
            </div>
            <p className="text-sm font-medium mb-2">Código del Préstamo:</p>
            <Input
              placeholder="Ej: A1B2C3D4"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="text-center font-mono text-lg tracking-widest uppercase"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidation(false)}>Cancelar</Button>
            <Button onClick={handleValidate} disabled={validating}>
              {validating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validar Entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TechnicianDashboard;
