import React, { useState, useMemo, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { DeviceDisponibility } from '@/types';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import { Monitor, Laptop, Tablet, Camera, Mic } from 'lucide-react';

const hours = [
  '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm',
  '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'
];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const materiaColors = [
  'bg-[#FFC9C9]', 'bg-[#FFD6A7]', 'bg-[#FEE685]', 'bg-[#FFF085]',
  'bg-[#D8F999]', 'bg-[#B9F8CF]', 'bg-[#A4F4CF]', 'bg-[#96F7E4]',
  'bg-[#A2F4FD]', 'bg-[#C6D2FF]'
];

const hourStringToNumber: Record<string, number> = {
  '6:00 am': 6, '7:00 am': 7, '8:00 am': 8, '9:00 am': 9, '10:00 am': 10, '11:00 am': 11,
  '12:00 pm': 12, '1:00 pm': 13, '2:00 pm': 14, '3:00 pm': 15, '4:00 pm': 16, '5:00 pm': 17,
  '6:00 pm': 18, '7:00 pm': 19, '8:00 pm': 20, '9:00 pm': 21, '10:00 pm': 22, '11:00 pm': 23,
};

interface SelectedSlot {
  day: string;
  hour: string;
}

const SolicitarPrestamoPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deviceCategories, setDeviceCategories] = useState<DeviceDisponibility[]>([]);
  const [materiasInscritas, setMateriasInscritas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState('Proyector');
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [requestCode, setRequestCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const processDevices = (devices: any[]): DeviceDisponibility[] => {
    const iconMap: any = {
      'Proyector': Monitor,
      'Laptop': Laptop,
      'Pantalla Inteligente': Tablet,
      'Cámara': Camera,
      'Micrófono': Mic,
    };
    const tipoCounts: any = {};

    devices.forEach(d => {
      const tipo = d.type || d.tipo; // Backend might send type or tipo
      if (!tipo) return;

      const tipoTrim = tipo.trim();
      if (!tipoCounts[tipoTrim]) tipoCounts[tipoTrim] = { available: 0, total: 0 };

      tipoCounts[tipoTrim].total++;
      if (d.status === 'Disponible' || d.estado === 'Disponible') {
        tipoCounts[tipoTrim].available++;
      }
    });

    return Object.entries(tipoCounts).map(([type, stats]: [string, any]) => ({
      type,
      available: stats.available,
      total: stats.total,
      icon: iconMap[type] || Monitor
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [dispRes, inscRes, matRes] = await Promise.all([
          api.getDispositivos(),
          api.getInscripciones(),
          api.getMaterias()
        ]);

        if (dispRes.content) {
          setDeviceCategories(processDevices(dispRes.content));
        }

        if (inscRes.content && matRes.content) {
          const myInscriptions = inscRes.content.filter((i: any) => i.estudianteId === user.id);
          const myMaterias = myInscriptions.map((insc: any) => {
            return matRes.content.find((m: any) => (m._id === insc.materiaId || m.id === insc.materiaId));
          }).filter(Boolean);
          setMateriasInscritas(myMaterias);
        }

      } catch (err: any) {
        toast({
          title: "Error al cargar datos",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const materiaHorarioMap = useMemo(() => {
    const colorMap: Record<string, string> = {};

    materiasInscritas.forEach((mat, idx) => {
      if (mat) {
        const id = mat._id || mat.id;
        colorMap[id] = materiaColors[idx % materiaColors.length];
      }
    });

    const map: Record<string, Record<number, { nombre: string; color: string }>> = {};
    days.forEach(day => { map[day] = {}; });

    materiasInscritas.forEach(mat => {
      if (!mat) return;
      // Backend Materia model usually has 'days', 'start', 'end' (numbers)
      // Check backend model structure. Assuming start/end are numbers (hours) based on previous code usage
      // But previous code used horaInicio. Backend seems to use 'start' and 'end' as numbers for Materia.

      const dias = mat.days || mat.dias || [];
      const horaInicio = mat.start || mat.horaInicio;
      const horaFin = mat.end || mat.horaFin;
      const nombre = mat.name || mat.nombre;
      const id = mat._id || mat.id;

      dias.forEach((day: string) => {
        if (days.includes(day)) {
          for (let h = horaInicio; h < horaFin; h++) {
            map[day][h] = { nombre: nombre, color: colorMap[id] };
          }
        }
      });
    });
    return map;
  }, [materiasInscritas]);

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

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "Error",
        description: "Seleccione al menos un horario",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const sortedSlots = [...selectedSlots].sort((a, b) =>
        hours.indexOf(a.hour) - hours.indexOf(b.hour)
      );
      const horaInicioStr = sortedSlots[0].hour;
      const horaFinStr = sortedSlots[sortedSlots.length - 1].hour;
      const day = sortedSlots[0].day; // Assuming all slots are same day, should validate

      // Simple validation that all slots are on same day
      if (!selectedSlots.every(s => s.day === day)) {
        throw new Error("Seleccione horarios del mismo día");
      }

      const today = new Date(); // Need to determine ACTUAL date based on day name.
      // If today is Wednesday and user selects Monday, is it next Monday?
      // Assuming current week or next occurrence.
      // For simplicity, let's assume we pick the next occurrence of that day.

      const dayIndex = days.indexOf(day) + 1; // 1=Lunes, 7=Domingo (JS starts 0=Sunday, 1=Monday)
      // JS getDay(): 0=Sun, 1=Mon...

      const targetDayIndex = days.indexOf(day) + 1; // Lunes=1
      const currentDayIndex = today.getDay() === 0 ? 7 : today.getDay(); // Make Sunday 7

      let daysToAdd = targetDayIndex - currentDayIndex;
      if (daysToAdd < 0) daysToAdd += 7; // Next week
      // If daysToAdd is 0, it means today. Ensure time is in future? Backend checks "No puedes solicitar en pasado".

      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysToAdd);

      const getHour = (h: string) => {
        const [time, ampm] = h.split(' ');
        let [hour] = time.split(':');
        let hr = parseInt(hour, 10);
        if (ampm === 'pm' && hr !== 12) hr += 12;
        if (ampm === 'am' && hr === 12) hr = 0;
        return hr;
      };

      const horaInicio = new Date(targetDate);
      horaInicio.setHours(getHour(horaInicioStr), 0, 0, 0);

      const horaFin = new Date(targetDate);
      horaFin.setHours(getHour(horaFinStr) + 1, 0, 0, 0); // End of the hour

      const payload = {
        tipoDispositivo: selectedEquipment,
        start: horaInicio.toISOString(),
        end: horaFin.toISOString()
      };

      const response = await api.createPrestamo(payload);

      setRequestCode((response.content as any).code);
      setShowApproved(true);
      setSelectedSlots([]);

    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo crear el préstamo');
      setShowRejected(true);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setSelectedSlots([]);

  const getSelectedTimeRange = () => {
    if (selectedSlots.length === 0) return '';
    const sortedSlots = [...selectedSlots].sort((a, b) =>
      hours.indexOf(a.hour) - hours.indexOf(b.hour)
    );
    return `${sortedSlots[0].hour} - ${sortedSlots[sortedSlots.length - 1].hour}`;
  };

  if (loading && deviceCategories.length === 0) { // Initial load
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-foreground mb-[-20px]">Solicitar Préstamo</h1>
        <hr className='mt-0'></hr>

        {/* Equipment Selection */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de equipo</label>
            <div className='flex'>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-48 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {deviceCategories.map(category => (
                    <SelectItem key={category.type} value={category.type}>{category.type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                className='mt-2 mx-5 italic text-primary underline hover:text-primary/80 transition-colors'
                type='button'
                onClick={() => navigate('/dispositivos')}
              >
                Revisar Disponibilidad
              </button>
            </div>


          </div>
          <div>
            <Button variant="espe" className='mx-2' onClick={handleSubmit} disabled={loading}>
              Solicitar
            </Button>
            <Button variant="ghost" className='mx-2' onClick={handleClear} disabled={loading}>Limpiar Selección</Button>
          </div>

        </div>

        <p className="text-sm text-muted-foreground">
          Cada bloque representa <span className="font-bold text-foreground">1 h</span>. Las materias inscritas se muestran en color.
        </p>

        {/* Schedule Grid */}
        <div className="bg-card rounded-lg overflow-hidden max-w-[95%] mx-auto overflow-y-scroll max-h-[60vh]">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <th className="w-20 py-2 px-2 text-right text-xs font-medium text-muted-foreground"></th>
                  {days.map(day => (
                    <th key={day} className="py-2 px-1 text-center text-sm font-medium text-foreground w-32">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => {
                  const hourNum = hourStringToNumber[hour];

                  return (
                    <tr key={hour}>
                      <td className="py-1 px-2 text-xs text-muted-foreground text-right whitespace-nowrap">
                        {hour}
                      </td>
                      {days.map(day => {
                        const materiaEnHorario = materiaHorarioMap[day]?.[hourNum];
                        const isSelected = isSlotSelected(day, hour);

                        return (
                          <td key={`${day}-${hour}`} className="p-0.5 h-12">
                            <button
                              onClick={() => toggleSlot(day, hour)}
                              disabled={loading}
                              className={`w-full h-full rounded-md transition-all duration-200 flex flex-col items-center justify-center p-1 border
                                ${/* Lógica de Estilos */ ''}
                                ${isSelected
                                  ? 'ring-2 ring-primary !bg-primary text-white ring-offset-1 z-10'
                                  : 'border-transparent'
                                }
                                ${materiaEnHorario
                                  ? `${materiaEnHorario.color} hover:brightness-90 text-slate-800`
                                  : isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
                                }
                              `}
                            >
                              {materiaEnHorario && (
                                <span className="text-[10px] font-bold leading-tight text-center break-words w-full">
                                  {materiaEnHorario.nombre}
                                </span>
                              )}

                              {!materiaEnHorario && isSelected && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                <p>Fecha: {new Date().toLocaleDateString()}</p>
                <p>Solicitante: {user?.name}</p>
                <p>Equipo: {selectedEquipment}</p>
                <p>Horario: {getSelectedTimeRange()}</p>
              </div>
              <p className="text-sm text-primary">
                Usa el código al momento de recoger el equipo y al momento de devolverlo
              </p>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">CÓDIGO DE SOLICITUD</p>
                <div className="w-32 h-32 mx-auto bg-white mb-2 rounded p-2 flex items-center justify-center shadow-sm">
                  {requestCode && (
                    <QRCode
                      value={requestCode}
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      fgColor="#000000"
                      bgColor="#ffffff"
                      level="M"
                    />
                  )}
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
                  {errorMessage || "La solicitud no pudo ser procesada."}
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