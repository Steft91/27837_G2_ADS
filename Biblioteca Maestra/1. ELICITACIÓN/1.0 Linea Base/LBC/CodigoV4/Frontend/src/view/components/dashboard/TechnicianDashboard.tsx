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

  // Validation/Management Modal State
  const [showManagement, setShowManagement] = useState(false);
  const [managementCode, setManagementCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundLoan, setFoundLoan] = useState<Loan | null>(null);
  const [processing, setProcessing] = useState(false);

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

  const handleSearch = async () => {
    if (!managementCode) return;
    setSearching(true);
    setFoundLoan(null);
    try {
      const response = await api.getPrestamoByCode(managementCode);
      setFoundLoan(response.content);
    } catch (err: any) {
      toast({ title: "No encontrado", description: "No se encontró un préstamo con ese código", variant: "destructive" });
      setFoundLoan(null);
    } finally {
      setSearching(false);
    }
  };

  const handleDeliver = async () => {
    if (!foundLoan) return;
    setProcessing(true);
    try {
      await api.validatePrestamo(foundLoan.code);
      toast({ title: "Préstamo entregado exitosamente", variant: "default" });
      handleCloseManagement();
      fetchLoans();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleFinalize = async () => {
    if (!foundLoan) return;
    setProcessing(true);
    try {
      await api.finalizePrestamo(foundLoan._id);
      toast({ title: "Préstamo finalizado exitosamente", variant: "default" });
      handleCloseManagement();
      fetchLoans();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseManagement = () => {
    setShowManagement(false);
    setManagementCode('');
    setFoundLoan(null);
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
        <Button onClick={() => setShowManagement(true)}>
          Gestionar Préstamo
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
                      onClick={() => {
                        setManagementCode(loan.code);
                        setShowManagement(true);
                        // Optional: auto-search immediately if we pass the code?
                        // For now just open modal pre-filled
                      }}
                    >
                      Gestionar
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

      {/* Management Dialog */}
      <Dialog open={showManagement} onOpenChange={handleCloseManagement}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gestionar Préstamo</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Código (Ej: A1B2C3D4)"
                value={managementCode}
                onChange={(e) => setManagementCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="font-mono uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching || !managementCode}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
              </Button>
            </div>

            {foundLoan && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-3 border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Estudiante</p>
                  <p className="font-medium">{foundLoan.userId?.name}</p>
                  <p className="text-sm text-muted-foreground">{foundLoan.userId?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dispositivo</p>
                    <p className="font-medium">{foundLoan.idDispositivo?.name}</p>
                    <Badge variant="outline">{foundLoan.idDispositivo?.type}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Estado</p>
                    <Badge
                      variant={
                        foundLoan.status === 'ACTIVO' ? 'default' :
                          foundLoan.status === 'PENDIENTE_ENTREGA' ? 'secondary' :
                            foundLoan.status === 'MORA' ? 'destructive' : 'outline'
                      }
                    >
                      {foundLoan.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {foundLoan && (
              <div className="flex justify-end gap-2 pt-2">
                {foundLoan.status === 'PENDIENTE_ENTREGA' && (
                  <Button onClick={handleDeliver} disabled={processing} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entregar Dispositivo
                  </Button>
                )}

                {(foundLoan.status === 'ACTIVO' || foundLoan.status === 'MORA') && (
                  <Button onClick={handleFinalize} disabled={processing} className="w-full" variant="default">
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finalizar Préstamo (Devolución)
                  </Button>
                )}

                {(foundLoan.status === 'FINALIZADO' || foundLoan.status === 'CANCELADO') && (
                  <p className="text-center w-full text-muted-foreground italic text-sm">
                    Este préstamo ya ha finalizado.
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default TechnicianDashboard;
