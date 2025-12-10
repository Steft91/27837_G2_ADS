import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];

const SolicitudEspecialPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    equipmentType: 'Proyector',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud especial ha sido enviada para revisión",
    });
    setFormData({
      equipmentType: 'Proyector',
      date: '',
      startTime: '',
      endTime: '',
      reason: '',
    });
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Solicitud Especial</h1>
        </div>

        <p className="text-muted-foreground">
          Completa el formulario para solicitar un préstamo fuera del horario regular o por circunstancias especiales.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Solicitante</Label>
              <Input value={user?.name || ''} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Equipo</Label>
              <Select 
                value={formData.equipmentType} 
                onValueChange={(v) => setFormData({...formData, equipmentType: v})}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="bg-card"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Hora Inicio</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="bg-card"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="bg-card"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motivo de la Solicitud</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Describe el motivo de tu solicitud especial..."
              className="bg-card min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" variant="espe" className="w-full">
            Enviar Solicitud
          </Button>
        </form>
      </div>
    </AppSidebar>
  );
};

export default SolicitudEspecialPage;
