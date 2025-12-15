import React, { useState } from 'react';
import { CheckCircle, XCircle, Mail, Search, Filter } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/view/components/ui/table';
import { Badge } from '@/view/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface SpecialRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  equipmentType: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
}

const mockRequests: SpecialRequest[] = [
  {
    id: '1',
    studentName: 'Carlos Mendoza',
    studentEmail: 'cmendoza@espe.edu.ec',
    equipmentType: 'Proyector',
    date: '2024-01-20',
    startTime: '18:00',
    endTime: '21:00',
    reason: 'Presentación de tesis fuera del horario regular',
    status: 'pendiente',
  },
  {
    id: '2',
    studentName: 'María González',
    studentEmail: 'mgonzalez@espe.edu.ec',
    equipmentType: 'Laptop',
    date: '2024-01-22',
    startTime: '07:00',
    endTime: '09:00',
    reason: 'Práctica de laboratorio temprana',
    status: 'pendiente',
  },
  {
    id: '3',
    studentName: 'Luis Paredes',
    studentEmail: 'lparedes@espe.edu.ec',
    equipmentType: 'Cámara',
    date: '2024-01-18',
    startTime: '14:00',
    endTime: '18:00',
    reason: 'Grabación de documental estudiantil',
    status: 'aprobada',
  },
  {
    id: '4',
    studentName: 'Ana Suárez',
    studentEmail: 'asuarez@espe.edu.ec',
    equipmentType: 'Micrófono',
    date: '2024-01-15',
    startTime: '19:00',
    endTime: '22:00',
    reason: 'Evento cultural nocturno',
    status: 'rechazada',
  },
];

const AprobarSolicitudesPage: React.FC = () => {
  const [requests, setRequests] = useState<SpecialRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'aprobada' as const } : req
      )
    );
    toast({
      title: "Solicitud aprobada",
      description: "La solicitud especial ha sido aprobada exitosamente",
    });
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'rechazada' as const } : req
      )
    );
    toast({
      title: "Solicitud rechazada",
      description: "La solicitud especial ha sido rechazada",
    });
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.equipmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todas' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pendiente</Badge>;
      case 'aprobada':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Aprobada</Badge>;
      case 'rechazada':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Aprobar Solicitudes Especiales</h1>
        </div>

        <p className="text-muted-foreground">
          Revisa y gestiona las solicitudes especiales de préstamo realizadas por los estudiantes.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por estudiante o equipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="aprobada">Aprobadas</SelectItem>
                <SelectItem value="rechazada">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-foreground font-semibold">Estudiante</TableHead>
                <TableHead className="text-foreground font-semibold">Equipo</TableHead>
                <TableHead className="text-foreground font-semibold">Fecha</TableHead>
                <TableHead className="text-foreground font-semibold">Hora Inicio</TableHead>
                <TableHead className="text-foreground font-semibold">Hora Fin</TableHead>
                <TableHead className="text-foreground font-semibold">Motivo</TableHead>
                <TableHead className="text-foreground font-semibold">Estado</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id} className="bg-card hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{request.studentName}</p>
                        <p className="text-xs text-muted-foreground">{request.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{request.equipmentType}</TableCell>
                    <TableCell className="text-foreground">{request.date}</TableCell>
                    <TableCell className="text-foreground">{request.startTime}</TableCell>
                    <TableCell className="text-foreground">{request.endTime}</TableCell>
                    <TableCell className="text-foreground max-w-[200px]">
                      <p className="truncate" title={request.reason}>{request.reason}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.status === 'pendiente' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm text-center block">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron solicitudes especiales
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppSidebar>
  );
};

export default AprobarSolicitudesPage;
