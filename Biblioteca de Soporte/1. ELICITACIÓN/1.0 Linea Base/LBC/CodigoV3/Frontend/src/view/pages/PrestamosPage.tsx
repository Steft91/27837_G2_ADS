import React, { useState, useEffect, useMemo } from 'react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Input } from '@/view/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Search, Filter } from 'lucide-react';
import { Badge } from '@/view/components/ui/badge';

interface Loan {
  _id: string;
  code: string;
  userId: {
    name: string;
    email: string;
    career: string;
  };
  idDispositivo: {
    name: string;
    type: string;
    serialNumber: string;
  };
  start: string;
  end: string;
  status: 'ACTIVO' | 'FINALIZADO' | 'MORA' | 'CANCELADO';
}

const PrestamosPage: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.getPrestamos();
      setLoans(response.content || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      // Status Filter
      if (statusFilter !== 'all' && loan.status !== statusFilter) return false;

      // Type Filter
      if (typeFilter !== 'all' && loan.idDispositivo?.type !== typeFilter) return false;

      // Date Filter (matches start date)
      if (dateFilter) {
        const loanDate = new Date(loan.start).toISOString().split('T')[0];
        if (loanDate !== dateFilter) return false;
      }

      return true;
    });
  }, [loans, statusFilter, typeFilter, dateFilter]);

  // Extract unique types for filter
  const deviceTypes = useMemo(() => {
    const types = new Set(loans.map(l => l.idDispositivo?.type).filter(Boolean));
    return Array.from(types);
  }, [loans]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'bg-blue-500 hover:bg-blue-600';
      case 'FINALIZADO': return 'bg-green-500 hover:bg-green-600';
      case 'MORA': return 'bg-red-500 hover:bg-red-600';
      case 'CANCELADO': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-slate-500';
    }
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Préstamos</h1>
            <p className="text-muted-foreground text-sm">Administra y visualiza todos los préstamos registrados.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLoans} className="gap-2">
            <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-muted-foreground">Estado</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVO">Activo</SelectItem>
                <SelectItem value="MORA">En Mora</SelectItem>
                <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-muted-foreground">Tipo de Equipo</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {deviceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <label className="text-xs font-semibold text-muted-foreground">Fecha</label>
            <Input
              type="date"
              className="w-full md:w-[180px]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex-1" />

          <div className="text-sm text-muted-foreground self-center">
            Mostrando {filteredLoans.length} de {loans.length} préstamos
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Estudiante</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3">Fecha Inicio</th>
                  <th className="px-4 py-3">Fecha Fin</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Cargando préstamos...
                      </div>
                    </td>
                  </tr>
                ) : filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron préstamos con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">{loan.code}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{loan.userId?.name || 'Desconocido'}</div>
                        <div className="text-xs text-muted-foreground">{loan.userId?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{loan.idDispositivo?.name || 'Equipo'}</div>
                        <div className="text-xs text-muted-foreground">{loan.idDispositivo?.type}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(loan.start), "d MMM, yyyy HH:mm", { locale: es })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(loan.end), "d MMM, yyyy HH:mm", { locale: es })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={`${getStatusColor(loan.status)} text-white border-0`}>
                          {loan.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppSidebar>
  );
};

export default PrestamosPage;