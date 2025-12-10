import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Equipment, EquipmentStatus } from '@/types';

const initialEquipment: Equipment[] = [
  { id: 'PRY001', type: 'Proyector', brand: 'MAGCUBIC', model: 'HY300', location: 'Aula - A302', status: 'Prestado' },
  { id: 'PRY002', type: 'Proyector', brand: 'Wanbo', model: 'X5 Pro', location: 'Bodega', status: 'Disponible' },
  { id: 'PRY003', type: 'Proyector', brand: 'MAGCUBIC', model: 'HY300', location: 'Bodega', status: 'Mantenimiento' },
  { id: 'PRY004', type: 'Proyector', brand: 'MAGCUBIC', model: 'HY300', location: 'Bodega', status: 'Dañado' },
];

const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];
const statusOptions: EquipmentStatus[] = ['Disponible', 'Prestado', 'Mantenimiento', 'Dañado'];

const getStatusColor = (status: EquipmentStatus) => {
  switch (status) {
    case 'Disponible': return 'bg-status-available text-success-foreground';
    case 'Prestado': return 'bg-status-borrowed text-warning-foreground';
    case 'Mantenimiento': return 'bg-status-maintenance text-warning-foreground';
    case 'Dañado': return 'bg-status-damaged text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const InventarioPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterModel, setFilterModel] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    type: 'Proyector',
    brand: '',
    model: '',
    location: '',
    status: 'Disponible' as EquipmentStatus,
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesModel = filterModel === 'all' || item.model === filterModel;
    return matchesSearch && matchesType && matchesStatus && matchesModel;
  });

  const handleAddEquipment = () => {
    const newId = `${newEquipment.type.substring(0, 3).toUpperCase()}${String(equipment.length + 1).padStart(3, '0')}`;
    setEquipment([...equipment, { ...newEquipment, id: newId }]);
    setIsAddDialogOpen(false);
    setNewEquipment({ type: 'Proyector', brand: '', model: '', location: '', status: 'Disponible' });
    toast({
      title: "Equipo agregado",
      description: `El equipo ${newId} ha sido agregado al inventario`,
    });
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
    toast({
      title: "Equipo eliminado",
      description: `El equipo ${id} ha sido eliminado del inventario`,
    });
  };

  const uniqueModels = [...new Set(equipment.map(e => e.model))];

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        
        <p className="text-sm text-muted-foreground">
          * Agregue Nuevos equipos o haga inventario de los que ya tiene
        </p>

        {/* Search and Add */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="espe">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Equipo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Equipo</Label>
                  <Select 
                    value={newEquipment.type} 
                    onValueChange={(v) => setNewEquipment({...newEquipment, type: v})}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {equipmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input
                    value={newEquipment.brand}
                    onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select 
                    value={newEquipment.status} 
                    onValueChange={(v) => setNewEquipment({...newEquipment, status: v as EquipmentStatus})}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="espe" className="w-full" onClick={handleAddEquipment}>
                  Agregar Equipo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Modelo</Label>
            <Select value={filterModel} onValueChange={setFilterModel}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                {uniqueModels.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
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
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Dispositivo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Modelo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Ubicación</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Estado</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-table-row-even' : 'bg-table-row-odd'}>
                  <td className="py-3 px-4 text-sm text-foreground">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-primary underline cursor-pointer">{item.brand} {item.model}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{item.location}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDeleteEquipment(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Empty rows to fill table */}
              {Array(Math.max(0, 8 - filteredEquipment.length)).fill(0).map((_, index) => (
                <tr key={`empty-${index}`} className={((filteredEquipment.length + index) % 2 === 0) ? 'bg-table-row-even' : 'bg-table-row-odd'}>
                  <td className="py-3 px-4">&nbsp;</td>
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

export default InventarioPage;
