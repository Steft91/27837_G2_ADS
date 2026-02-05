import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Computer } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/view/components/ui/dialog';
import { Label } from '@/view/components/ui/label';
import { Badge } from '@/view/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {EquipmentStatus } from '@/types';

import { Dispositivo } from "@/datos/model/dispositivoModel";
import { DispositivoRepository } from "@/datos/repository/dispositivoRepository";
import { DispositivoController } from "@/controller/dispositivoController";
import { RepositoryObserver } from "@/datos/repository/repositoryObserver";

const repository = new DispositivoRepository();
const controller = new DispositivoController(repository);


const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];
const statusOptions: EquipmentStatus[] = ['Disponible', 'Prestado', 'Mantenimiento', 'Dañado'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Disponible': return 'bg-status-available text-success-foreground';
    case 'Prestado': return 'bg-status-borrowed text-warning-foreground';
    case 'Mantenimiento': return 'bg-status-maintenance text-warning-foreground';
    case 'Dañado': return 'bg-status-damaged text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const InventarioPage: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterModel, setFilterModel] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDispositivo, setSelectedDispositivo] = useState<Dispositivo | null>(null);

  const [editForm, setEditForm] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    ubicacion: '',
    estado: 'Disponible',
  });

  const [newEquipment, setNewEquipment] = useState({
    tipo: 'Proyector',
    marca: '',
    modelo: '',
    ubicacion: '',
    estado: 'Disponible',
  });


  useEffect(() => {
    const observer: RepositoryObserver<Dispositivo> = {
      update(data) {
        console.log('[Observer] Update exitoso:', data);
        setDispositivos(data);
      },

      error(err) {
        console.error('[Observer] Error detectado:', err.message);
      }
    };

    repository.attach(observer);
    setDispositivos(repository.findAll());

    return () => repository.detach(observer);
  }, []);

  const filteredEquipment = dispositivos.filter(item => {
    const matchesSearch = item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.tipo === filterType;
    const matchesStatus = filterStatus === 'all' || item.estado === filterStatus;
    const matchesModel = filterModel === 'all' || item.modelo === filterModel;
    return matchesSearch && matchesType && matchesStatus && matchesModel;
  });

  const handleAddEquipment = () => {
    try {
      controller.crear(newEquipment);

      setIsAddDialogOpen(false);
      setNewEquipment({
        tipo: 'Proyector',
        marca: '',
        modelo: '',
        ubicacion: '',
        estado: 'Disponible',
      });

      const last = dispositivos.at(-1);

      toast({
        title: "Equipo agregado",
        description: `El equipo ${last?.id} ha sido agregado al inventario`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateEquipment = () => {
    if (!selectedDispositivo) return;

    try {
      controller.actualizar(selectedDispositivo.id, editForm);

      setIsEditDialogOpen(false);
      setSelectedDispositivo(null);

      toast({
        title: "Equipo actualizado",
        description: `El equipo ${selectedDispositivo.id} fue actualizado`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEquipment = (id: string) => {
    try {
      controller.eliminar(id);

      toast({
        title: "Equipo eliminado",
        description: `El equipo ${id} ha sido eliminado del inventario`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  const uniqueModels = [...new Set(dispositivos.map(e => e.modelo))];

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
                    value={newEquipment.tipo}
                    onValueChange={(v) => setNewEquipment({ ...newEquipment, tipo: v })}
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
                    value={newEquipment.marca}
                    onChange={(e) => setNewEquipment({ ...newEquipment, marca: e.target.value })}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    value={newEquipment.modelo}
                    onChange={(e) => setNewEquipment({ ...newEquipment, modelo: e.target.value })}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input
                    value={newEquipment.ubicacion}
                    onChange={(e) => setNewEquipment({ ...newEquipment, ubicacion: e.target.value })}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={newEquipment.estado}
                    onValueChange={(v) => setNewEquipment({ ...newEquipment, estado: v as EquipmentStatus })}
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

          {/* Dialog para actualizar el dispositivo */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Editar Equipo</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  value={editForm.marca}
                  onChange={e => setEditForm({ ...editForm, marca: e.target.value })}
                  placeholder="Marca"
                />

                <Input
                  value={editForm.modelo}
                  onChange={e => setEditForm({ ...editForm, modelo: e.target.value })}
                  placeholder="Modelo"
                />

                <Input
                  value={editForm.ubicacion}
                  onChange={e => setEditForm({ ...editForm, ubicacion: e.target.value })}
                  placeholder="Ubicación"
                />

                <Select
                  value={editForm.estado}
                  onValueChange={v =>
                    setEditForm({ ...editForm, estado: v as EquipmentStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleUpdateEquipment}
                >
                  Guardar Cambios
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
        {filteredEquipment.length > 0 ?
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
                  <td className="py-3 px-4 text-sm text-foreground">{item.tipo}</td>
                  <td className="py-3 px-4 text-sm text-primary underline cursor-pointer">{item.marca} {item.modelo}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{item.ubicacion}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(item.estado)}>
                      {item.estado}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDispositivo(item);
                          setEditForm({
                            tipo: item.tipo,
                            marca: item.marca,
                            modelo: item.modelo,
                            ubicacion: item.ubicacion,
                            estado: item.estado,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
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
            </tbody>
          </table>
        :
        <div className='text-center align-middle h-[200px] rounded flex flex-col items-center justify-center'>
          <Computer className="h-24 w-24" />
          <br></br>
          <h2 className='text-2xl font-bold text-foreground'>Aun no se Han agregado Dispositivos</h2>
        </div>
        }
        </div>
      </div>
    </AppSidebar>
  );
};

export default InventarioPage;
