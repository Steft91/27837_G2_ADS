import React, { useState, useMemo, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MateriaRepository } from '@/datos/repository/materiaRepository';
import { InscripcionRepository } from '@/datos/repository/inscripcionRepository';

import { Dispositivo } from "@/datos/model/dispositivoModel";
import { DispositivoRepository } from "@/datos/repository/dispositivoRepository";
import { DispositivoController } from "@/controller/dispositivoController";
import { RepositoryObserver } from "@/datos/repository/repositoryObserver";
import { DeviceDisponibility } from '@/types';
import { PrestamoController } from '@/controller/prestamoController';
import { PrestamoRepository } from '@/datos/repository/prestamoRepository';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";

const repository = new DispositivoRepository();
const controller = new DispositivoController(repository);

const prestamoRepository = new PrestamoRepository();
const prestamoController = new PrestamoController(prestamoRepository);

// --- Definición de constantes fuera del componente para limpieza ---
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

  const [selectedEquipment, setSelectedEquipment] = useState('Proyector');
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  const materiaRepo = useMemo(() => new MateriaRepository(), []);
  const inscripcionRepo = useMemo(() => new InscripcionRepository(), []);

  const materiasInscritas = useMemo(() => {
    if (!user || user.role !== 'estudiante') return [];
    const inscripciones = inscripcionRepo.findByEstudianteId(user.id);
    return inscripciones
      .map(insc => materiaRepo.findById(insc.materiaId))
      .filter(Boolean);
  }, [user, materiaRepo, inscripcionRepo]);

  const materiaHorarioMap = useMemo(() => {
    const colorMap: Record<string, string> = {};

    materiasInscritas.forEach((mat, idx) => {
      if (mat) colorMap[mat.id] = materiaColors[idx % materiaColors.length];
    });

    const map: Record<string, Record<number, { nombre: string; color: string }>> = {};
    days.forEach(day => { map[day] = {}; });

    materiasInscritas.forEach(mat => {
      if (!mat) return;
      days.forEach(day => {
        if (mat.dias && mat.dias.includes(day)) {

          for (let h = mat.horaInicio; h < mat.horaFin; h++) {
            map[day][h] = { nombre: mat.nombre, color: colorMap[mat.id] };
          }

        }
      });
    });
    return map;
  }, [materiasInscritas, days]);

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

    const prestamosUsuario = prestamoController.listar().filter(p => p.estudianteId === user?.id);
    const tieneActivo = prestamosUsuario.some(p => p.estado === 'ACTIVO');
    if (tieneActivo) {
      toast({
        title: "Préstamo pendiente",
        description: "No puede solicitar un nuevo préstamo hasta devolver el actual.",
        variant: "destructive",
      });
      return;
    }

    const isApproved = Math.random() > 0.3;
    if (isApproved) {
      try {
        const sortedSlots = [...selectedSlots].sort((a, b) =>
          hours.indexOf(a.hour) - hours.indexOf(b.hour)
        );
        const horaInicioStr = sortedSlots[0].hour;
        const horaFinStr = sortedSlots[sortedSlots.length - 1].hour;
        const day = sortedSlots[0].day;
        const today = new Date();
        const getHour = (h: string) => {
          const [time, ampm] = h.split(' ');
          let [hour] = time.split(':');
          let hr = parseInt(hour, 10);
          if (ampm === 'pm' && hr !== 12) hr += 12;
          if (ampm === 'am' && hr === 12) hr = 0;
          return hr;
        };
        const horaInicio = new Date(today);
        horaInicio.setHours(getHour(horaInicioStr), 0, 0, 0);
        const horaFin = new Date(today);
        horaFin.setHours(getHour(horaFinStr) + 1, 0, 0, 0);

        prestamoController.crear({
          estudianteId: user?.id || '',
          idClase: 'CLASE-FAKE',
          estado: 'ACTIVO',
          horaInicio,
          horaFin,
          idDispositivo: 'DISP-FAKE',
        });

        const prestamos = prestamoController.listar();
        console.log(prestamos);
        const last = prestamos[prestamos.length - 1];
        setRequestCode(last?.code || '');
        setShowApproved(true);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || 'No se pudo crear el préstamo',
          variant: "destructive",
        });
      }
    } else {
      setShowRejected(true);
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

  useEffect(() => {
    setDeviceCategories(controller.obtenerDisponibles());

    const observer: RepositoryObserver<Dispositivo> = {
      update(data) {
        console.log('[Observer] Datos actualizados, refrescando vista:', data);
        setDeviceCategories(controller.obtenerDisponibles());
      },

      error(err) {
        console.error('[Observer] Error detectado:', err.message);
      }
    };

    repository.attach(observer);

    return () => repository.detach(observer);
  }, []);

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Solicitar Préstamo</h1>

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
            <Button variant="espe" className='mx-2' onClick={handleSubmit}>
              Solicitar
            </Button>
            <Button variant="ghost" className='mx-2' onClick={handleClear}>Limpiar Selección</Button>
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
                  const hourNum = hourStringToNumber[hour]; // Convertir "7:00 am" a 7

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
                              className={`w-full h-full rounded-md transition-all duration-200 flex flex-col items-center justify-center p-1 border
                                ${/* Lógica de Estilos */ ''}
                                ${isSelected
                                  ? 'ring-2 ring-primary !bg-primary text-white ring-offset-1 z-10'
                                  : 'border-transparent'
                                }
                                ${materiaEnHorario
                                  ? `${materiaEnHorario.color} hover:brightness-90 text-slate-800` // Estilo si es materia
                                  : isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted' // Estilo slot vacío
                                }
                              `}
                            >
                              {/* Mostrar nombre de la materia si existe */}
                              {materiaEnHorario && (
                                <span className="text-[10px] font-bold leading-tight text-center break-words w-full">
                                  {materiaEnHorario.nombre}
                                </span>
                              )}

                              {/* Indicador de selección si no hay materia (opcional) */}
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