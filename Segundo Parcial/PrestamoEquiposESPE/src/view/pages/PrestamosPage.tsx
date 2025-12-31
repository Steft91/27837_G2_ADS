import React, { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import AppSidebar from '@/view/components/layout/AppSidebar';
import { Button } from '@/view/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/view/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { InscripcionRepository } from '@/datos/repository/inscripcionRepository';

// --- 1. Definición de la Clase Materia (Tal cual la pediste) ---
export class Materia {
  constructor(
    public id: string,
    public nombre: string,
    public ubicacion: string,
    public horaInicio: number,
    public horaFin: number,
    public dias: string[],
    public estudianteIds: string, 
  ) {}
}

// --- 2. Mock del Repositorio de Materias (Simulación) ---
// En tu código real, esto vendría de tu archivo @/datos/repository/materiaRepository
class MateriaRepository {
  findById(id: string): Materia | undefined {
    const db: Record<string, Materia> = {
      'm1': new Materia('m1', 'Cálculo Diferencial', 'A-201', 7, 9, ['Lunes', 'Miércoles', 'Viernes'], 'st-01'),
      'm2': new Materia('m2', 'Física Clásica', 'Lab-3', 10, 12, ['Martes', 'Jueves'], 'st-01'),
      'm3': new Materia('m3', 'Programación Web', 'Lab-Comp-1', 14, 16, ['Lunes', 'Miércoles'], 'st-01'),
    };
    return db[id];
  }
}

// --- Constantes ---
const hours = [
  '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm',
  '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'
];

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const equipmentTypes = ['Proyector', 'Laptop', 'Tablet', 'Cámara', 'Micrófono'];

const materiaColors = [
  'bg-[#FFD700]', 'bg-[#90EE90]', 'bg-[#87CEEB]', 'bg-[#FFB6C1]', 
  'bg-[#FFA07A]', 'bg-[#DDA0DD]', 'bg-[#B0C4DE]', 'bg-[#F08080]'
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
  const { user } = useAuth();
  
  const [selectedEquipment, setSelectedEquipment] = useState('Proyector');
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  // --- LÓGICA DE CARGA DE DATOS ---

  const materiaRepo = useMemo(() => new MateriaRepository(), []);
  const inscripcionRepo = useMemo(() => new InscripcionRepository(), []);

  // 1. Cargar Materias del alumno
  const materiasInscritas = useMemo(() => {
    if (!user || user.role !== 'estudiante') return [];
    
    // Asumiendo que esto devuelve [{ materiaId: 'm1' }, { materiaId: 'm2' }...]
    const inscripciones = inscripcionRepo.findByEstudianteId(user.id);
    
    return inscripciones
      .map(insc => materiaRepo.findById(insc.materiaId))
      .filter((m): m is Materia => !!m); 
  }, [user, materiaRepo, inscripcionRepo]);

  // 2. Mapear las materias a los bloques de tiempo (Usando la propiedad 'dias')
  const materiaHorarioMap = useMemo(() => {
    const colorMap: Record<string, string> = {};
    
    // Asignar un color único a cada materia
    materiasInscritas.forEach((mat, idx) => {
      if (mat) colorMap[mat.id] = materiaColors[idx % materiaColors.length];
    });

    // Crear la matriz de horarios vacía
    const map: Record<string, Record<number, { nombre: string; color: string; ubicacion: string }>> = {};
    days.forEach(day => { map[day] = {}; });

    // Llenar la matriz
    materiasInscritas.forEach(mat => {
      // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
      // Iteramos solo sobre los días que tiene la materia en su array `dias`
      mat.dias.forEach(dayName => {
        // Verificamos que el día exista en nuestro mapa (por si hay errores de mayúsculas/tildes)
        if (map[dayName]) {
          for (let h = mat.horaInicio; h < mat.horaFin; h++) {
            map[dayName][h] = { 
              nombre: mat.nombre, 
              ubicacion: mat.ubicacion, // Agregué ubicación para mostrarla opcionalmente
              color: colorMap[mat.id] 
            };
          }
        }
      });
    });

    return map;
  }, [materiasInscritas]);

  // --- LÓGICA DE INTERACCIÓN ---

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
      toast({ title: "Error", description: "Seleccione al menos un horario", variant: "destructive" });
      return;
    }
    // Lógica simulada de aprobación
    Math.random() > 0.3 ? setShowApproved(true) : setShowRejected(true);
    if (Math.random() > 0.3) setRequestCode('QR' + Math.random().toString().slice(2, 10));
  };

  const handleClear = () => setSelectedSlots([]);

  return (
    <AppSidebar>
      <div className="space-y-6 animate-fade-in pb-10">
        <h1 className="text-2xl font-bold text-foreground">Solicitar Préstamo</h1>

        {/* Controles Superiores */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de equipo</label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="w-48 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {equipmentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="espe" onClick={handleSubmit}>Solicitar</Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Marque los bloques deseados. Las materias inscritas aparecen en color.
        </p>

        {/* --- TABLA DE HORARIOS --- */}
        <div className="bg-card rounded-lg overflow-hidden border border-border max-w-[98%] mx-auto shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="w-16 py-3 px-2 text-right text-xs font-medium text-muted-foreground">Hora</th>
                  {days.map(day => (
                    <th key={day} className="py-3 px-1 text-center text-sm font-bold text-foreground w-32 border-l border-border/50">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => {
                  const hourNum = hourStringToNumber[hour];
                  
                  return (
                    <tr key={hour} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                      <td className="py-2 px-2 text-[10px] text-muted-foreground text-right whitespace-nowrap font-medium">
                        {hour}
                      </td>
                      {days.map(day => {
                        // Buscar datos en el mapa pre-calculado
                        const materiaData = materiaHorarioMap[day]?.[hourNum];
                        const isSelected = isSlotSelected(day, hour);
                        
                        return (
                          <td key={`${day}-${hour}`} className="p-[2px] h-14 border-l border-border/40">
                            <button
                              onClick={() => toggleSlot(day, hour)}
                              className={`
                                w-full h-full rounded-md transition-all duration-200 
                                flex flex-col items-center justify-center p-1 relative overflow-hidden
                                ${isSelected 
                                    ? 'ring-2 ring-primary ring-offset-0 z-10 scale-[0.98]' 
                                    : 'scale-100 hover:scale-[0.98]'
                                }
                                ${materiaData 
                                    ? `${materiaData.color} text-slate-900` 
                                    : isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/30 hover:bg-muted'
                                }
                              `}
                            >
                              {materiaData ? (
                                <>
                                  <span className="text-[10px] font-bold leading-tight text-center line-clamp-2">
                                    {materiaData.nombre}
                                  </span>
                                  {/* Opcional: Mostrar ubicación pequeña */}
                                  <span className="text-[8px] opacity-80 mt-0.5 font-mono">
                                    {materiaData.ubicacion}
                                  </span>
                                </>
                              ) : (
                                isSelected && <Check className="w-5 h-5 opacity-90" />
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

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
            Limpiar Selección
          </Button>
        </div>

        {/* Modales de Confirmación */}
        <Dialog open={showApproved} onOpenChange={setShowApproved}>
          <DialogContent className="bg-card max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-center text-primary">¡Solicitud Aprobada!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
               <div className="bg-muted p-4 rounded text-center w-full">
                 <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Código de retiro</p>
                 <p className="text-2xl font-mono font-bold tracking-widest">{requestCode}</p>
               </div>
               <Button onClick={() => setShowApproved(false)} className="w-full" variant="espe">Entendido</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejected} onOpenChange={setShowRejected}>
          <DialogContent className="bg-card max-w-sm">
             <DialogHeader><DialogTitle className="text-destructive">Solicitud Rechazada</DialogTitle></DialogHeader>
             <div className="py-2"><p>No puedes solicitar en este horario o el equipo no está disponible.</p></div>
             <Button onClick={() => setShowRejected(false)} variant="outline" className="w-full">Cerrar</Button>
          </DialogContent>
        </Dialog>

      </div>
    </AppSidebar>
  );
};

export default SolicitarPrestamoPage;