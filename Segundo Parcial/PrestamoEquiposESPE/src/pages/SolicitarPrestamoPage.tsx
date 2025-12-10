import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const hours = [
  '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm',
  '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'
];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];

interface SelectedSlot {
  day: string;
  hour: string;
}

const SolicitarPrestamoPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState('Proyector');
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  const toggleSlot = (day: string, hour: string) => {
    const exists = selectedSlots.find(s => s.day === day && s.hour === hour);
    if (exists) {
      setSelectedSlots(selectedSlots.filter(s => !(s.day === day && s.hour === hour)));
    } else {
      setSelectedSlots([...selectedSlots, { day, hour }]);
    }
  };

  const isSlotSelected = (day: string, hour: string) => {
    return selectedSlots.some(s => s.day === day && s.hour === hour);
  };

  const handleSubmit = () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "Error",
        description: "Seleccione al menos un horario",
        variant: "destructive",
      });
      return;
    }

    // Simulate approval/rejection (70% approval rate for demo)
    const isApproved = Math.random() > 0.3;

    if (isApproved) {
      const code = 'QR' + Math.random().toString().slice(2, 10);
      setRequestCode(code);
      setShowApproved(true);
    } else {
      setShowRejected(true);
    }
  };

  const handleClear = () => {
    setSelectedSlots([]);
  };

  const getSelectedTimeRange = () => {
    if (selectedSlots.length === 0) return '';
    const sortedSlots = [...selectedSlots].sort((a, b) =>
      hours.indexOf(a.hour) - hours.indexOf(b.hour)
    );
    return `${sortedSlots[0].hour} - ${sortedSlots[sortedSlots.length - 1].hour.replace('am', 'am').replace('pm', 'pm')}`;
  };

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Solicitar Préstamo</h1>

        {/* Equipment Selection */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de equipo</label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="w-48 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {equipmentTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="espe" onClick={handleSubmit}>
            Solicitar
          </Button>
        </div>

        {/* Instructions */}
        <p className="text-sm text-muted-foreground">
          Cada bloque representa <span className="font-bold text-foreground">1 h</span>, marque los bloques para los cuales desee solicitar el préstamo
        </p>

        {/* Schedule Grid */}
        <div className="bg-card rounded-lg overflow-hidden max-w-[80%] mx-auto"> {/* <--- AQUI */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr> {/* Eliminado bg-table-header y borders */}
                  <th className="w-24 py-2 px-2 text-right text-xs font-medium text-muted-foreground">
                    {/* Espacio vacío para la columna de horas */}
                  </th>
                  {days.map(day => (
                    <th key={day} className="py-2 px-1 text-center text-sm font-medium text-foreground">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}> {/* Eliminados colores de fila alternados y borders */}
                    <td className="py-1 px-2 text-xs text-muted-foreground text-right whitespace-nowrap">
                      {hour}
                    </td>
                    {days.map(day => (
                      <td
                        key={`${day}-${hour}`}
                        className="py-0.5 px-2" /* Padding reducido de p-1 a p-0.5 */
                      >
                        <button
                          onClick={() => toggleSlot(day, hour)}
                          className={`w-full h-7 rounded-md transition-all duration-200 ${ /* Altura reducida a h-7 */
                            isSlotSelected(day, hour)
                              ? 'bg-primary hover:bg-primary/90 shadow-sm transform scale-95'
                              : 'bg-[#a0a0a0] hover:bg-muted' // Color más sutil para los no seleccionados
                            }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex justify-end">
          <Button variant="clear" onClick={handleClear}>
            Limpiar
          </Button>
        </div>

        {/* Approved Dialog */}
        <Dialog open={showApproved} onOpenChange={setShowApproved}>
          <DialogContent className="bg-card max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-primary">
                <Check className="h-6 w-6" />
                Solicitud Aprobada
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm space-y-1 text-foreground">
                <p>Fecha: {new Date().toISOString().split('T')[0]}</p>
                <p>Solicitante: {user?.name}</p>
                <p>Equipo: {selectedEquipment}</p>
                <p>Horario: {getSelectedTimeRange()}</p>
              </div>
              <p className="text-sm text-primary">
                Usa el código al momento de recoger el equipo y al momento de devolverlo
              </p>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">CÓDIGO DE SOLICITUD</p>
                <div className="w-32 h-32 mx-auto bg-foreground mb-2 rounded flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-0.5">
                    {Array(64).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-background' : 'bg-foreground'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-bold text-lg text-foreground">{requestCode}</p>
              </div>
              <Button
                variant="espe"
                className="w-full"
                onClick={() => {
                  setShowApproved(false);
                  setSelectedSlots([]);
                }}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rejected Dialog */}
        <Dialog open={showRejected} onOpenChange={setShowRejected}>
          <DialogContent className="bg-card max-w-md p-0 overflow-hidden">
            <div className="bg-destructive p-4">
              <DialogTitle className="text-destructive-foreground">Solicitud Rechazada</DialogTitle>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">Motivo</p>
                <p className="text-sm text-destructive">
                  La solicitud que intentaste realizar se encuentra fuera de tu horario, por favor solicita de nuevo o realiza una solicitud especial
                </p>
              </div>
              <Button
                variant="espe"
                className="w-full"
                onClick={() => setShowRejected(false)}
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppSidebar>
  );
};

export default SolicitarPrestamoPage;