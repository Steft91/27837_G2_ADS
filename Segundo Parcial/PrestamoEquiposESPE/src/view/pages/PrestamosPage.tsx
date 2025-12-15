import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Label } from '@/view/components/ui/label';
import { Badge } from '@/view/components/ui/badge';
import { Loan, LoanStatus } from '@/types';

const initialLoans: Loan[] = [
  { 
    id: 'PRY001', 
    equipmentId: 'PRY001',
    equipmentType: 'Proyector', 
    userId: '1',
    userName: 'Carlos Robles',
    location: 'C213', 
    date: '2025-12-01', 
    startTime: '10:00 am', 
    endTime: '12:00pm', 
    status: 'Devuelto',
    code: 'QR25179876'
  },
  { 
    id: 'PRY002', 
    equipmentId: 'PRY002',
    equipmentType: 'Proyector', 
    userId: '2',
    userName: 'Ana García',
    location: 'A302', 
    date: '2025-12-09', 
    startTime: '2:00 pm', 
    endTime: '4:00pm', 
    status: 'Activo',
    code: 'QR25179877'
  },
  { 
    id: 'LAP001', 
    equipmentId: 'LAP001',
    equipmentType: 'Laptop', 
    userId: '3',
    userName: 'Pedro Sánchez',
    location: 'B201', 
    date: '2025-12-09', 
    startTime: '9:00 am', 
    endTime: '1:00pm', 
    status: 'Activo',
    code: 'QR25179878'
  },
];

const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];
const statusOptions: LoanStatus[] = ['Activo', 'Devuelto', 'Pendiente', 'Vencido'];

const getStatusColor = (status: LoanStatus) => {
  switch (status) {
    case 'Activo': return 'bg-success text-success-foreground';
    case 'Devuelto': return 'bg-muted text-muted-foreground';
    case 'Pendiente': return 'bg-warning text-warning-foreground';
    case 'Vencido': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const PrestamosPage: React.FC = () => {
  const [loans] = useState<Loan[]>(initialLoans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loan.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || loan.equipmentType === filterType;
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    
    let matchesDate = true;
    if (dateFrom && dateTo) {
      const loanDate = new Date(loan.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      matchesDate = loanDate >= fromDate && loanDate <= toDate;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Préstamos</h1>

        {/* Search and Date Range */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="p-4 border border-border rounded-lg bg-card space-y-2">
              <p className="text-sm font-medium text-foreground">Usa los filtros para buscar préstamos específicos</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Rango de Fechas</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Desde:</span>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-36 bg-card"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hasta</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-36 bg-card"
                  />
                </div>
                <Button variant="espe" size="sm" onClick={handleClearFilters}>
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Tipo de equipo</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                {equipmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Estado</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header">
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Equipo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Ubicación</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Fecha Préstamo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Hora Inicio</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Hora Fin</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, index) => (
                <tr key={loan.id} className={index % 2 === 0 ? 'bg-table-row-even' : 'bg-table-row-odd'}>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.id}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.equipmentType}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.location}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.startTime}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{loan.endTime}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {/* Empty rows to fill table */}
              {Array(Math.max(0, 8 - filteredLoans.length)).fill(0).map((_, index) => (
                <tr key={`empty-${index}`} className={((filteredLoans.length + index) % 2 === 0) ? 'bg-table-row-even' : 'bg-table-row-odd'}>
                  <td className="py-3 px-4">&nbsp;</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default PrestamosPage;
