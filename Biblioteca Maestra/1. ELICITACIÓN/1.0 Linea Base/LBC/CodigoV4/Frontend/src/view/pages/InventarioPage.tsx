import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Computer, Loader2 } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/view/components/ui/dialog';
import { Label } from '@/view/components/ui/label';
import { Badge } from '@/view/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';

// Interface matching Backend
interface Dispositivo {
  _id: string; // MongoDB ID uses _id
  type: string;
  brand: string;
  model: string;
  location: string;
  status: 'Disponible' | 'Prestado' | 'Mantenimiento' | 'Dañado';
}

const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];
const statusOptions = ['Disponible', 'Prestado', 'Mantenimiento', 'Dañado'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Disponible': return 'bg-green-500 hover:bg-green-600';
    case 'Prestado': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'Mantenimiento': return 'bg-orange-500 hover:bg-orange-600';
    case 'Dañado': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-slate-500';
  }
};

const InventarioPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Forms
  const [selectedDispositivo, setSelectedDispositivo] = useState<Dispositivo | null>(null);
  const [formData, setFormData] = useState({
    type: 'Proyector',
    brand: '',
    model: '',
    location: '',
    status: 'Disponible'
  });

  useEffect(() => {
    fetchDispositivos();
  }, []);

  const fetchDispositivos = async () => {
    setLoading(true);
    try {
      const response = await api.getDispositivos();
      const content = response.content || [];
      // Ensure data is array
      setDispositivos(Array.isArray(content) ? content : []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los dispositivos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = dispositivos.filter(item => {
    const term = searchTerm.toLowerCase();
    const searchMatch =
      item.model?.toLowerCase().includes(term) ||
      item.brand?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term);

    const matchType = filterType === 'all' || item.type === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;

    return searchMatch && matchType && matchStatus;
  });

  const handleAddEquipment = async () => {
    if (!formData.brand || !formData.model || !formData.location) {
      toast({ title: "Error", description: "Por favor complete todos los campos", variant: "destructive" });
      return;
    }

    try {
      await api.createDispositivo(formData);

      toast({ title: "Éxito", description: "Dispositivo agregado correctamente" });
      setIsAddDialogOpen(false);
      setFormData({
        type: 'Proyector',
        brand: '',
        model: '',
        location: '',
        status: 'Disponible'
      });
      fetchDispositivos();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEditClick = (device: Dispositivo) => {
    setSelectedDispositivo(device);
    setFormData({
      type: device.type,
      brand: device.brand,
      model: device.model,
      location: device.location,
      status: device.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEquipment = async () => {
    if (!selectedDispositivo) return;

    try {
      await api.updateDispositivo(selectedDispositivo._id, formData);

      toast({ title: "Éxito", description: "Dispositivo actualizado correctamente" });
      setIsEditDialogOpen(false);
      setSelectedDispositivo(null);
      fetchDispositivos();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este dispositivo?")) return;

    try {
      await api.deleteDispositivo(id);

      toast({ title: "Éxito", description: "Dispositivo eliminado" });
      fetchDispositivos();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in pb-10">
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        <p className="text-sm text-muted-foreground">
          Gestione los equipos del laboratorio: agregue, edite o elimine dispositivos.
        </p>

        {/* --- Toolbar --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-card p-4 rounded-lg border border-border shadow-sm">

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                {equipmentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Add Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="espe" className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Equipo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) => setFormData({ ...formData, type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej: Dell, Epson"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej: Inspiron 15"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ej: Escaparate 1, Lab A"
                  />
                </div>
                <Button className="w-full mt-4" onClick={handleAddEquipment} variant="espe">
                  Guardar Equipo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Table --- */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 flex justify-center items-center text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              Cargando inventario...
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground gap-4">
              <Computer className="h-16 w-16 opacity-20" />
              <p>No se encontraron dispositivos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Marca / Modelo</th>
                    <th className="px-4 py-3">Ubicación</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEquipment.map((item) => (
                    <tr key={item._id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-4 py-3 font-medium">{item.type}</td>
                      <td className="px-4 py-3">
                        <div className="text-foreground">{item.brand}</div>
                        <div className="text-xs text-muted-foreground">{item.model}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                      <td className="px-4 py-3">
                        <Badge className={`${getStatusColor(item.status)} border-0 text-white`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteEquipment(item._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Equipo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Input
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <Button className="w-full mt-4" onClick={handleUpdateEquipment}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppSidebar>
  );
};

export default InventarioPage;
